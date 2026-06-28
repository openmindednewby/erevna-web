---
id: EREVNA-6
title: "Email service real delivery (SendGrid) for OTP, password reset, notifications"
status: todo
requirements: []
tests: []
assignee: ~
source: migrated:email-service-integration.md
created: 2026-03-22
updated: 2026-03-22
---

Email NuGet packages (Email.Abstractions + Email.Smtp), 6 HTML templates, and the IdentityService CompositeNotificationService are done, but the dev pipeline still routes through Mailpit (a dev-only SMTP trap). Wire a real transactional email provider (SendGrid) so OTP, password reset, and notification emails actually deliver in production. Estimated ~2 days.
