package envelopes

import "testing"

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
