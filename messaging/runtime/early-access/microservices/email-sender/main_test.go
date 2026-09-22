package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	resend "github.com/resend/resend-go/v3"
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
	var body resend.SendEmailRequest
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
	fail := true
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if fail {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
		_, _ = io.WriteString(w, `{}`)
	}))
	defer server.Close()
	client := resendClient{http: server.Client(), endpoint: server.URL + "/emails", apiKey: "test-key", from: "from@example.com"}
	if _, err := client.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"}); err == nil || err.Error() != "provider_rejected" {
		t.Fatalf("status error = %v", err)
	}
	fail = false
	if _, err := client.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"}); err == nil || err.Error() != "provider_invalid_response" {
		t.Fatalf("body error = %v", err)
	}
}

func TestValidateResendEndpoint(t *testing.T) {
	for _, input := range []struct {
		endpoint, mode string
		valid          bool
	}{
		{"https://api.resend.com/emails", "production", true},
		{"http://resend-mock:8080/emails", "test", true},
		{"http://127.0.0.1:8080/emails", "development", true},
		{"http://evil.example/emails", "production", false},
		{"https://evil.example/emails", "production", false},
		{"http://resend-mock:8080/emails", "production", false},
	} {
		if got := validateResendEndpoint(input.endpoint, input.mode); (got == nil) != input.valid {
			t.Errorf("endpoint %q mode %q: %v", input.endpoint, input.mode, got)
		}
	}
}

func TestProviderStatusClassification(t *testing.T) {
	status := http.StatusBadRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(status)
		_, _ = io.WriteString(w, `{"message":"provider detail"}`)
	}))
	defer server.Close()
	client := server.Client()
	client.Transport = limitedTransport{base: client.Transport}
	provider := resendClient{http: client, endpoint: server.URL + "/emails", apiKey: "test-key", from: "from@example.com"}
	_, err := provider.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en"})
	if !errors.Is(err, errProviderPermanent) {
		t.Fatalf("permanent error = %v", err)
	}
	status = http.StatusTooManyRequests
	_, err = provider.send(context.Background(), "event-id", events.EmailStoredPayload{Email: "a@example.com", Locale: "en"})
	if err == nil || errors.Is(err, errProviderPermanent) {
		t.Fatalf("transient error = %v", err)
	}
}

func TestSendAfterPublicationFailureReusesProviderIdentity(t *testing.T) {
	keys := map[string]string{}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("Idempotency-Key")
		keys[key] = "provider-id"
		_, _ = io.WriteString(w, `{"id":"provider-id"}`)
	}))
	defer server.Close()
	client := server.Client()
	client.Timeout = time.Second
	client.Transport = limitedTransport{base: client.Transport}
	provider := resendClient{http: client, endpoint: server.URL + "/emails", apiKey: "test", from: "test@example.com"}
	event := storedEvent(t, time.Now().UTC())
	attempts := 0
	worker := sender{send: provider.send, publish: func(context.Context, events.Envelope) error {
		attempts++
		if attempts == 1 {
			return errors.New("lost publication")
		}
		return nil
	}}
	if err := worker.process(context.Background(), event); err == nil {
		t.Fatal("lost publication accepted")
	}
	if err := worker.process(context.Background(), event); err != nil {
		t.Fatal(err)
	}
	if len(keys) != 1 || keys["early-access-ack/"+event.ID] != "provider-id" {
		t.Fatal("retry changed idempotency key")
	}
}

func TestProviderBoundsAndCancellation(t *testing.T) {
	for _, scenario := range []string{"timeout", "redirect", "oversized", "malformed"} {
		t.Run(scenario, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				switch scenario {
				case "timeout":
					select {
					case <-r.Context().Done():
					case <-time.After(200 * time.Millisecond):
					}
				case "redirect":
					http.Redirect(w, r, "http://example.invalid", http.StatusTemporaryRedirect)
				case "oversized":
					_, _ = io.WriteString(w, `{"id":"`+strings.Repeat("x", 5000)+`"}`)
				default:
					_, _ = io.WriteString(w, "{")
				}
			}))
			defer server.Close()
			client := server.Client()
			client.Timeout = 50 * time.Millisecond
			client.Transport = limitedTransport{base: client.Transport}
			client.CheckRedirect = func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }
			provider := resendClient{http: client, endpoint: server.URL + "/emails", apiKey: "test", from: "test@example.com"}
			if _, err := provider.send(context.Background(), "event", events.EmailStoredPayload{Email: "a@example.com", Locale: "en"}); err == nil || strings.Contains(err.Error(), "example.invalid") {
				t.Fatalf("unsanitized error=%v", err)
			}
		})
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
