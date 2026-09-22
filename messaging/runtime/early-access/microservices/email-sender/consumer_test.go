package main

import (
	"context"
	"encoding/json"
	"errors"
	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go/jetstream"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

type testMessage struct {
	jetstream.Msg
	data                           []byte
	acknowledgements, terminations int
	ackError                       error
}

func (m *testMessage) Data() []byte                    { return m.data }
func (m *testMessage) DoubleAck(context.Context) error { m.acknowledgements++; return m.ackError }
func (m *testMessage) Term() error                     { m.terminations++; return nil }

type oneMessageConsumer struct {
	message   jetstream.Msg
	cancel    context.CancelFunc
	delivered bool
}

func (c *oneMessageConsumer) Next(...jetstream.FetchOpt) (jetstream.Msg, error) {
	if c.delivered {
		c.cancel()
		return nil, context.Canceled
	}
	c.delivered = true
	return c.message, nil
}
func TestConsumerAcknowledgementDecisions(t *testing.T) {
	for _, scenario := range []struct {
		name                              string
		at                                time.Time
		sendError, publishError, ackError error
		malformed                         bool
		ack, term                         int
	}{
		{name: "accepted", ack: 1}, {name: "transient provider", sendError: errors.New("timeout")},
		{name: "permanent provider", sendError: errProviderPermanent, term: 1},
		{name: "publication after acceptance", publishError: errors.New("broker down")},
		{name: "lost ack", ackError: errors.New("ack lost"), ack: 1},
		{name: "expired", at: time.Now().Add(-24 * time.Hour), term: 1}, {name: "malformed", malformed: true, term: 1},
	} {
		t.Run(scenario.name, func(t *testing.T) {
			at := scenario.at
			if at.IsZero() {
				at = time.Now().UTC()
			}
			event := storedEvent(t, at)
			data, err := json.Marshal(event)
			if err != nil {
				t.Fatal(err)
			}
			if scenario.malformed {
				data = []byte("{")
			}
			message := &testMessage{data: data, ackError: scenario.ackError}
			worker := sender{send: func(ctx context.Context, id string, p events.EmailStoredPayload) (string, error) {
				if ctx.Err() != nil {
					t.Fatalf("attempt already canceled: %v", ctx.Err())
				}
				if message.acknowledgements != 0 {
					t.Fatal("ack before send")
				}
				return "provider-id", scenario.sendError
			}, publish: func(context.Context, events.Envelope) error {
				if message.acknowledgements != 0 {
					t.Fatal("ack before publication")
				}
				return scenario.publishError
			}}
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			worker.consume(ctx, &oneMessageConsumer{message: message, cancel: cancel})
			if message.acknowledgements != scenario.ack || message.terminations != scenario.term {
				t.Fatalf("ack=%d term=%d", message.acknowledgements, message.terminations)
			}
		})
	}
}
func TestSenderReadinessAndCanceledWorker(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	sender{}.consume(ctx, nil)
	for _, ready := range []bool{true, false} {
		response := httptest.NewRecorder()
		healthRoutesWithReady(func() bool { return ready }).ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/readyz", nil))
		expected := 503
		if ready {
			expected = 200
		}
		if response.Code != expected || response.Header().Get("Cache-Control") != "no-store" {
			t.Fatalf("readiness=%d", response.Code)
		}
	}
}

func TestShutdownCancelsInFlightSendWithoutAcknowledging(t *testing.T) {
	event := storedEvent(t, time.Now().UTC())
	data, err := json.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}
	message := &testMessage{data: data}
	started := make(chan struct{})
	done := make(chan struct{})
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	worker := sender{send: func(ctx context.Context, _ string, _ events.EmailStoredPayload) (string, error) {
		close(started)
		<-ctx.Done()
		return "", ctx.Err()
	}, publish: func(context.Context, events.Envelope) error { t.Error("published a canceled send"); return nil }}
	go func() { defer close(done); worker.consume(ctx, &oneMessageConsumer{message: message, cancel: cancel}) }()
	<-started
	cancel()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("worker ignored shutdown")
	}
	if message.acknowledgements != 0 || message.terminations != 0 {
		t.Fatal("canceled work was discarded")
	}
}
