---
name: k8s-architect
description: Provides deep expertise in Kubernetes and Helm architecture, security best practices, and production-grade manifest generation. Use when creating or modifying Kubernetes resources (Deployments, StatefulSets, Services, Ingresses, ConfigMaps, Secrets, RBAC, NetworkPolicies) to ensure they meet enterprise cloud-native standards.
---

# K8s Architect

## Overview
This skill enforces strict cloud-native best practices for Kubernetes and Helm deployments, ensuring maximum security, high availability, and optimal resource management.

## Core Mandates

### 1. Security First
- **Always** apply `securityContext` to Pods and Containers:
  - `runAsNonRoot: true`
  - `readOnlyRootFilesystem: true` (where applicable)
  - Drop all capabilities (`capabilities: { drop: ["ALL"] }`)
- Never use `latest` tags. Prefer explicit shas or semver versions.
- Never hardcode credentials. Always use `Secret` resources or ExternalSecrets.

### 2. Resource Management
- **Always** define `resources.requests` and `resources.limits`.
  - Prefer keeping CPU limits tight or relying on requests to avoid CPU throttling in multi-tenant environments, depending on the user's specific performance requirements.
  - Set memory limits equal to requests for predictable memory-bound applications (like Java/JVM databases) to prevent OOMKilled errors.

### 3. Reliability & Availability
- Implement robust Health Checks. **Always** include both `readinessProbe` and `livenessProbe` tailored to the application's actual health endpoint (e.g., HTTP `/health` or TCP socket).
- Include `podDisruptionBudgets` (PDBs) for critical deployments to ensure quorum during node drains.
- Configure `topologySpreadConstraints` or `podAntiAffinity` to spread replicas across nodes/availability zones safely.

### 4. Helm Best Practices
- Keep `values.yaml` clean and DRY.
- Use `helpers.tpl` for labels, select labels, and resource names.
- Provide configurable blocks for annotations, nodeSelectors, and tolerations.

## Workflow 
When asked to create or review K8s manifests:
1. Identify the workload type (Stateless Web App -> Deployment, Database -> StatefulSet).
2. Generate the manifest incorporating all aforementioned security and reliability baselines.
3. Highlight to the user any configuration that requires their specific environment variables (like secret names or domain names).
