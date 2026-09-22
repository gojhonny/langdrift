package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	stream "github.com/gojhonny/langdrift/messaging/runtime/early-access/event-streaming"
	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"golang.org/x/time/rate"
)

type contact struct {
	EventID    string    `json:"eventId"`
	Email      string    `json:"email"`
	Locale     string    `json:"locale"`
	Source     string    `json:"source"`
	ReceivedAt time.Time `json:"receivedAt"`
	StoredAt   time.Time `json:"storedAt"`
}

var errInvalidPayload = errors.New("invalid_payload")

type application struct {
	apiKey   string
	publish  func(context.Context, events.Envelope) error
	persist  func(context.Context, string, contact) (contact, error)
	limiter  *rate.Limiter
	inFlight chan struct{}
	ready    func(context.Context) bool
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
	apiKey, addr, natsURL := required("EMAIL_SERVICE_API_KEY"), required("API_ADDR"), required("NATS_URL")
	endpoint, bucket := required("MINIO_ENDPOINT"), required("MINIO_BUCKET")
	access, secret := required("MINIO_ACCESS_KEY"), required("MINIO_SECRET_KEY")
	ssl, err := strconv.ParseBool(required("MINIO_USE_SSL"))
	if err != nil {
		slog.Error("invalid_environment", "name", "MINIO_USE_SSL")
		os.Exit(1)
	}
	mode := required("EARLY_ACCESS_MODE")
	if err := stream.ValidateNATSURL(natsURL, mode); err != nil {
		slog.Error("invalid_runtime_connection")
		os.Exit(1)
	}
	if mode == "production" && (!ssl || len(apiKey) < 32 || len(secret) < 16 || access == "local-minio") {
		slog.Error("insecure_production_transport")
		os.Exit(1)
	}
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
	storage, err := minio.New(endpoint, &minio.Options{Creds: credentials.NewStaticV4(access, secret, ""), Secure: ssl})
	if err != nil {
		slog.Error("storage_config_failed")
		os.Exit(1)
	}
	exists, err := storage.BucketExists(startup, bucket)
	if err != nil {
		slog.Error("storage_unavailable")
		os.Exit(1)
	}
	if !exists {
		if err = storage.MakeBucket(startup, bucket, minio.MakeBucketOptions{}); err != nil {
			// Another replica may have created the bucket between check and creation.
			exists, checkErr := storage.BucketExists(startup, bucket)
			if checkErr != nil || !exists {
				slog.Error("bucket_creation_failed")
				os.Exit(1)
			}
		}
	}
	app := &application{apiKey: apiKey, limiter: rate.NewLimiter(50, 100), inFlight: make(chan struct{}, 64),
		ready: func(ctx context.Context) bool {
			if !nc.IsConnected() {
				return false
			}
			exists, err := storage.BucketExists(ctx, bucket)
			return err == nil && exists
		},
		publish: func(ctx context.Context, event events.Envelope) error { return stream.Publish(ctx, js, event) },
		persist: func(ctx context.Context, key string, value contact) (contact, error) {
			return persistContact(ctx, storage, bucket, key, value)
		},
	}
	consumer, err := js.Consumer(startup, stream.StreamName, stream.StoreConsumer)
	if err != nil {
		slog.Error("consumer_failed")
		os.Exit(1)
	}
	done := make(chan struct{})
	go func() { defer close(done); app.consume(ctx, consumer) }()
	server := newServer(addr, app.routes())
	go func() {
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("http_server_failed")
			stop()
		}
	}()
	slog.Info("email_store_ready")
	<-ctx.Done()
	shutdown, finish := context.WithTimeout(context.Background(), 10*time.Second)
	defer finish()
	_ = server.Shutdown(shutdown)
	select {
	case <-done:
	case <-shutdown.Done():
	}
}
func newServer(addr string, handler http.Handler) *http.Server {
	return &http.Server{Addr: addr, Handler: handler, ReadHeaderTimeout: 2 * time.Second, ReadTimeout: 5 * time.Second, WriteTimeout: 5 * time.Second, IdleTimeout: 30 * time.Second, MaxHeaderBytes: 16 * 1024}
}
func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) { respond(w, 200, `{"status":"ok"}`) })
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), time.Second)
		defer cancel()
		if app.ready == nil || !app.ready(ctx) {
			respond(w, http.StatusServiceUnavailable, `{"status":"unavailable"}`)
			return
		}
		respond(w, http.StatusOK, `{"status":"ok"}`)
	})
	mux.HandleFunc("POST /v1/emails", app.receive)
	return recoverHTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		if r.Method == http.MethodGet && (r.URL.Path == "/healthz" || r.URL.Path == "/readyz") {
			mux.ServeHTTP(w, r)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 4*1024)
		if !app.limiter.Allow() {
			w.Header().Set("Retry-After", "1")
			respond(w, 429, `{"error":"rate_limited"}`)
			return
		}
		select {
		case app.inFlight <- struct{}{}:
			defer func() { <-app.inFlight }()
		default:
			w.Header().Set("Retry-After", "1")
			respond(w, 503, `{"error":"unavailable"}`)
			return
		}
		if r.ContentLength > 4*1024 {
			respond(w, 413, `{"error":"body_too_large"}`)
			return
		}
		mux.ServeHTTP(w, r)
	}))
}
func recoverHTTP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				slog.Error("http_panic_recovered", "path", r.URL.Path)
				respond(w, http.StatusInternalServerError, `{"error":"internal_server_error"}`)
			}
		}()
		next.ServeHTTP(w, r)
	})
}
func respond(w http.ResponseWriter, status int, body string) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	if status == http.StatusServiceUnavailable || status == http.StatusTooManyRequests {
		w.Header().Set("Retry-After", "1")
	}
	w.WriteHeader(status)
	_, _ = io.WriteString(w, body)
}
func (app *application) receive(w http.ResponseWriter, r *http.Request) {
	expected := sha256.Sum256([]byte("Bearer " + app.apiKey))
	actual := sha256.Sum256([]byte(r.Header.Get("Authorization")))
	if subtle.ConstantTimeCompare(expected[:], actual[:]) != 1 {
		respond(w, 401, `{"error":"unauthorized"}`)
		return
	}
	media, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || media != "application/json" {
		respond(w, 415, `{"error":"unsupported_media_type"}`)
		return
	}
	data, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1024))
	if err != nil {
		var limit *http.MaxBytesError
		if errors.As(err, &limit) {
			respond(w, 413, `{"error":"body_too_large"}`)
		} else {
			respond(w, 400, `{"error":"invalid_request"}`)
		}
		return
	}
	var input events.EmailReceivedPayload
	if events.DecodeJSON(data, &input) != nil || input.Validate() != nil {
		respond(w, 400, `{"error":"invalid_request"}`)
		return
	}
	event, err := events.New(events.TypeEmailReceived, input)
	if err != nil {
		respond(w, 503, `{"error":"unavailable"}`)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()
	if err = app.publish(ctx, event); err != nil {
		respond(w, 503, `{"error":"unavailable"}`)
		return
	}
	respond(w, http.StatusAccepted, `{"status":"accepted"}`)
}
func objectKey(email string) string {
	sum := sha256.Sum256([]byte(email))
	return "contacts/" + hex.EncodeToString(sum[:]) + ".json"
}
func persistContact(ctx context.Context, storage *minio.Client, bucket, key string, value contact) (contact, error) {
	// The first successful write owns the registration identity. Conditional PUT
	// makes this true even when multiple store replicas process the same address.
	object, err := storage.GetObject(ctx, bucket, key, minio.GetObjectOptions{})
	if err != nil {
		return contact{}, err
	}
	data, readErr := io.ReadAll(io.LimitReader(object, 4096))
	_ = object.Close()
	if readErr == nil {
		return decodeContact(data)
	}
	if minio.ToErrorResponse(readErr).Code != "NoSuchKey" {
		return contact{}, readErr
	}
	data, err = json.Marshal(value)
	if err != nil {
		return contact{}, err
	}
	options := minio.PutObjectOptions{ContentType: "application/json"}
	options.SetMatchETagExcept("*")
	_, err = storage.PutObject(ctx, bucket, key, bytes.NewReader(data), int64(len(data)), options)
	if err == nil {
		return value, nil
	}
	if minio.ToErrorResponse(err).StatusCode != http.StatusPreconditionFailed {
		return contact{}, err
	}
	object, err = storage.GetObject(ctx, bucket, key, minio.GetObjectOptions{})
	if err != nil {
		return contact{}, err
	}
	defer object.Close()
	data, err = io.ReadAll(io.LimitReader(object, 4096))
	if err != nil {
		return contact{}, err
	}
	return decodeContact(data)
}
func decodeContact(data []byte) (contact, error) {
	var saved contact
	if json.Unmarshal(data, &saved) != nil || saved.EventID == "" || saved.Email == "" || saved.ReceivedAt.IsZero() {
		return contact{}, errors.New("invalid_contact")
	}
	return saved, nil
}
func (app *application) store(ctx context.Context, event events.Envelope) error {
	var input events.EmailReceivedPayload
	if events.DecodeJSON(event.Payload, &input) != nil || input.Validate() != nil {
		return errInvalidPayload
	}
	key := objectKey(input.Email)
	saved, err := app.persist(ctx, key, contact{EventID: event.ID, Email: input.Email, Locale: input.Locale, Source: input.Source, ReceivedAt: event.OccurredAt, StoredAt: time.Now().UTC()})
	if err != nil {
		return errors.New("persistence_failed")
	}
	// Anchor the retry deadline to ingress; a replay cannot create a fresh send window.
	canonical := events.Envelope{ID: saved.EventID, OccurredAt: saved.ReceivedAt}
	next, err := events.Next(canonical, events.TypeEmailStored, saved.ReceivedAt, events.EmailStoredPayload{Email: saved.Email, Locale: saved.Locale, Source: saved.Source, ObjectKey: key})
	if err != nil {
		return err
	}
	if err = app.publish(ctx, next); err != nil {
		return errors.New("publication_failed")
	}
	return nil
}

type messageConsumer interface {
	Next(...jetstream.FetchOpt) (jetstream.Msg, error)
}

func (app *application) consume(ctx context.Context, consumer messageConsumer) {
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
		event, err := events.Decode(message.Data(), events.TypeEmailReceived)
		if err != nil {
			_ = message.Term()
			slog.Warn("invalid_received_event")
			continue
		}
		attempt, cancel := context.WithTimeout(ctx, 15*time.Second)
		err = app.store(attempt, event)
		if err == nil {
			err = message.DoubleAck(attempt)
		}
		cancel()
		if errors.Is(err, errInvalidPayload) {
			_ = message.Term()
			slog.Warn("store_invalid_payload", "event_id", event.ID)
		} else if err != nil {
			slog.Warn("storage_attempt_failed", "event_id", event.ID, "event_type", event.Type)
		}
		// Failure deliberately leaves the input unacknowledged for configured backoff.
	}
}
