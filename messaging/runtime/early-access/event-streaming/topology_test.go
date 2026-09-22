package eventstreaming

import (
	"testing"
	"time"

	"github.com/nats-io/nats.go/jetstream"
)

func TestStreamConfig(t *testing.T) {
	config := StreamConfig()
	if config.Name != "EARLY_ACCESS" || StreamName != "EARLY_ACCESS" {
		t.Fatalf("stream = %s", config.Name)
	}
	if len(config.Subjects) != 1 || config.Subjects[0] != "email.*" {
		t.Fatalf("subjects = %v", config.Subjects)
	}
	if config.Storage != jetstream.FileStorage {
		t.Fatalf("storage = %v", config.Storage)
	}
}

func TestConsumerConfigs(t *testing.T) {
	configs := ConsumerConfigs()
	if len(configs) != 2 {
		t.Fatalf("consumers = %d", len(configs))
	}
	store := findConsumer(t, configs, StoreConsumer)
	sender := findConsumer(t, configs, SenderConsumer)
	if store.FilterSubject != EmailReceived || sender.FilterSubject != EmailStored {
		t.Fatalf("filters = %s %s", store.FilterSubject, sender.FilterSubject)
	}
	expected := []time.Duration{30 * time.Second, time.Minute, 5 * time.Minute, 15 * time.Minute, time.Hour}
	for _, config := range []jetstream.ConsumerConfig{store, sender} {
		if config.AckPolicy != jetstream.AckExplicitPolicy {
			t.Fatalf("%s ack = %v", config.Durable, config.AckPolicy)
		}
		if config.MaxDeliver != 10 {
			t.Fatalf("%s max deliver = %d", config.Durable, config.MaxDeliver)
		}
		if len(config.BackOff) != len(expected) {
			t.Fatalf("%s backoff = %v", config.Durable, config.BackOff)
		}
		for i, delay := range expected {
			if config.BackOff[i] != delay {
				t.Fatalf("%s backoff[%d] = %s", config.Durable, i, config.BackOff[i])
			}
		}
	}
}

func findConsumer(t *testing.T, configs []jetstream.ConsumerConfig, name string) jetstream.ConsumerConfig {
	t.Helper()
	for _, config := range configs {
		if config.Durable == name {
			return config
		}
	}
	t.Fatalf("missing consumer %s", name)
	return jetstream.ConsumerConfig{}
}
