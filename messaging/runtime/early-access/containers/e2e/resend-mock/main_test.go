package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestIdempotentSends(t *testing.T) {
	mock := (&state{records: make(map[string]sent), verified: make(map[string]bool)}).routes()
	for range 2 {
		request := httptest.NewRequest(http.MethodPost, "/emails", strings.NewReader(`{"to":["a@example.com"]}`))
		request.Header.Set("Idempotency-Key", "first")
		response := httptest.NewRecorder()
		mock.ServeHTTP(response, request)
		if response.Code != 200 {
			t.Fatalf("send = %d", response.Code)
		}
	}
	stateResponse := httptest.NewRecorder()
	mock.ServeHTTP(stateResponse, httptest.NewRequest(http.MethodGet, "/state", nil))
	if !strings.Contains(stateResponse.Body.String(), `"count":1`) {
		t.Fatal(stateResponse.Body.String())
	}
}

func TestChallengeTokenCanOnlyBeVerifiedOnce(t *testing.T) {
	mock := (&state{records: make(map[string]sent), verified: make(map[string]bool)}).routes()
	for attempt := 0; attempt < 2; attempt++ {
		request := httptest.NewRequest(http.MethodPost, "/siteverify", strings.NewReader(`{"secret":"1x0000000000000000000000000000000AA","response":"token"}`))
		response := httptest.NewRecorder()
		mock.ServeHTTP(response, request)
		if (strings.Contains(response.Body.String(), `"success":true`)) != (attempt == 0) {
			t.Fatalf("attempt %d: %s", attempt, response.Body.String())
		}
	}
}
