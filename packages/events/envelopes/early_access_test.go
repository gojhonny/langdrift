package envelopes

import (
	"encoding/json"
	"os"
	"testing"
)

func TestSharedRegistrationFixtures(t *testing.T) {
	data, err := os.ReadFile("testdata/registration.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixtures []struct {
		Email      string
		Valid      bool
		Normalized string
	}
	if err := json.Unmarshal(data, &fixtures); err != nil {
		t.Fatal(err)
	}
	for _, fixture := range fixtures {
		payload := EmailReceivedPayload{Email: fixture.Email, Locale: "en", Source: "landing"}
		err := payload.Validate()
		if (err == nil) != fixture.Valid {
			t.Errorf("fixture %q: %v", fixture.Email, err)
		}
		if fixture.Valid && payload.Email != fixture.Normalized {
			t.Errorf("identity changed for %q", fixture.Email)
		}
	}
}

func TestEmailReceivedTrimsAndAllowsKnownValues(t *testing.T) {
	payload := EmailReceivedPayload{Email: "  a@example.com  ", Locale: "en", Source: "landing"}
	if err := payload.Validate(); err != nil {
		t.Fatal(err)
	}
	if payload.Email != "a@example.com" {
		t.Fatalf("email = %q", payload.Email)
	}
	for _, locale := range []string{"en", "pt-BR", "zh-Hant", "ja"} {
		payload.Locale = locale
		if err := payload.Validate(); err != nil {
			t.Fatalf("locale %s: %v", locale, err)
		}
	}
	for _, source := range []string{"landing", "pricing"} {
		payload.Source = source
		if err := payload.Validate(); err != nil {
			t.Fatalf("source %s: %v", source, err)
		}
	}
}

func TestEmailReceivedRejectsInvalidValues(t *testing.T) {
	cases := []EmailReceivedPayload{
		{Email: "not-an-email", Locale: "en", Source: "landing"},
		{Email: "Name <a@example.com>", Locale: "en", Source: "landing"},
		{Email: "", Locale: "en", Source: "landing"},
		{Email: "a@example.com", Locale: "fr", Source: "landing"},
		{Email: "a@example.com", Locale: "en", Source: "other"},
	}
	for _, payload := range cases {
		if err := payload.Validate(); err == nil {
			t.Fatalf("accepted %+v", payload)
		}
	}
}

func FuzzEmailValidation(f *testing.F) {
	f.Add("a@example.com")
	f.Add("Name <a@example.com>")
	f.Fuzz(func(t *testing.T, email string) {
		payload := EmailReceivedPayload{Email: email, Locale: "en", Source: "landing"}
		if payload.Validate() == nil && payload.Email == "" {
			t.Fatal("accepted empty address")
		}
	})
}
