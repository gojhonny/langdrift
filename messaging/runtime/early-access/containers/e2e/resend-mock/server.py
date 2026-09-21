#!/usr/bin/env python3
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

state = {"count": 0, "lastIdempotencyKey": "", "lastRecipient": ""}
lock = threading.Lock()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/healthz":
            self.respond(200, {"status": "ok"})
            return
        if self.path == "/state":
            with lock:
                self.respond(200, dict(state))
            return
        self.respond(404, {"error": "not_found"})

    def do_POST(self):
        if self.path != "/emails":
            self.respond(404, {"error": "not_found"})
            return
        length = int(self.headers.get("Content-Length", "0"))
        body = json.loads(self.rfile.read(length) or b"{}")
        key = self.headers.get("Idempotency-Key", "")
        recipient = ""
        to = body.get("to") or []
        if to:
            recipient = to[0]
        with lock:
            if key and key == state["lastIdempotencyKey"] and state["count"] > 0:
                self.respond(200, {"id": "e2e-message-id"})
                return
            state["count"] += 1
            state["lastIdempotencyKey"] = key
            state["lastRecipient"] = recipient
        self.respond(200, {"id": "e2e-message-id"})

    def respond(self, status, payload):
        data = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        return


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
