package main

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/mail"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	stream "github.com/gojhonny/langdrift/messaging/runtime/early-access/event-streaming"
	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	resend "github.com/resend/resend-go/v3"
)

var (
	errExpired           = errors.New("retry_window_expired")
	errProviderPermanent = errors.New("provider_permanent_failure")
	errInvalidPayload    = errors.New("invalid_payload")
)

type sender struct {
	send    func(context.Context, string, events.EmailStoredPayload) (string, error)
	publish func(context.Context, events.Envelope) error
}

type resendClient struct {
	http                   *http.Client
	endpoint, apiKey, from string
}

type limitedResponseBody struct {
	io.Reader
	io.Closer
}

type limitedTransport struct{ base http.RoundTripper }

type senderConfig struct {
	natsURL  string
	key      string
	from     string
	endpoint string
	addr     string
	mode     string
}

func (transport limitedTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	response, err := transport.base.RoundTrip(request)
	if err != nil {
		return nil, err
	}
	status := response.StatusCode
	isClientError := status >= 400 && status < 500
	isRequestTimeout := status == http.StatusRequestTimeout
	isTooEarly := status == http.StatusTooEarly
	isTooManyRequests := status == http.StatusTooManyRequests
	permanentClientError := isClientError && !isRequestTimeout && !isTooEarly && !isTooManyRequests
	if permanentClientError {
		_ = response.Body.Close()
		return nil, errProviderPermanent
	}
	response.Body = limitedResponseBody{
		Reader: io.LimitReader(response.Body, 4096),
		Closer: response.Body,
	}
	return response, nil
}

func required(name string) string {
	value := os.Getenv(name)
	if value == "" {
		slog.Error("missing_environment", "name", name)
		os.Exit(1)
	}
	return value
}

func loadSenderConfig() senderConfig {
	cfg := senderConfig{
		natsURL:  required("NATS_URL"),
		key:      required("RESEND_API_KEY"),
		from:     required("RESEND_FROM"),
		endpoint: required("RESEND_API_URL"),
		addr:     required("HEALTH_ADDR"),
		mode:     required("EARLY_ACCESS_MODE"),
	}
	if err := stream.ValidateNATSURL(cfg.natsURL, cfg.mode); err != nil {
		slog.Error("invalid_runtime_connection")
		os.Exit(1)
	}
	_, err := mail.ParseAddress(cfg.from)
	keyTooShort := len(cfg.key) < 20
	missingPrefix := !strings.HasPrefix(cfg.key, "re_")
	looksMock := strings.Contains(cfg.key, "mock")
	looksPlaceholder := strings.Contains(cfg.key, "placeholder")
	invalidProductionKey := cfg.mode == "production" && (keyTooShort || missingPrefix || looksMock || looksPlaceholder)
	if err != nil || invalidProductionKey {
		slog.Error("invalid_provider_credentials")
		os.Exit(1)
	}
	if err := validateResendEndpoint(cfg.endpoint, cfg.mode); err != nil {
		slog.Error("invalid_provider_endpoint")
		os.Exit(1)
	}
	return cfg
}

func main() {
	cfg := loadSenderConfig()
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	nc, err := nats.Connect(cfg.natsURL, nats.Timeout(5*time.Second), nats.MaxReconnects(-1))
	if err != nil {
		slog.Error("nats_connect_failed")
		os.Exit(1)
	}
	defer nc.Close()
	js, err := jetstream.New(nc)
	if err != nil {
		slog.Error("jetstream_failed")
		os.Exit(1)
	}
	startup, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()
	if err = stream.Bootstrap(startup, js); err != nil {
		slog.Error("topology_failed")
		os.Exit(1)
	}
	consumer, err := js.Consumer(startup, stream.StreamName, stream.SenderConsumer)
	if err != nil {
		slog.Error("consumer_failed")
		os.Exit(1)
	}
	provider := resendClient{
		http: &http.Client{
			Timeout: 10 * time.Second,
			Transport: limitedTransport{
				base: http.DefaultTransport,
			},
			CheckRedirect: func(*http.Request, []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
		endpoint: cfg.endpoint,
		apiKey:   cfg.key,
		from:     cfg.from,
	}
	worker := sender{
		send: provider.send,
		publish: func(ctx context.Context, event events.Envelope) error {
			return stream.Publish(ctx, js, event)
		},
	}
	server := &http.Server{
		Addr:              cfg.addr,
		Handler:           healthRoutesWithReady(nc.IsConnected),
		ReadHeaderTimeout: 2 * time.Second,
		ReadTimeout:       5 * time.Second,
		WriteTimeout:      5 * time.Second,
		IdleTimeout:       30 * time.Second,
	}
	go func() {
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("http_server_failed")
			stop()
		}
	}()
	slog.Info("email_sender_ready")
	worker.consume(ctx, consumer)
	shutdown, finish := context.WithTimeout(context.Background(), 10*time.Second)
	defer finish()
	_ = server.Shutdown(shutdown)
}

func healthRoutes() http.Handler {
	return healthRoutesWithReady(func() bool { return true })
}

func healthRoutesWithReady(ready func() bool) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.WriteHeader(http.StatusOK)
		_, _ = io.WriteString(w, `{"status":"ok"}`)
	})
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) {
		if !ready() {
			w.Header().Set("Retry-After", "1")
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"status":"ok"}`)
	})
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		mux.ServeHTTP(w, r)
	})
}

func acknowledgement(locale string) (string, string) {
	switch locale {
	case "pt-BR":
		return "Você está na lista de acesso antecipado do LangDrift",
			"Recebemos seu interesse no LangDrift. " +
				"Avisaremos quando o acesso estiver disponível. " +
				"Seu teste de 15 dias começa quando seu acesso for ativado."
	case "zh-Hant":
		return "您已加入 LangDrift 搶先體驗名單",
			"我們已收到您的登記。存取權限開放時會通知您。" +
				"15 天試用將在存取權限啟用時開始。"
	case "ja":
		return "LangDrift の先行アクセスに登録されました",
			"ご登録を受け付けました。アクセスが利用可能になりましたらお知らせします。" +
				"15日間のトライアルはアクセスが有効になった時点で始まります。"
	default:
		return "You're on the LangDrift early-access list",
			"We've received your interest in LangDrift. " +
				"We'll let you know when access is available. " +
				"Your 15-day trial starts when your access is activated."
	}
}

func validateResendEndpoint(raw, mode string) error {
	endpoint, err := url.Parse(raw)
	if err != nil {
		return errors.New("invalid_provider_endpoint")
	}
	hasUser := endpoint.User != nil
	hasQuery := endpoint.RawQuery != ""
	hasFragment := endpoint.Fragment != ""
	wrongPath := endpoint.Path != "/emails"
	if hasUser || hasQuery || hasFragment || wrongPath {
		return errors.New("invalid_provider_endpoint")
	}
	if mode == "production" && raw == "https://api.resend.com/emails" {
		return nil
	}
	if mode == "development" || mode == "test" {
		isHTTP := endpoint.Scheme == "http"
		isMock := endpoint.Hostname() == "resend-mock"
		isLocalhost := endpoint.Hostname() == "localhost"
		isLoopback := endpoint.Hostname() == "127.0.0.1"
		if isHTTP && (isMock || isLocalhost || isLoopback) {
			return nil
		}
	}
	return errors.New("invalid_provider_endpoint")
}

func (provider resendClient) send(ctx context.Context, id string, input events.EmailStoredPayload) (string, error) {
	subject, text := acknowledgement(input.Locale)
	base, err := url.Parse(strings.TrimSuffix(provider.endpoint, "/emails") + "/")
	if err != nil {
		return "", errors.New("provider_request_failed")
	}
	client := resend.NewCustomClient(provider.http, provider.apiKey)
	client.BaseURL = base
	result, err := client.Emails.SendWithOptions(
		ctx,
		&resend.SendEmailRequest{
			From:    provider.from,
			To:      []string{input.Email},
			Subject: subject,
			Text:    text,
		},
		&resend.SendEmailOptions{
			IdempotencyKey: "early-access-ack/" + id,
		},
	)
	if err != nil {
		if errors.Is(err, errProviderPermanent) {
			return "", errProviderPermanent
		}
		return "", errors.New("provider_rejected")
	}
	if result == nil || result.Id == "" {
		return "", errors.New("provider_invalid_response")
	}
	return result.Id, nil
}

func (worker sender) process(ctx context.Context, event events.Envelope) error {
	if !time.Now().Before(event.OccurredAt.Add(stream.SenderWindow)) {
		return errExpired
	}
	var input events.EmailStoredPayload
	if events.DecodeJSON(event.Payload, &input) != nil || input.ObjectKey == "" {
		return errInvalidPayload
	}
	validation := events.EmailReceivedPayload{
		Email:  input.Email,
		Locale: input.Locale,
		Source: input.Source,
	}
	if validation.Validate() != nil {
		return errInvalidPayload
	}
	deadline, cancel := context.WithDeadline(ctx, event.OccurredAt.Add(stream.SenderWindow))
	defer cancel()
	id, err := worker.send(deadline, event.ID, input)
	if err != nil {
		return err
	}
	next, err := events.Next(
		event,
		events.TypeEmailSent,
		event.OccurredAt,
		events.EmailSentPayload{
			Email:             input.Email,
			Provider:          "resend",
			ProviderMessageID: id,
		},
	)
	if err != nil {
		return err
	}
	if err = worker.publish(deadline, next); err != nil {
		return errors.New("publication_failed")
	}
	return nil
}

type messageConsumer interface {
	Next(...jetstream.FetchOpt) (jetstream.Msg, error)
}

func (worker sender) consume(ctx context.Context, consumer messageConsumer) {
	for ctx.Err() == nil {
		message, err := consumer.Next(jetstream.FetchMaxWait(time.Second))
		if err != nil {
			if !errors.Is(err, nats.ErrTimeout) {
				select {
				case <-ctx.Done():
					return
				case <-time.After(time.Second):
				}
			}
			continue
		}
		event, err := events.Decode(message.Data(), events.TypeEmailStored)
		if err != nil {
			_ = message.Term()
			slog.Warn("invalid_stored_event")
			continue
		}
		attempt, cancel := context.WithTimeout(ctx, 15*time.Second)
		err = worker.process(attempt, event)
		if err == nil {
			err = message.DoubleAck(attempt)
		}
		cancel()
		switch {
		case errors.Is(err, errExpired):
			_ = message.Term()
			slog.Warn("sender_retry_window_expired", "event_id", event.ID)
		case errors.Is(err, errProviderPermanent):
			_ = message.Term()
			slog.Warn("sender_permanent_failure", "event_id", event.ID)
		case errors.Is(err, errInvalidPayload):
			_ = message.Term()
			slog.Warn("sender_invalid_payload", "event_id", event.ID)
		case err != nil:
			slog.Warn(
				"sender_attempt_failed",
				"event_id",
				event.ID,
				"event_type",
				event.Type,
			)
		}
	}
}
