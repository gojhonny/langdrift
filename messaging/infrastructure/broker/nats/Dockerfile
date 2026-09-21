FROM nats:2-alpine
COPY messaging/infrastructure/broker/nats/config/server.json /etc/nats/server.json
CMD ["--config", "/etc/nats/server.json"]
