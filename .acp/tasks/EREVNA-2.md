---
id: EREVNA-2
title: "Credential rotation execution — run the SAFE + bundle rotations"
status: blocked
requirements: []
tests: []
assignee: ~
source: migrated:credential-rotation-execution.md
created: 2026-05-01
updated: 2026-05-01
---

Monitoring/inventory/cron/Tilt infrastructure is complete and verified; what remains is actually rotating credentials. 15 OVERDUE + 13 WARN entries. Blocked: user directed pre-flight only (no rollout yet), and the bundle rotation needs script patches first (B1 stale container names — only SharedDB exists now, B2 Keycloak section hits production, B3 Tilt must be running). Next safe step is the 3 low-risk rotations (age key, github_pat, npm_token); the DB/RabbitMQ/SeaweedFS/Grafana/Keycloak bundle and K3s prod secrets are separate planned sessions.
