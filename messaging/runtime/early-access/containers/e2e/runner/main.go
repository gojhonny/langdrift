package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"time"

	events "github.com/gojhonny/langdrift/packages/events/envelopes"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

var email = "e2e@example.com"

func must(err error) {
	if err != nil {
		panic(err)
	}
}
func getJSON(ctx context.Context, client *http.Client, endpoint string, value any) error {
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	response, err := client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("endpoint status %d", response.StatusCode)
	}
	return json.NewDecoder(io.LimitReader(response.Body, 8192)).Decode(value)
}
func post(ctx context.Context, client *http.Client, key string) error {
	data, _ := json.Marshal(events.EmailReceivedPayload{Email: email, Locale: "en", Source: "landing"})
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, "http://email-store:8080/v1/emails", bytes.NewReader(data))
	if err != nil {
		return err
	}
	request.Header.Set("Authorization", "Bearer "+key)
	request.Header.Set("Content-Type", "application/json")
	response, err := client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusAccepted {
		return fmt.Errorf("registration status %d", response.StatusCode)
	}
	return nil
}
func contact(ctx context.Context, storage *minio.Client) (string, error) {
	sum := sha256.Sum256([]byte(email))
	key := "contacts/" + hex.EncodeToString(sum[:]) + ".json"
	object, err := storage.GetObject(ctx, "langdrift-emails", key, minio.GetObjectOptions{})
	if err != nil {
		return "", err
	}
	defer object.Close()
	var result struct {
		EventID string `json:"eventId"`
		Email   string `json:"email"`
		Locale  string `json:"locale"`
		Source  string `json:"source"`
	}
	if err := json.NewDecoder(io.LimitReader(object, 4096)).Decode(&result); err != nil {
		return "", err
	}
	if result.Email != email || result.Locale != "en" || result.Source != "landing" || result.EventID == "" {
		return "", errors.New("contact mismatch")
	}
	return result.EventID, nil
}
func eventsReady(ctx context.Context, js jetstream.JetStream, firstID string) (string, error) {
	stream, err := js.Stream(ctx, "EARLY_ACCESS")
	if err != nil {
		return "", err
	}
	info, err := stream.Info(ctx)
	if err != nil {
		return "", err
	}
	if info.State.Consumers != 2 {
		return "", errors.New("consumer topology incomplete")
	}
	var received, stored, sent events.Envelope
	for seq := info.State.FirstSeq; seq <= info.State.LastSeq; seq++ {
		message, err := stream.GetMsg(ctx, seq)
		if err != nil {
			return "", err
		}
		kind := events.Type(message.Subject)
		event, err := events.Decode(message.Data, kind)
		if err != nil {
			return "", err
		}
		switch kind {
		case events.TypeEmailReceived:
			if event.ID == firstID {
				received = event
			}
		case events.TypeEmailStored:
			var payload events.EmailStoredPayload
			if events.DecodeJSON(event.Payload, &payload) == nil && payload.Email == email && payload.Locale == "en" && payload.Source == "landing" && payload.ObjectKey != "" && received.ID != "" {
				stored = event
			}
		case events.TypeEmailSent:
			var payload events.EmailSentPayload
			if events.DecodeJSON(event.Payload, &payload) == nil && payload.Email == email && payload.Provider == "resend" && payload.ProviderMessageID != "" {
				sent = event
			}
		}
	}
	if received.ID == "" || stored.ID == "" || sent.ID == "" {
		return "", errors.New("event chain incomplete")
	}
	expectedStored, err := events.Next(received, events.TypeEmailStored, received.OccurredAt, events.EmailStoredPayload{})
	if err != nil {
		return "", err
	}
	expectedSent, err := events.Next(stored, events.TypeEmailSent, received.OccurredAt, events.EmailSentPayload{})
	if err != nil {
		return "", err
	}
	if stored.ID != expectedStored.ID || sent.ID != expectedSent.ID || !stored.OccurredAt.Equal(received.OccurredAt) || !sent.OccurredAt.Equal(received.OccurredAt) {
		return "", errors.New("event identity mismatch")
	}
	var payload events.EmailSentPayload
	must(events.DecodeJSON(sent.Payload, &payload))
	digest := sha256.Sum256([]byte("early-access-ack/" + stored.ID))
	if payload.ProviderMessageID != "mock-"+hex.EncodeToString(digest[:8]) {
		return "", errors.New("provider message identity mismatch")
	}
	return "early-access-ack/" + stored.ID, nil
}
func wait(ctx context.Context, label string, check func() error) {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()
	var last error
	for {
		last = check()
		if last == nil {
			return
		}
		select {
		case <-ctx.Done():
			panic(fmt.Errorf("timed out waiting for %s: %w", label, last))
		case <-ticker.C:
		}
	}
}
func main() {
	inspect := len(os.Args) == 3 && os.Args[1] == "--inspect"
	if inspect {
		email = os.Args[2]
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	client := &http.Client{Timeout: 5 * time.Second}
	var health map[string]string
	wait(ctx, "email-store", func() error { return getJSON(ctx, client, "http://email-store:8080/healthz", &health) })
	nc, err := nats.Connect("nats://nats:4222")
	must(err)
	defer nc.Close()
	js, err := jetstream.New(nc)
	must(err)
	storage, err := minio.New("minio:9000", &minio.Options{Creds: credentials.NewStaticV4(os.Getenv("MINIO_ACCESS_KEY"), os.Getenv("MINIO_SECRET_KEY"), "")})
	must(err)
	if !inspect {
		var submissions sync.WaitGroup
		failures := make(chan error, 12)
		for range 12 {
			submissions.Go(func() { failures <- post(ctx, client, os.Getenv("EMAIL_SERVICE_API_KEY")) })
		}
		submissions.Wait()
		close(failures)
		for err := range failures {
			must(err)
		}
	}
	var firstID, providerKey string
	wait(ctx, "contact and correlated events", func() error {
		var err error
		firstID, err = contact(ctx, storage)
		if err != nil {
			return err
		}
		providerKey, err = eventsReady(ctx, js, firstID)
		return err
	})
	checkProvider := func() error {
		var state struct {
			Count   int `json:"count"`
			Records []struct {
				Key       string `json:"key"`
				Recipient string `json:"recipient"`
			} `json:"records"`
		}
		if err := getJSON(ctx, client, "http://resend-mock:8080/state", &state); err != nil {
			return err
		}
		matches := 0
		for _, record := range state.Records {
			if record.Recipient == email {
				matches++
				if record.Key != providerKey {
					return errors.New("provider key mismatch")
				}
			}
		}
		if matches != 1 {
			return errors.New("provider state mismatch")
		}
		return nil
	}
	wait(ctx, "one provider acknowledgement", checkProvider)
	if inspect {
		fmt.Println("browser storage, events and provider identity proved")
		return
	}
	must(post(ctx, client, os.Getenv("EMAIL_SERVICE_API_KEY")))
	wait(ctx, "settled consumers", func() error {
		for _, name := range []string{"early-access-email-store-v1", "early-access-email-sender-v1"} {
			consumer, err := js.Consumer(ctx, "EARLY_ACCESS", name)
			if err != nil {
				return err
			}
			info, err := consumer.Info(ctx)
			if err != nil {
				return err
			}
			if info.NumAckPending != 0 || info.NumPending != 0 {
				return fmt.Errorf("consumer still has work")
			}
		}
		return nil
	})
	lastID, err := contact(ctx, storage)
	must(err)
	if lastID != firstID {
		panic("repeat changed canonical contact")
	}
	must(checkProvider())
	stream, err := js.Stream(ctx, "EARLY_ACCESS")
	must(err)
	info, err := stream.Info(ctx)
	must(err)
	full := info.Config
	full.MaxMsgs = int64(info.State.Msgs)
	_, err = js.UpdateStream(ctx, full)
	must(err)
	publicationErr := post(ctx, client, os.Getenv("EMAIL_SERVICE_API_KEY"))
	_, err = js.UpdateStream(ctx, info.Config)
	must(err)
	if publicationErr == nil || publicationErr.Error() != "registration status 503" {
		panic("full broker did not reject acceptance")
	}
	fmt.Println("early-access exact event chain, concurrent/repeat registration and canonical provider acknowledgement proved")
}
