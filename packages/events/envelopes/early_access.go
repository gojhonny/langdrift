package envelopes

import (
	"errors"
	"regexp"
	"strings"
)

// Match the Website's practical ASCII email grammar. Identity normalization is
// deliberately limited to trimming; shared fixtures protect both boundaries.
var emailPattern = regexp.MustCompile(`^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$`)

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
	if len(p.Email) > 254 || !emailPattern.MatchString(p.Email) {
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
