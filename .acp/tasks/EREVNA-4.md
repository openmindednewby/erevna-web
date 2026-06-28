---
id: EREVNA-4
title: "Fix public menu API caching so newly activated menus appear immediately"
status: todo
requirements: []
tests: []
assignee: ~
source: migrated:NEXT_STEPS.md
created: 2026-03-22
updated: 2026-03-22
---

Newly activated menus do not show on the public viewer immediately, which affects real users and forces 6 E2E tests to use graceful skips. Either disable server-side caching on /api/v1/public/menus in Docker, or add cache invalidation on menu activation. Estimated ~2 hours.
