package eventstreaming

import (
	"context"
	"encoding/json"
	"errors"
	"testing"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go/jetstream"
)

type topologyStub struct {
	failStream, failConsumer bool
	consumers                []jetstream.ConsumerConfig
}

func (s *topologyStub) CreateOrUpdateStream(ctx context.Context, config jetstream.StreamConfig) (jetstream.Stream, error) {
	if s.failStream {
		return nil, errors.New("stream unavailable")
	}
	return nil, ctx.Err()
}
func (s *topologyStub) CreateOrUpdateConsumer(ctx context.Context, name string, config jetstream.ConsumerConfig) (jetstream.Consumer, error) {
	if s.failConsumer {
		return nil, errors.New("consumer unavailable")
	}
	s.consumers = append(s.consumers, config)
	return nil, ctx.Err()
}
func TestBootstrapPropagatesFailuresAndCreatesBothConsumers(t *testing.T) {
	for _, scenario := range []struct {
		name             string
		stream, consumer bool
	}{{"success", false, false}, {"stream", true, false}, {"consumer", false, true}} {
		t.Run(scenario.name, func(t *testing.T) {
			stub := &topologyStub{failStream: scenario.stream, failConsumer: scenario.consumer}
			err := Bootstrap(context.Background(), stub)
			if (err != nil) != (scenario.stream || scenario.consumer) {
				t.Fatalf("err=%v", err)
			}
			if err == nil && (len(stub.consumers) != 2 || stub.consumers[0].FilterSubject != EmailReceived || stub.consumers[1].FilterSubject != EmailStored) {
				t.Fatal("incorrect consumer topology")
			}
		})
	}
}

type publisherStub struct {
	body    []byte
	subject string
	err     error
}

func (s *publisherStub) Publish(ctx context.Context, subject string, body []byte, opts ...jetstream.PublishOpt) (*jetstream.PubAck, error) {
	s.subject, s.body = subject, body
	if ctx.Err() != nil {
		return nil, ctx.Err()
	}
	return &jetstream.PubAck{}, s.err
}
func TestPublishPreservesEnvelopeAndErrors(t *testing.T) {
	event, err := events.New(events.TypeEmailReceived, events.EmailReceivedPayload{Email: "a@example.com", Locale: "en", Source: "landing"})
	if err != nil {
		t.Fatal(err)
	}
	stub := &publisherStub{}
	if err := Publish(context.Background(), stub, event); err != nil {
		t.Fatal(err)
	}
	var actual events.Envelope
	if json.Unmarshal(stub.body, &actual) != nil || actual.ID != event.ID || stub.subject != string(event.Type) {
		t.Fatal("publication changed event")
	}
	stub.err = errors.New("full stream")
	if err := Publish(context.Background(), stub, event); !errors.Is(err, stub.err) {
		t.Fatalf("err=%v", err)
	}
	event.Payload = []byte("{")
	if err := Publish(context.Background(), stub, event); err == nil {
		t.Fatal("invalid payload published")
	}
}

func TestNATSConfiguration(t *testing.T) {
	for _, scenario := range []struct {
		url, mode string
		valid     bool
	}{
		{"nats://localhost:4222", "test", true}, {"tls://store:secret@broker:4222", "production", true},
		{"nats://broker:4222", "production", false}, {"tls://broker:4222", "production", false},
		{"tls://user@broker:4222", "production", false}, {"tls://user:@broker:4222", "production", false},
		{"https://broker:4222", "test", false}, {":bad", "test", false}, {"nats://broker/path", "test", false},
		{"nats://broker", "unknown", false},
	} {
		if (ValidateNATSURL(scenario.url, scenario.mode) == nil) != scenario.valid {
			t.Errorf("mode %s endpoint validation mismatch", scenario.mode)
		}
	}
}
