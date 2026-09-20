package envelopes

import (
	"bytes"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"time"
)

type Type string

const Version = 1

type Envelope struct {
	ID         string          `json:"id"`
	Type       Type            `json:"type"`
	Version    int             `json:"version"`
	OccurredAt time.Time       `json:"occurredAt"`
	Payload    json.RawMessage `json:"payload"`
}

func New(kind Type, payload any) (Envelope, error) {
	id := make([]byte, 16)
	if _, err := rand.Read(id); err != nil {
		return Envelope{}, err
	}
	return makeEnvelope(hex.EncodeToString(id), kind, time.Now().UTC(), payload)
}

// Next identifies a new lifecycle event, consistently across retries of its input.
// Re-publication of the same transition is not a new event.
func Next(input Envelope, kind Type, at time.Time, payload any) (Envelope, error) {
	id := sha256.Sum256([]byte(input.ID + "/" + string(kind)))
	return makeEnvelope(hex.EncodeToString(id[:]), kind, at, payload)
}
func makeEnvelope(id string, kind Type, at time.Time, payload any) (Envelope, error) {
	data, err := json.Marshal(payload)
	return Envelope{ID: id, Type: kind, Version: Version, OccurredAt: at, Payload: data}, err
}
func Decode(data []byte, kind Type) (Envelope, error) {
	var event Envelope
	if err := DecodeJSON(data, &event); err != nil {
		return event, errors.New("invalid_envelope")
	}
	if event.Version != Version || event.Type != kind || event.ID == "" || len(event.ID) > 128 || event.OccurredAt.IsZero() || event.OccurredAt.After(time.Now().Add(time.Minute)) || len(event.Payload) == 0 {
		return event, errors.New("invalid_envelope")
	}
	return event, nil
}
func DecodeJSON(data []byte, value any) error {
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(value); err != nil {
		return err
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return errors.New("expected_one_json_value")
	}
	return nil
}
