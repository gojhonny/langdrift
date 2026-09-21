package envelopes

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestNewCreatesVersionOneEvent(t *testing.T) {
	event, err := New(TypeEmailReceived, EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	if event.Version != Version || event.Type != TypeEmailReceived || event.ID == "" || event.OccurredAt.IsZero() || len(event.Payload) == 0 {
		t.Fatalf("unexpected envelope: %+v", event)
	}
}

func TestNextIsDeterministicAndDistinct(t *testing.T) {
	input, err := New(TypeEmailReceived, EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	payload := EmailStoredPayload{Email: "a@example.com", Locale: "en", Source: "landing", ObjectKey: "contacts/a.json"}
	first, err := Next(input, TypeEmailStored, input.OccurredAt, payload)
	if err != nil {
		t.Fatal(err)
	}
	second, err := Next(input, TypeEmailStored, input.OccurredAt, payload)
	if err != nil {
		t.Fatal(err)
	}
	if first.ID == "" || first.ID != second.ID {
		t.Fatalf("transition id = %q / %q", first.ID, second.ID)
	}
	if first.ID == input.ID {
		t.Fatal("transition reused the input id")
	}
	if first.Version != Version || !first.OccurredAt.Equal(input.OccurredAt) {
		t.Fatalf("unexpected transition: %+v", first)
	}
}

func TestDecodeRejectsWrongTypeAndVersion(t *testing.T) {
	event, err := New(TypeEmailReceived, EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	data, err := eventJSON(event)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = Decode(data, TypeEmailStored); err == nil {
		t.Fatal("wrong type was accepted")
	}
	event.Version = Version + 1
	data, err = eventJSON(event)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = Decode(data, TypeEmailReceived); err == nil {
		t.Fatal("wrong version was accepted")
	}
}

func TestDecodeJSONRejectsUnknownFieldsAndExtraValues(t *testing.T) {
	var payload EmailReceivedPayload
	unknown := []byte(`{"email":"a@example.com","locale":"en","source":"landing","extra":true}`)
	if err := DecodeJSON(unknown, &payload); err == nil {
		t.Fatal("unknown field was accepted")
	}
	extra := []byte(`{"email":"a@example.com","locale":"en","source":"landing"}{"email":"b@example.com","locale":"en","source":"landing"}`)
	if err := DecodeJSON(extra, &payload); err == nil || !strings.Contains(err.Error(), "expected_one_json_value") {
		t.Fatalf("extra value error = %v", err)
	}
}

func eventJSON(event Envelope) ([]byte, error) {
	return json.Marshal(event)
}
