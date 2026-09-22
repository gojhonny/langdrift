package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func TestConditionalPersistence(t *testing.T) {
	first := contact{EventID: "canonical", Email: "First.Last+alias@example.com", Locale: "en", Source: "landing", ReceivedAt: time.Now().UTC().Add(-time.Hour), StoredAt: time.Now().UTC()}
	for _, scenario := range []string{"create", "existing", "conflict", "read failure", "write failure", "corrupt"} {
		t.Run(scenario, func(t *testing.T) {
			stored := []byte(nil)
			if scenario == "existing" {
				stored, _ = json.Marshal(first)
			}
			if scenario == "corrupt" {
				stored = []byte("{")
			}
			puts := 0
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("Last-Modified", first.StoredAt.Format(http.TimeFormat))
				if r.Method == http.MethodGet {
					if scenario == "read failure" {
						w.WriteHeader(403)
						_, _ = io.WriteString(w, `<Error><Code>AccessDenied</Code></Error>`)
						return
					}
					if stored == nil {
						w.WriteHeader(404)
						_, _ = io.WriteString(w, `<Error><Code>NoSuchKey</Code></Error>`)
						return
					}
					_, _ = w.Write(stored)
					return
				}
				if r.Method != http.MethodPut {
					t.Errorf("unexpected S3 method %s", r.Method)
					w.WriteHeader(400)
					return
				}
				puts++
				if r.Header.Get("If-None-Match") != "*" {
					t.Error("missing atomic create condition")
				}
				if scenario == "write failure" {
					w.WriteHeader(403)
					_, _ = io.WriteString(w, `<Error><Code>AccessDenied</Code></Error>`)
					return
				}
				if scenario == "conflict" {
					stored, _ = json.Marshal(first)
					w.WriteHeader(412)
					_, _ = io.WriteString(w, `<Error><Code>PreconditionFailed</Code></Error>`)
					return
				}
				stored, _ = io.ReadAll(r.Body)
				w.Header().Set("ETag", `"created"`)
				w.WriteHeader(200)
			}))
			defer server.Close()
			client, err := minio.New(strings.TrimPrefix(server.URL, "http://"), &minio.Options{Region: "us-east-1", Creds: credentials.NewStaticV4("", "", "")})
			if err != nil {
				t.Fatal(err)
			}
			candidate := first
			candidate.EventID = "later"
			candidate.Locale = "ja"
			actual, err := persistContact(context.Background(), client, "contacts-bucket", "contacts/key.json", candidate)
			if strings.Contains(scenario, "failure") || scenario == "corrupt" {
				if err == nil {
					t.Fatal("failure ignored")
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			if scenario == "create" {
				if actual.EventID != "later" || puts != 1 {
					t.Fatal("first registration not created")
				}
			} else if actual.EventID != first.EventID || actual.Locale != first.Locale || !actual.ReceivedAt.Equal(first.ReceivedAt) {
				t.Fatal("canonical record overwritten")
			}
			if scenario == "existing" && puts != 0 {
				t.Fatal("existing contact was rewritten")
			}
		})
	}
}
