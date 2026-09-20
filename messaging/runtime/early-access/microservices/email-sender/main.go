package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	stream "github.com/gojhonny/langdrift/messaging/runtime/early-access/event-streaming"
	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

var errExpired = errors.New("retry_window_expired")

type sender struct {
	send    func(context.Context, string, events.EmailStoredPayload) (string, error)
	publish func(context.Context, events.Envelope) error
}
type resendClient struct {
	http                   *http.Client
	endpoint, apiKey, from string
}
type resendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Text    string   `json:"text"`
}

func required(name string) string {
	value := os.Getenv(name)
	if value == "" {
		slog.Error("missing_environment", "name", name)
		os.Exit(1)
	}
	return value
}
func main() {
	natsURL, key, from := required("NATS_URL"), required("RESEND_API_KEY"), required("RESEND_FROM")
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	nc, err := nats.Connect(natsURL, nats.Timeout(5*time.Second), nats.MaxReconnects(-1))
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
	provider := resendClient{http: &http.Client{Timeout: 10 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}, endpoint: "https://api.resend.com/emails", apiKey: key, from: from}
	worker := sender{send: provider.send, publish: func(ctx context.Context, event events.Envelope) error { return stream.Publish(ctx, js, event) }}
	slog.Info("email_sender_ready")
	worker.consume(ctx, consumer)
}
func acknowledgement(locale string) (string, string) {
	switch locale {
	case "pt-BR":
		return "Você está na lista de acesso antecipado do LangDrift", "Recebemos seu interesse no LangDrift. Avisaremos quando o acesso estiver disponível. Seu teste de 15 dias começa quando seu acesso for ativado."
	case "zh-Hant":
		return "您已加入 LangDrift 搶先體驗名單", "我們已收到您的登記。存取權限開放時會通知您。15 天試用將在存取權限啟用時開始。"
	case "ja":
		return "LangDrift の先行アクセスに登録されました", "ご登録を受け付けました。アクセスが利用可能になりましたらお知らせします。15日間のトライアルはアクセスが有効になった時点で始まります。"
	default:
		return "You're on the LangDrift early-access list", "We've received your interest in LangDrift. We'll let you know when access is available. Your 15-day trial starts when your access is activated."
	}
}
func (provider resendClient) send(ctx context.Context, id string, input events.EmailStoredPayload) (string, error) {
	subject, text := acknowledgement(input.Locale)
	data, err := json.Marshal(resendRequest{From: provider.from, To: []string{input.Email}, Subject: subject, Text: text})
	if err != nil {
		return "", err
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, provider.endpoint, bytes.NewReader(data))
	if err != nil {
		return "", errors.New("provider_request_failed")
	}
	request.Header.Set("Authorization", "Bearer "+provider.apiKey)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Idempotency-Key", "early-access-ack/"+id)
	response, err := provider.http.Do(request)
	if err != nil {
		return "", errors.New("provider_unavailable")
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return "", errors.New("provider_rejected")
	}
	var result struct {
		ID string `json:"id"`
	}
	if json.NewDecoder(io.LimitReader(response.Body, 4096)).Decode(&result) != nil || result.ID == "" {
		return "", errors.New("provider_invalid_response")
	}
	return result.ID, nil
}
func (worker sender) process(ctx context.Context, event events.Envelope) error {
	if !time.Now().Before(event.OccurredAt.Add(stream.SenderWindow)) {
		return errExpired
	}
	var input events.EmailStoredPayload
	if events.DecodeJSON(event.Payload, &input) != nil || input.ObjectKey == "" {
		return errors.New("invalid_payload")
	}
	validation := events.EmailReceivedPayload{Email: input.Email, Locale: input.Locale, Source: input.Source}
	if validation.Validate() != nil {
		return errors.New("invalid_payload")
	}
	deadline, cancel := context.WithDeadline(ctx, event.OccurredAt.Add(stream.SenderWindow))
	defer cancel()
	id, err := worker.send(deadline, event.ID, input)
	if err != nil {
		return err
	}
	next, err := events.Next(event, events.TypeEmailSent, event.OccurredAt, events.EmailSentPayload{Email: input.Email, Provider: "resend", ProviderMessageID: id})
	if err != nil {
		return err
	}
	if err = worker.publish(deadline, next); err != nil {
		return errors.New("publication_failed")
	}
	return nil
}
func (worker sender) consume(ctx context.Context, consumer jetstream.Consumer) {
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
		if errors.Is(err, errExpired) {
			_ = message.Term()
			slog.Warn("sender_retry_window_expired", "event_id", event.ID)
		} else if err != nil {
			slog.Warn("sender_attempt_failed", "event_id", event.ID, "event_type", event.Type)
		}
	}
}
