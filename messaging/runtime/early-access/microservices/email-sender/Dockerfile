FROM golang:1.27.1-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY packages/events ./packages/events
COPY messaging/runtime/early-access ./messaging/runtime/early-access
ARG GO_COVER_FLAGS
RUN CGO_ENABLED=0 go build ${GO_COVER_FLAGS} -trimpath -ldflags="-s -w" -o /out/email-sender ./messaging/runtime/early-access/microservices/email-sender

FROM alpine:3.23
RUN apk add --no-cache ca-certificates
RUN mkdir -m 0777 /coverage
COPY --from=build /out/email-sender /usr/local/bin/email-sender
USER 65532:65532
ENTRYPOINT ["/usr/local/bin/email-sender"]
