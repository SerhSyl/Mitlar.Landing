# Docker Best Practices Guide

This reference expands on the Core Rules in `SKILL.md`.

## 1. Multi-Stage Builds & Minimal Images
Break the Dockerfile into a `builder` stage and a runtime stage.
Avoid carrying over build dependencies (like compilers, development headers, package managers) to the final image.

```dockerfile
# GOOD
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp main.go

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

## 2. Non-root Execution
Containers share the host kernel. Running as root inside the container is a major security risk.

- Always create a specific user/group (or use a predefined non-root user if the base image provides one, e.g., `nonroot` in distroless, or `node` in Node.js images).
- Use numeric UIDs greater than 10000 to prevent overlap with host users.

```dockerfile
# GOOD
RUN addgroup -g 10001 myapp && \
    adduser -D -u 10001 -G myapp myapp
USER 10001:10001
```

## 3. COPY --chown
When copying from a previous stage or the host, the files will be owned by root by default unless specified. Always use `--chown`.

```dockerfile
# GOOD
COPY --from=builder --chown=10001:10001 /app/binary /app/binary
```

## 4. Pinning Versions
Using `:latest` leads to non-deterministic builds. It might build successfully today and fail tomorrow.
Always use explicit tags or SHAs.

```dockerfile
# BAD
FROM python:latest

# GOOD
FROM python:3.11.8-slim-bookworm
# OR
FROM python@sha256:d826...
```

## 5. Metadata / OCI Labels
Help identify where an image came from and who is responsible for it. Use Open Containers Initiative (OCI) image format labels.

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/my-org/my-repo"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="My Awesome Microservice"
```

## 6. The .dockerignore File
Always propose a `.dockerignore` file alongside a Dockerfile. Committing secrets or copying heavy `node_modules`/`.git` directories into the build context slows down builds and can leak sensitive information.

Standard entries:
```
.git
.github
.env
Dockerfile
docker-compose.yml
# IDEs
.vscode
.idea
# Language specific
node_modules/
vendor/
__pycache__/
```
