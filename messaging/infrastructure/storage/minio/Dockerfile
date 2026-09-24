# Quay and Docker Hub reject anonymous pulls of this release.
# The same tag is still published as a GitHub release binary.
FROM alpine:3.23
ARG TARGETARCH
ARG MINIO_RELEASE=RELEASE.2025-09-07T16-13-09Z
RUN apk add --no-cache ca-certificates curl \
  && case "$TARGETARCH" in \
    amd64) arch=amd64 ;; \
    arm64) arch=arm64 ;; \
    *) echo "unsupported architecture: $TARGETARCH" >&2; exit 1 ;; \
  esac \
  && curl --fail --silent --show-error --location \
    --output /usr/bin/minio \
    "https://github.com/minio/minio/releases/download/${MINIO_RELEASE}/minio.linux-${arch}.${MINIO_RELEASE}" \
  && chmod +x /usr/bin/minio
ENTRYPOINT ["minio"]
CMD ["server", "/data", "--console-address", ":9001"]
