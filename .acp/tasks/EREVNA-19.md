---
id: EREVNA-19
title: "Payment & billing (Stripe) full stack — PaymentService, tiers, feature gating, E2E"
status: done
requirements: []
tests: []
assignee: ~
source: migrated:ROADMAP.md
created: 2026-03-20
updated: 2026-03-20
---

Context: full PaymentService microservice (entities, Stripe provider, CQRS, FastEndpoints, background scheduler). 3-tier plans (Free/Pro $29/Enterprise $99) + 14-day trial. Orval hooks, cross-service feature gating (limits, theme lock, domain gate, watermark), 116-test E2E suite in 2 sub-batches. Remaining follow-up tracked separately as Stripe test-mode verification (EREVNA-5).
