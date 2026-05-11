---
name: go-backend
description: Expert Golang backend developer. Use this skill when architecting, writing, or debugging Go microservices, REST APIs, or background workers. It enforces Clean Architecture, proper concurrency, context usage, and testing methodologies.
---

# Go Backend Engineer

## Overview
This skill guides the creation of highly-concurrent, performant, and clean Go (Golang) microservices. It prioritizes idiomatic Go patterns, robust error handling, and separation of concerns.

## Core Best Practices

### 1. Architecture & Project Layout
- Enforce the standard Go project layout (`cmd/`, `internal/`, `pkg/`).
- Adopt Clean Architecture or Hexagonal Architecture:
  - Isolate business logic (entities/usecases) from delivery mechanisms (HTTP handlers/gRPC) and data persistence (repositories).
- Use dependency injection manually or via a lightweight framework (e.g., Wire).

### 2. Concurrency & Context
- **Always** pass `context.Context` as the first argument in functions performing I/O.
- Handle context cancellation gracefully (`ctx.Done()`) to prevent goroutine leaks.
- Avoid raw goroutines where errgroups (`golang.org/x/sync/errgroup`) can be used to manage concurrent tasks efficiently and collect errors.

### 3. Error Handling
- Never ignore errors!
- Wrap errors with context (`fmt.Errorf("doing something: %w", err)`) instead of returning raw errors.
- Use `errors.Is` and `errors.As` for error type checking instead of string matching.

### 4. Logging & Observability
- Use structured logging (e.g., `slog` or `zap`). Do not use `log.Fatal` inside library or business logic code.
- Add OpenTelemetry spans or Prometheus metrics to critical execution paths.

## Quick Start Guidelines
When asked to write a new Go microservice or an endpoint:
1. Define the interface and business logic first.
2. Implement the HTTP/gRPC transport layer, parsing requests and formatting responses.
3. Write table-driven unit tests for the business logic.
4. Integrate the repository layer for persistence.
