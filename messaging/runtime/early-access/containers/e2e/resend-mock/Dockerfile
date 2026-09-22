FROM golang:1.27.1-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
COPY messaging/runtime/early-access/containers/e2e/resend-mock ./messaging/runtime/early-access/containers/e2e/resend-mock
ARG GO_COVER_FLAGS
RUN CGO_ENABLED=0 go build ${GO_COVER_FLAGS} -trimpath -o /out/resend-mock ./messaging/runtime/early-access/containers/e2e/resend-mock

FROM alpine:3.23
RUN apk add --no-cache ca-certificates
RUN mkdir -m 0777 /coverage
COPY --from=build /out/resend-mock /usr/local/bin/resend-mock
USER 65532:65532
EXPOSE 8080
CMD ["/usr/local/bin/resend-mock"]
