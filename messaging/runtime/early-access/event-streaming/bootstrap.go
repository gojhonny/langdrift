package eventstreaming

import (
	"context"
	"encoding/json"
	"github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go/jetstream"
)

func Bootstrap(ctx context.Context, js jetstream.JetStream) error {
	if _, err := js.CreateOrUpdateStream(ctx, StreamConfig()); err != nil {
		return err
	}
	for _, config := range ConsumerConfigs() {
		if _, err := js.CreateOrUpdateConsumer(ctx, StreamName, config); err != nil {
			return err
		}
	}
	return nil
}
func Publish(ctx context.Context, js jetstream.JetStream, event envelopes.Envelope) error {
	data, err := json.Marshal(event)
	if err != nil {
		return err
	}
	_, err = js.Publish(ctx, string(event.Type), data, jetstream.WithMsgID(event.ID))
	return err
}
