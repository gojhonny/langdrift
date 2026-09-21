package eventstreaming

import (
	"github.com/nats-io/nats.go/jetstream"
	"time"
)

const (
	StreamName     = "EARLY_ACCESS"
	StoreConsumer  = "early-access-email-store-v1"
	SenderConsumer = "early-access-email-sender-v1"
	// Stop retries conservatively before Resend's 24-hour idempotency expiry,
	// including after worker downtime; backoff alone cannot bound elapsed time.
	SenderWindow = 23 * time.Hour
)

func StreamConfig() jetstream.StreamConfig {
	return jetstream.StreamConfig{
		Name: StreamName, Subjects: []string{"email.*"}, Storage: jetstream.FileStorage,
		Retention: jetstream.LimitsPolicy, MaxAge: 7 * 24 * time.Hour,
		MaxBytes: 256 * 1024 * 1024, MaxMsgSize: 4096, Discard: jetstream.DiscardNew,
		Duplicates: 24 * time.Hour,
	}
}
func ConsumerConfigs() []jetstream.ConsumerConfig {
	configs := []jetstream.ConsumerConfig{}
	for _, entry := range []struct{ name, subject string }{{StoreConsumer, EmailReceived}, {SenderConsumer, EmailStored}} {
		configs = append(configs, jetstream.ConsumerConfig{
			Durable: entry.name, FilterSubject: entry.subject,
			DeliverPolicy: jetstream.DeliverAllPolicy, AckPolicy: jetstream.AckExplicitPolicy,
			AckWait: 30 * time.Second, MaxDeliver: 10, MaxAckPending: 64,
			BackOff: []time.Duration{30 * time.Second, time.Minute, 5 * time.Minute, 15 * time.Minute, time.Hour},
		})
	}
	return configs
}
