package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
)

func TestHealthz(t *testing.T) {
	response := httptest.NewRecorder()
	healthRoutes().ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if response.Code != http.StatusOK || response.Body.String() != `{"status":"ok"}` {
		t.Fatalf("response = %d %s", response.Code, response.Body.String())
	}
	if response.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Fatalf("nosniff = %q", response.Header().Get("X-Content-Type-Options"))
	}
}

func TestAcknowledgementLocales(t *testing.T) {
	cases := map[string]string{
		"en":      "You're on the LangDrift early-access list",
		"pt-BR":   "Você está na lista de acesso antecipado do LangDrift",
		"zh-Hant": "您已加入 LangDrift 搶先體驗名單",
		"ja":      "LangDrift の先行アクセスに登録されました",
	}
	for locale, subject := range cases {
		got, text := acknowledgement(locale)
		if got != subject || text == "" {
			t.Fatalf("locale %s subject = %q", locale, got)
		}
	}
}

func TestProcessSendsAndPublishes(t *testing.T) {
	stored := storedEvent(t, time.Now().UTC())
	var sent events.Envelope
	var seen string
	worker := sender{
		send: func(_ context.Context, id string, _ events.EmailStoredPayload) (string, error) {
			seen = id
			return "provider-id", nil
		},
		publish: func(_ context.Context, event events.Envelope) error {
			sent = event
			return nil
		},
	}
	if err := worker.process(context.Background(), stored); err != nil {
		t.Fatal(err)
	}
	if seen != stored.ID {
		t.Fatalf("send id = %s", seen)
	}
	if sent.Type != events.TypeEmailSent {
		t.Fatalf("published = %s", sent.Type)
	}
	var payload events.EmailSentPayload
	if events.DecodeJSON(sent.Payload, &payload) != nil || payload.ProviderMessageID != "provider-id" {
		t.Fatalf("payload = %s", sent.Payload)
	}
}

func TestProcessProviderAndPublishFailures(t *testing.T) {
	stored := storedEvent(t, time.Now().UTC())
	published := false
	worker := sender{
		send: func(context.Context, string, events.EmailStoredPayload) (string, error) {
			return "", errors.New("provider_rejected")
		},
		publish: func(context.Context, events.Envelope) error { published = true; return nil },
	}
	if err := worker.process(context.Background(), stored); err == nil || published {
		t.Fatalf("provider failure err = %v published = %v", err, published)
	}
	worker.send = func(context.Context, string, events.EmailStoredPayload) (string, error) { return "provider-id", nil }
	worker.publish = func(context.Context, events.Envelope) error { return errors.New("down") }
	err := worker.process(context.Background(), stored)
	if err == nil || err.Error() != "publication_failed" {
		t.Fatalf("publish failure = %v", err)
	}
}

func TestProcessExpiredWindowDoesNotSend(t *testing.T) {
	stored := storedEvent(t, time.Now().UTC().Add(-24*time.Hour))
	called := false
	worker := sender{send: func(context.Context, string, events.EmailStoredPayload) (string, error) {
		called = true
		return "", nil
	}}
	err := worker.process(context.Background(), stored)
	if !errors.Is(err, errExpired) || called {
		t.Fatalf("err = %v called = %v", err, called)
	}
}

func TestProcessInvalidPayload(t *testing.T) {
	parent, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	stored, err := events.Next(parent, events.TypeEmailStored, time.Now().UTC(), events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	called := false
	worker := sender{send: func(context.Context, string, events.EmailStoredPayload) (string, error) {
		called = true
		return "", nil
	}}
	if err = worker.process(context.Background(), stored); err == nil || err.Error() != "invalid_payload" || called {
		t.Fatalf("err = %v called = %v", err, called)
	}
}

func TestResendClient(t *testing.T) {
	var body resendRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer test-key" || r.Header.Get("Content-Type") != "application/json" || r.Header.Get("Idempotency-Key") != "early-access-ack/event-id" {
			t.Errorf("headers = %v", r.Header)
		}
		data, _ := io.ReadAll(r.Body)
		if json.Unmarshal(data, &body) != nil {
			t.Errorf("body = %s", data)
		}
		_, _ = io.WriteString(w, `{"id":"provider-id"}`)
	}))
	defer server.Close()
	client := resendClient{http: server.Client(), endpoint: server.URL, apiKey: "test-key", from: "from@example.com"}
	id, err := client.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"})
	if err != nil || id != "provider-id" {
		t.Fatalf("id = %q err = %v", id, err)
	}
	if body.From != "from@example.com" || len(body.To) != 1 || body.To[0] != "a@example.com" || body.Subject == "" || body.Text == "" {
		t.Fatalf("request = %+v", body)
	}
}

func TestResendClientRejectsBadResponses(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("mode") == "status" {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
		_, _ = io.WriteString(w, `{}`)
	}))
	defer server.Close()
	client := resendClient{http: server.Client(), endpoint: server.URL + "?mode=status", apiKey: "test-key", from: "from@example.com"}
	if _, err := client.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"}); err == nil || err.Error() != "provider_rejected" {
		t.Fatalf("status error = %v", err)
	}
	client.endpoint = server.URL
	if _, err := client.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"}); err == nil || err.Error() != "provider_invalid_response" {
		t.Fatalf("body error = %v", err)
	}
}

func storedEvent(t *testing.T, at time.Time) events.Envelope {
	t.Helper()
	parent, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	stored, err := events.Next(parent, events.TypeEmailStored, at, events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"})
	if err != nil {
		t.Fatal(err)
	}
	return stored
}
