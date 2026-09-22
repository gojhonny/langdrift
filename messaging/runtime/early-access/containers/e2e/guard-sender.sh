#!/bin/sh
set -eu
expected=http://resend-mock:8080/emails
if [ "${RESEND_API_URL:-}" != "$expected" ]; then
  printf '%s\n' 'refusing sender start: RESEND_API_URL is not the e2e mock' >&2
  exit 1
fi
exec /usr/local/bin/email-sender
