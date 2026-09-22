package eventstreaming

import (
	"errors"
	"net/url"
)

// ValidateNATSURL prevents local plaintext configuration from reaching production.
// The runtime currently authenticates with credentials carried in this URL.
func ValidateNATSURL(raw, mode string) error {
	u, err := url.Parse(raw)
	if err != nil || u.Hostname() == "" || u.RawQuery != "" || u.Fragment != "" || (u.Path != "" && u.Path != "/") {
		return errors.New("invalid_nats_endpoint")
	}
	if mode == "production" {
		if u.Scheme != "tls" || u.User == nil || u.User.Username() == "" {
			return errors.New("production_nats_requires_tls_and_credentials")
		}
		password, present := u.User.Password()
		if !present || password == "" {
			return errors.New("production_nats_requires_credentials")
		}
		return nil
	}
	if (mode == "development" || mode == "test") && (u.Scheme == "nats" || u.Scheme == "tls") {
		return nil
	}
	return errors.New("invalid_runtime_mode_or_nats_transport")
}
