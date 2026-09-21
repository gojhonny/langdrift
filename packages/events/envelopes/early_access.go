package envelopes

import (
	"errors"
	"net/mail"
	"strings"
	"unicode/utf8"
)

const (
	TypeEmailReceived Type = "email.received"
	TypeEmailStored   Type = "email.stored"
	TypeEmailSent     Type = "email.sent"
)

type EmailReceivedPayload struct {
	Email  string `json:"email"`
	Locale string `json:"locale"`
	Source string `json:"source"`
}
type EmailStoredPayload struct {
	Email     string `json:"email"`
	Locale    string `json:"locale"`
	Source    string `json:"source"`
	ObjectKey string `json:"objectKey"`
}
type EmailSentPayload struct {
	Email             string `json:"email"`
	Provider          string `json:"provider"`
	ProviderMessageID string `json:"providerMessageId"`
}

func (p *EmailReceivedPayload) Validate() error {
	p.Email = strings.TrimSpace(p.Email)
	address, err := mail.ParseAddress(p.Email)
	if err != nil || p.Email == "" || utf8.RuneCountInString(p.Email) > 254 || address.Address != p.Email || address.Name != "" || strings.ContainsAny(p.Email, "\r\n") {
		return errors.New("invalid_email")
	}
	switch p.Locale {
	case "en", "pt-BR", "zh-Hant", "ja":
	default:
		return errors.New("invalid_locale")
	}
	switch p.Source {
	case "landing", "pricing":
	default:
		return errors.New("invalid_source")
	}
	return nil
}
