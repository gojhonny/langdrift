package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

type sent struct {
	Key       string `json:"key"`
	Recipient string `json:"recipient"`
	ID        string `json:"id"`
	Subject   string `json:"subject"`
}
type state struct {
	sync.Mutex
	records  map[string]sent
	control  failureControl
	attempts int
	verified map[string]bool
}

type failureControl struct {
	Status            int  `json:"status"`
	DelayMS           int  `json:"delayMs"`
	Remaining         int  `json:"remaining"`
	AcceptBeforeDelay bool `json:"acceptBeforeDelay"`
}

func (s *state) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { writeJSON(w, 200, map[string]string{"status": "ok"}) })
	mux.HandleFunc("GET /state", func(w http.ResponseWriter, _ *http.Request) {
		s.Lock()
		defer s.Unlock()
		list := make([]sent, 0, len(s.records))
		for _, item := range s.records {
			list = append(list, item)
		}
		writeJSON(w, 200, map[string]any{"count": len(list), "records": list, "attempts": s.attempts})
	})
	mux.HandleFunc("POST /control", func(w http.ResponseWriter, r *http.Request) {
		var input failureControl
		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 1024)).Decode(&input) != nil || (input.Status != 0 && (input.Status < 400 || input.Status > 599)) || input.DelayMS < 0 || input.DelayMS > 15000 || input.Remaining < -1 {
			writeJSON(w, 400, map[string]string{"error": "invalid"})
			return
		}
		s.Lock()
		s.control = input
		s.Unlock()
		writeJSON(w, 200, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("POST /siteverify", func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Secret   string `json:"secret"`
			Response string `json:"response"`
		}
		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&input) != nil {
			writeJSON(w, 400, map[string]bool{"success": false})
			return
		}
		s.Lock()
		defer s.Unlock()
		valid := input.Secret == "1x0000000000000000000000000000000AA" && input.Response != "" && !s.verified[input.Response]
		if valid {
			s.verified[input.Response] = true
		}
		writeJSON(w, 200, map[string]any{"success": valid, "hostname": "127.0.0.1", "action": "test"})
	})
	mux.HandleFunc("POST /emails", func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("Idempotency-Key")
		if key == "" || len(key) > 128 {
			writeJSON(w, 400, map[string]string{"error": "missing_key"})
			return
		}
		var input struct {
			To      []string `json:"to"`
			Subject string   `json:"subject"`
		}
		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&input) != nil || len(input.To) != 1 {
			writeJSON(w, 400, map[string]string{"error": "invalid"})
			return
		}
		s.Lock()
		s.attempts++
		control := s.control
		if control.Remaining == 0 {
			control = failureControl{}
		}
		if s.control.Remaining > 0 {
			s.control.Remaining--
		}
		item, exists := s.records[key]
		if !exists && (control.Status == 0 || control.AcceptBeforeDelay) {
			digest := sha256.Sum256([]byte(key))
			item = sent{Key: key, Recipient: input.To[0], Subject: input.Subject, ID: "mock-" + hex.EncodeToString(digest[:8])}
			s.records[key] = item
		}
		s.Unlock()
		if exists && item.Recipient != input.To[0] {
			writeJSON(w, 409, map[string]string{"error": "idempotency_conflict"})
			return
		}
		if control.DelayMS > 0 {
			timer := time.NewTimer(time.Duration(control.DelayMS) * time.Millisecond)
			defer timer.Stop()
			select {
			case <-r.Context().Done():
				return
			case <-timer.C:
			}
		}
		if control.Status != 0 {
			writeJSON(w, control.Status, map[string]string{"error": "controlled_failure"})
			return
		}
		writeJSON(w, 200, map[string]string{"id": item.ID})
	})
	return mux
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	server := &http.Server{Addr: ":8080", Handler: (&state{records: make(map[string]sent), verified: make(map[string]bool)}).routes(), ReadHeaderTimeout: 2 * time.Second, ReadTimeout: 5 * time.Second, WriteTimeout: 20 * time.Second, IdleTimeout: 30 * time.Second}
	go func() {
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Print("mock_http_failed")
			stop()
		}
	}()
	<-ctx.Done()
	shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = server.Shutdown(shutdown)
}
