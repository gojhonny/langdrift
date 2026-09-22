package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go/jetstream"
	"golang.org/x/time/rate"
)

func TestHealthz(t *testing.T) {
	response := httptest.NewRecorder()
	newTestApp(t).routes().ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d", response.Code)
	}
	if response.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Fatalf("nosniff = %q", response.Header().Get("X-Content-Type-Options"))
	}
	if response.Body.String() != `{"status":"ok"}` {
		t.Fatalf("body = %s", response.Body.String())
	}
}

func TestReceiveRejectsInvalidRequests(t *testing.T) {
	app := newTestApp(t)
	unauthorized := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing"}`, "Bearer wrong", "application/json")
	if unauthorized.Code != http.StatusUnauthorized {
		t.Fatalf("unauthorized = %d", unauthorized.Code)
	}
	media := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing"}`, "Bearer "+app.apiKey, "text/plain")
	if media.Code != http.StatusUnsupportedMediaType {
		t.Fatalf("media = %d", media.Code)
	}
	malformed := postEmail(app, `{`, "Bearer "+app.apiKey, "application/json")
	if malformed.Code != http.StatusBadRequest {
		t.Fatalf("malformed = %d", malformed.Code)
	}
	unknown := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing","extra":true}`, "Bearer "+app.apiKey, "application/json")
	if unknown.Code != http.StatusBadRequest {
		t.Fatalf("unknown = %d", unknown.Code)
	}
	oversized := postEmail(app, strings.Repeat("a", 2048), "Bearer "+app.apiKey, "application/json")
	if oversized.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("oversized = %d", oversized.Code)
	}
}

func TestReceivePublishesAcceptedEvent(t *testing.T) {
	app := newTestApp(t)
	var published events.Envelope
	app.publish = func(_ context.Context, event events.Envelope) error {
		published = event
		return nil
	}
	response := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing"}`, "Bearer "+app.apiKey, "application/json")
	if response.Code != http.StatusAccepted || response.Body.String() != `{"status":"accepted"}` {
		t.Fatalf("response = %d %s", response.Code, response.Body.String())
	}
	if published.Type != events.TypeEmailReceived {
		t.Fatalf("published = %s", published.Type)
	}
}

func TestReceivePublishFailure(t *testing.T) {
	app := newTestApp(t)
	app.publish = func(context.Context, events.Envelope) error { return errors.New("down") }
	response := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing"}`, "Bearer "+app.apiKey, "application/json")
	if response.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d", response.Code)
	}
}

func TestRecoverHTTP(t *testing.T) {
	handler := recoverHTTP(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { panic("boom") }))
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if response.Code != http.StatusInternalServerError || !strings.Contains(response.Body.String(), "internal_server_error") {
		t.Fatalf("response = %d %s", response.Code, response.Body.String())
	}
}

func TestStorePublishesStoredEvent(t *testing.T) {
	received, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	app := newTestApp(t)
	var published events.Envelope
	app.persist = func(_ context.Context, key string, value contact) (contact, error) {
		if key == "" {
			t.Fatal("missing object key")
		}
		return value, nil
	}
	app.publish = func(_ context.Context, event events.Envelope) error {
		published = event
		return nil
	}
	if err = app.store(context.Background(), received); err != nil {
		t.Fatal(err)
	}
	if published.Type != events.TypeEmailStored {
		t.Fatalf("published = %s", published.Type)
	}
}

func TestStorePersistFailure(t *testing.T) {
	received, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	app := newTestApp(t)
	app.persist = func(context.Context, string, contact) (contact, error) {
		return contact{}, errors.New("disk")
	}
	err = app.store(context.Background(), received)
	if err == nil || err.Error() != "persistence_failed" {
		t.Fatalf("error = %v", err)
	}
}

func TestRepeatRegistrationKeepsFirstIdentity(t *testing.T) {
	first, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	second, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "ja", Source: "pricing"})
	if err != nil {
		t.Fatal(err)
	}
	first.OccurredAt = time.Now().UTC().Add(-time.Hour)
	app := newTestApp(t)
	var saved contact
	var published []events.Envelope
	app.persist = func(_ context.Context, _ string, value contact) (contact, error) {
		if saved.EventID == "" {
			saved = value
		}
		return saved, nil
	}
	app.publish = func(_ context.Context, event events.Envelope) error {
		published = append(published, event)
		return nil
	}
	if err := app.store(context.Background(), first); err != nil {
		t.Fatal(err)
	}
	if err := app.store(context.Background(), second); err != nil {
		t.Fatal(err)
	}
	if published[0].ID != published[1].ID || !published[0].OccurredAt.Equal(published[1].OccurredAt) {
		t.Fatalf("repeat changed identity: %v", published)
	}
	var payload events.EmailStoredPayload
	if err := events.DecodeJSON(published[1].Payload, &payload); err != nil {
		t.Fatal(err)
	}
	if payload.Locale != "en" || payload.Source != "landing" {
		t.Fatalf("repeat changed registration: %+v", payload)
	}
}

func TestAllResponsesAreProtectedAndReadinessIsSeparate(t *testing.T) {
	app := newTestApp(t)
	app.ready = func(context.Context) bool { return false }
	app.limiter = rate.NewLimiter(0, 0)
	for _, path := range []string{"/missing", "/healthz", "/readyz"} {
		response := httptest.NewRecorder()
		app.routes().ServeHTTP(response, httptest.NewRequest(http.MethodGet, path, nil))
		if response.Header().Get("Cache-Control") != "no-store" || response.Header().Get("X-Content-Type-Options") != "nosniff" {
			t.Fatalf("headers for %s: %v", path, response.Header())
		}
		if path == "/healthz" && response.Code != 200 {
			t.Fatalf("liveness = %d", response.Code)
		}
		if path == "/readyz" && (response.Code != 503 || response.Header().Get("Retry-After") == "") {
			t.Fatalf("readiness = %d", response.Code)
		}
	}
}

type storeMessage struct {
	jetstream.Msg
	data       []byte
	acked      bool
	terminated bool
}

func (message *storeMessage) Data() []byte                    { return message.data }
func (message *storeMessage) DoubleAck(context.Context) error { message.acked = true; return nil }
func (message *storeMessage) Term() error                     { message.terminated = true; return nil }

type storeConsumer struct {
	message   *storeMessage
	cancel    context.CancelFunc
	delivered bool
}

func (consumer *storeConsumer) Next(...jetstream.FetchOpt) (jetstream.Msg, error) {
	if consumer.delivered {
		consumer.cancel()
		return nil, context.Canceled
	}
	consumer.delivered = true
	return consumer.message, nil
}
func TestStoreConsumerAcknowledgesAfterPublication(t *testing.T) {
	event, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	data, err := json.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	message := &storeMessage{data: data}
	app := newTestApp(t)
	app.persist = func(_ context.Context, _ string, value contact) (contact, error) { return value, nil }
	app.publish = func(context.Context, events.Envelope) error { return nil }
	app.consume(ctx, &storeConsumer{message: message, cancel: cancel})
	if !message.acked || message.terminated {
		t.Fatalf("ack=%t term=%t", message.acked, message.terminated)
	}
}
func TestStoreConsumerTerminatesInvalidEvent(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	message := &storeMessage{data: []byte("invalid")}
	newTestApp(t).consume(ctx, &storeConsumer{message: message, cancel: cancel})
	if !message.terminated || message.acked {
		t.Fatalf("ack=%t term=%t", message.acked, message.terminated)
	}
}

func TestStoreFailureNeverAcknowledgesInput(t *testing.T) {
	for _, stage := range []string{"persist", "publish"} {
		t.Run(stage, func(t *testing.T) {
			event, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
			if err != nil {
				t.Fatal(err)
			}
			data, err := json.Marshal(event)
			if err != nil {
				t.Fatal(err)
			}
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			message := &storeMessage{data: data}
			app := newTestApp(t)
			app.persist = func(_ context.Context, _ string, c contact) (contact, error) {
				if stage == "persist" {
					return contact{}, errors.New("storage unavailable")
				}
				return c, nil
			}
			app.publish = func(context.Context, events.Envelope) error {
				if message.acked {
					t.Fatal("acknowledged before publication")
				}
				return errors.New("broker unavailable")
			}
			app.consume(ctx, &storeConsumer{message: message, cancel: cancel})
			if message.acked || message.terminated {
				t.Fatal("transient failure discarded input")
			}
		})
	}
}

func TestIngressSaturationAndRouterErrors(t *testing.T) {
	app := newTestApp(t)
	app.inFlight = make(chan struct{}, 1)
	app.inFlight <- struct{}{}
	response := postEmail(app, `{"email":"a@example.com","locale":"en","source":"landing"}`, "Bearer "+app.apiKey, "application/json")
	if response.Code != 503 || response.Header().Get("Retry-After") == "" {
		t.Fatal("missing saturation response")
	}
	<-app.inFlight
	for _, path := range []string{"/missing", "/v1/emails"} {
		response := httptest.NewRecorder()
		app.routes().ServeHTTP(response, httptest.NewRequest(http.MethodGet, path, nil))
		if response.Code != 404 && response.Code != 405 {
			t.Fatalf("router status=%d", response.Code)
		}
		if response.Header().Get("X-Content-Type-Options") != "nosniff" {
			t.Fatal("unprotected router error")
		}
	}
	app.ready = func(context.Context) bool { return true }
	response = httptest.NewRecorder()
	app.routes().ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/readyz", nil))
	if response.Code != 200 {
		t.Fatal("healthy dependencies did not become ready")
	}
	response = postEmail(app, strings.Repeat("x", 4097), "Bearer "+app.apiKey, "application/json")
	if response.Code != 413 {
		t.Fatalf("global size limit=%d", response.Code)
	}
	if newServer(":0", app.routes()).ReadHeaderTimeout <= 0 {
		t.Fatal("missing HTTP bounds")
	}
}

func newTestApp(t *testing.T) *application {
	t.Helper()
	return &application{
		apiKey:   "test-key",
		limiter:  rate.NewLimiter(50, 100),
		inFlight: make(chan struct{}, 64),
		publish: func(context.Context, events.Envelope) error {
			t.Fatal("unexpected publish")
			return nil
		},
	}
}

func postEmail(app *application, body, authorization, contentType string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(http.MethodPost, "/v1/emails", strings.NewReader(body))
	request.Header.Set("Authorization", authorization)
	request.Header.Set("Content-Type", contentType)
	response := httptest.NewRecorder()
	app.routes().ServeHTTP(response, request)
	return response
}
