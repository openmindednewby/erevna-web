---
id: EREVNA-20
title: "Public API + webhooks — API key auth, public read endpoints, outbound webhooks"
status: done
requirements: []
tests: []
assignee: ~
source: migrated:ROADMAP.md
created: 2026-03-20
updated: 2026-03-20
---

Context: API key management in IdentityService (SHA-256, mk_live_ format, scopes, rate tiers), 3 public read-only menu endpoints + ApiKeyAuthMiddleware in OnlineMenu, and a full outbound webhook system in NotificationService (HMAC-SHA256 signing, circuit breaker, exponential retries, MassTransit consumer for 4 event types). All shipped with tests.
