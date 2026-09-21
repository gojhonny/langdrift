#!/usr/bin/env python3
import hashlib
import json
import os
import time
import urllib.error
import urllib.request

EMAIL = "e2e@example.com"
DEADLINE = time.time() + 60


def fetch(url, data=None, headers=None):
    request = urllib.request.Request(url, data=data, headers=headers or {}, method="POST" if data else "GET")
    with urllib.request.urlopen(request, timeout=5) as response:
        return response.status, response.read()


def wait(label, ready):
    last = "not ready"
    while time.time() < DEADLINE:
        try:
            if ready():
                return
            last = "not ready"
        except (urllib.error.URLError, TimeoutError, OSError, json.JSONDecodeError, KeyError, StopIteration) as exc:
            last = str(exc)
        time.sleep(0.5)
    raise SystemExit(f"timed out waiting for {label}: {last}")


def stream_ready():
    _, raw = fetch("http://nats:8222/jsz?streams=true&consumers=true")
    state = json.loads(raw)
    stream = next(
        stream
        for account in state.get("account_details", [])
        for stream in account.get("stream_detail", [])
        if stream.get("name") == "EARLY_ACCESS"
    )
    if stream.get("state", {}).get("messages", 0) < 3:
        return False
    names = {
        consumer.get("name") or consumer.get("config", {}).get("durable_name")
        for consumer in stream.get("consumer_detail", [])
    }
    return {"early-access-email-store-v1", "early-access-email-sender-v1"} <= names


def mock_ready():
    _, raw = fetch("http://resend-mock:8080/state")
    state = json.loads(raw)
    return (
        state.get("count") == 1
        and state.get("lastRecipient") == EMAIL
        and str(state.get("lastIdempotencyKey", "")).startswith("early-access-ack/")
    )


def contact_ready():
    digest = hashlib.sha256(EMAIL.encode()).hexdigest()
    path = f"/data/langdrift-emails/contacts/{digest}.json"
    if os.path.isfile(path):
        return os.path.getsize(path) > 0
    if os.path.isdir(path):
        return any(os.scandir(path))
    return False


def main():
    wait("email-store", lambda: fetch("http://email-store:8080/healthz")[0] == 200)
    wait("resend-mock", lambda: fetch("http://resend-mock:8080/healthz")[0] == 200)
    body = json.dumps({"email": EMAIL, "locale": "en", "source": "landing"}).encode()
    status, raw = fetch(
        "http://email-store:8080/v1/emails",
        body,
        {
            "Authorization": "Bearer " + os.environ["EMAIL_SERVICE_API_KEY"],
            "Content-Type": "application/json",
        },
    )
    if status != 202 or b'"status":"accepted"' not in raw:
        raise SystemExit(f"registration failed: {status} {raw!r}")
    wait("stream", stream_ready)
    wait("provider", mock_ready)
    wait("contact", contact_ready)
    print("early-access event chain proved against the test provider", flush=True)


if __name__ == "__main__":
    main()
