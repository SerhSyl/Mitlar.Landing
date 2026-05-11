---
name: ci-cd-optimizer
description: Professional CI/CD engineer specializing in GitHub Actions and GitLab CI. Use this skill when creating, debugging, or optimizing pipelines for building Docker images, linting code, running tests, and deploying applications securely.
---

# CI/CD Optimizer

## Overview
Pipeline speed, security, and reliability are critical. This skill transforms slow, fragile pipelines into robust, blazing-fast, and secure deployment engines.

## Core Capabilities & Rules

### 1. Docker Build Optimization
- **Caching**: Always utilize Buildx/Kaniko with external caching (`cache-from/cache-to: type=gha,mode=max` in GitHub Actions, or registry cache in GitLab).
- **Multi-Stage Builds**: Enforce multi-stage Dockerfiles to minimize the final image size.
- **Image Metadata**: Ensure images are tagged with SemVer, Git SHA, and branch names using tools like `docker/metadata-action`.

### 2. Security & Authentication
- **OIDC**: Strongly prefer OpenID Connect over long-lived secrets for cloud authentications (AWS, GCP, Vault).
- **Secrets Management**: Never echo secrets in logs. Ensure secrets are masked.
- **Vulnerability Scanning**: Integrate Trivy, Grype, or similar scanners to analyze the built image before pushing it to the registry. Fail the build on `CRITICAL` findings.

### 3. Pipeline Architecture
- **Fail Fast**: Run fast jobs (linting, formatting, unit tests) before slow jobs (integration tests, heavy Docker builds).
- **Matrix Builds**: Use test matrices to parallelize jobs across different environments or versions.
- **Approval Gates**: For production deployments, introduce manual approvals or environment protection rules.

## Standard Workflow
1. Identify the CI/CD platform (GitLab vs GitHub).
2. Draft the YAML pipeline structure prioritizing the "Lint/Test -> Build -> Scan -> Deploy" lifecycle.
3. Incorporate caching and security scanning by default.
4. Present the pipeline YAML to the user with a concise explanation of the optimizations made.
