package main

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
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
