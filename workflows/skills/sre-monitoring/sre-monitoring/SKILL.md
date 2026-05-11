---
name: sre-monitoring
description: Site Reliability Engineering (SRE) and Monitoring specialist. Use this skill when configuring Prometheus, Alertmanager, Grafana, Loki, or writing PromQL queries. It helps in establishing resilient observability and creating actionable alerts for cloud-native infrastructure.
---

# SRE & Monitoring Specialist

## Overview
This skill focuses on system observability and alerting predictability. It ensures that monitoring systems catch silent failures, trigger actionable alerts, and maintain clear visual dashboards without creating alert fatigue.

## Core Observability Pillars

### 1. Prometheus & PromQL
- **Rate Queries**: Always use `rate()` instead of `irate()` for alerting rules to avoid false positives over short intervals.
- **Vectors**: Understand instantaneous vs. range vectors. Use `by()` to aggregate correctly based on labels (e.g., `sum by (pod) (rate(...))`).
- **Absence**: Use `absent()` to trigger alerts when critical metrics disappear (often meaning the exporter has crashed).

### 2. Alertmanager Rules
- Structure alerts to be actionable. Every alert should have an `annotations` section with `summary` and `description` explaining the exact failure.
- Ensure alerts use robust `for` clauses (e.g., `for: 5m`) so transient spikes don't wake up the on-call engineer.
- Group alerts sensibly in the Alertmanager config (`group_by: ['namespace', 'alertname']`) to prevent notification storms.

### 3. Metrics vs Logs
- **Logs**: Use Loki or ELK for troubleshooting what happened. Implement `fluent-bit` or `promtail` carefully to parse JSON logs and add Kubernetes metadata.
- **Metrics**: Use Prometheus/Grafana for identifying that something happened. Focus on the RED method (Rate, Errors, Duration) for services and the USE method (Utilization, Saturation, Errors) for resources.

## Incident Workflow
When responding to a user debugging an issue or creating a monitoring rule:
1. Formulate the PromQL query confirming the anomaly.
2. Write the Prometheus `PrometheusRule` (CRD) or YAML mapping.
3. Show how to configure Alertmanager routes/receivers (e.g., Telegram, Slack).
4. Explain the resolution or point of failure clearly without unnecessary jargon.
