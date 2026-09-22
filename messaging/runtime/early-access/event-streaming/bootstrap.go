package eventstreaming

import (
	"context"
	"encoding/json"
	"github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/nats-io/nats.go/jetstream"
)

type Topology interface {
	CreateOrUpdateStream(context.Context, jetstream.StreamConfig) (jetstream.Stream, error)
	CreateOrUpdateConsumer(context.Context, string, jetstream.ConsumerConfig) (jetstream.Consumer, error)
}

type Publisher interface {
	Publish(context.Context, string, []byte, ...jetstream.PublishOpt) (*jetstream.PubAck, error)
}

func Bootstrap(ctx context.Context, js Topology) error {
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
func Publish(ctx context.Context, js Publisher, event envelopes.Envelope) error {
	data, err := json.Marshal(event)
	if err != nil {
		return err
	}
	_, err = js.Publish(ctx, string(event.Type), data, jetstream.WithMsgID(event.ID))
	return err
}
