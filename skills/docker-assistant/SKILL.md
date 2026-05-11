---
name: docker-assistant
description: "Assistant for generating, reviewing, and analyzing Dockerfiles based on project security and best-practices. Use when working on Dockerfiles, containerizing applications, or reviewing CI/CD build scripts. The skill enforces multi-stage builds, non-root execution, minimal base images, and correct OCI labels."
---

# Docker Assistant

This skill defines the strict parameters and guidelines you must use when generating or reviewing Dockerfiles and container-related configurations for this project.

## Core Rules

Always adhere strictly to these rules. Do not compromise on security.

1.  **Multi-stage Builds**: Every Dockerfile should utilize multi-stage builds to minimize the final runtime image size.
2.  **Minimal Runtime Images**: The final stage must use the smallest feasible image (e.g., `distroless`, `alpine`, `ubi-micro`). Avoid full OS images like `ubuntu` for the runtime stage unless absolutely required.
3.  **Non-root Execution**: The runtime container must NEVER run as root. Always declare `USER <non-root-uid>` in the final stage. Use `COPY --chown=<uid>:<gid>` when copying artifacts.
4.  **Pin Versions**: Base images must have pinned versions (either strictly semantic tags like `:1.20.1-alpine` or sha256 digests). Never use `:latest`.
5.  **OCI Labels**: Add standard tags to identify the image build context (source, revision, created date).
6.  **.dockerignore**: Always ensure a comprehensive `.dockerignore` represents the project.

## Workflow

When asked to create or review a Dockerfile:

1.  **Analyze**: Look at the application language and framework.
2.  **Create/Edit**: Apply the core rules. Read `references/best_practices.md` if you need detailed guidance on specific rules.
3.  **Validate**: Read the generated Dockerfile against the Core Rules list above before providing the final result to the user.
4.  **Provide context**: Briefly explain *why* the changes were made (e.g., "Switched to distroless to minimize CVE surface," "Added a non-root user for security").

## References
For detailed explanations of these practices, refer to [references/best_practices.md](references/best_practices.md).

## Assets
For a bare-bones template, refer to [assets/Dockerfile.template](assets/Dockerfile.template).
