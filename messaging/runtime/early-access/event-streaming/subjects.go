package eventstreaming

import "github.com/gojhonny/langdrift/packages/events/envelopes"

const (
	EmailReceived = string(envelopes.TypeEmailReceived)
	EmailStored   = string(envelopes.TypeEmailStored)
	EmailSent     = string(envelopes.TypeEmailSent)
)
