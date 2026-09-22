FROM golang:1.27.1-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
COPY packages/events ./packages/events
COPY messaging/runtime/early-access/containers/e2e/runner ./messaging/runtime/early-access/containers/e2e/runner
ARG GO_COVER_FLAGS
RUN CGO_ENABLED=0 go build ${GO_COVER_FLAGS} -trimpath -o /out/runner ./messaging/runtime/early-access/containers/e2e/runner

FROM alpine:3.23
RUN apk add --no-cache ca-certificates
RUN mkdir -m 0777 /coverage
COPY --from=build /out/runner /usr/local/bin/runner
USER 65532:65532
CMD ["/usr/local/bin/runner"]
