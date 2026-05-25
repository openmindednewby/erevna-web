# Erevna — Privacy Policy (DRAFT v1)

**Effective date:** [LAUNCH_DATE]
**Last updated:** [LAUNCH_DATE]

> ⚠️ **Status:** Lawyer-review required before public publication. Drafted as a starting point. Reflects every locked policy decision from the product roadmap.

> Items in `[BRACKETS]` need values filled in before publishing.

---

## 1. Who we are

Erevna is operated by **[LEGAL_ENTITY — e.g. Demetris Loizides, sole proprietor]**, with registered address at **[ADDRESS_CYPRUS]**. We are the data controller for personal data processed through the Erevna service.

You can contact us at:
- **Email:** privacy@erevna.dloizides.com
- **Postal:** [ADDRESS_CYPRUS]

---

## 2. What this policy covers

This policy explains how we collect, use, store, and disclose personal data when you:
- Create an Erevna account
- Use Erevna to build forms, surveys, or quizzes
- Respond to a form built with Erevna
- Visit erevna.dloizides.com

It does **not** cover personal data your tenant-admin (your employer or another organisation) collects from you through forms they create using Erevna. In that case, the tenant is the data controller; we are a data processor acting on their instructions.

---

## 3. Personal data we collect

### From account holders
- Name, email address, password (hashed)
- Authentication metadata (IP address, login timestamps, browser/device type)
- Subscription tier, billing details (handled by Stripe — see Section 7)
- Forms, surveys, and quizzes you build (including any personal data you embed in them)
- Tenant theme settings (logo, palette, typography choices)

### From form respondents
- Whatever the form asks (name, email, opinion, quiz answer, etc.)
- Submission timestamp
- IP address (for rate-limiting and abuse prevention)
- Browser/device type

### Automatic
- Cookies (essential session cookies only — see Section 9)
- Usage logs (page views, errors, feature usage) — anonymised after 90 days

We do **not** collect biometric data, precise location, or special-category data (health, racial, religious, etc.) unless your form explicitly asks for it. If your form does, you (the tenant) are responsible for the lawful basis.

---

## 4. Why we use it (lawful basis)

| Purpose | Lawful basis (GDPR Article 6) |
|---|---|
| Provide the service | Contract |
| Bill you / process payments | Contract |
| Send transactional emails (login, password reset, billing) | Contract |
| Send marketing emails | Consent (you can opt out anytime) |
| Detect abuse, prevent fraud | Legitimate interest |
| Comply with legal obligations (tax, court orders) | Legal obligation |
| Improve the service (aggregated analytics) | Legitimate interest |

---

## 5. How long we keep it

| Data | Retention |
|---|---|
| Active account data | While your account exists |
| Free / trial accounts after **12 months of zero activity** | Warning email at month 12; soft-deleted at month 13; hard-deleted at month 14 |
| Account data after explicit deletion request | Soft-deleted immediately (login disabled, data hidden); hard-deleted after a 30-day grace period during which you can undo |
| Paid account data after subscription cancellation | Drops to free-tier rules above |
| Form responses | While the parent form exists, or until tenant deletes them |
| Backups | Rolling 30 days; deleted data is purged from backups within 31 days |
| Usage logs | Anonymised after 90 days; aggregated retained indefinitely |
| Billing records | 7 years (Cyprus tax law) |

---

## 6. Who we share it with

We share personal data only with:

- **Hosting provider:** Hetzner Online GmbH (Germany, EU). Standard infrastructure access only.
- **Payment processor:** Stripe Inc. (transfers under SCCs / DPF). Receives payment details, not other personal data.
- **Email delivery:** Self-hosted on Hetzner (EU). No third-party email processor.
- **Error reporting:** Sentry (transfers under SCCs). Receives error events with PII redacted at source.
- **Legal authorities:** when required by Cyprus law or valid court order.

We do **not** sell personal data. We do **not** share form responses with third parties.

---

## 7. International transfers

All primary data storage is in the EU (Hetzner, Germany). Some sub-processors (Stripe, Sentry) involve transfers outside the EU; those rely on Standard Contractual Clauses (SCCs) and the EU-US Data Privacy Framework where applicable.

---

## 8. Your rights (GDPR Articles 15–22)

You have the right to:

- **Access** — request a copy of personal data we hold about you
- **Rectification** — correct inaccurate data
- **Erasure** — request deletion (see Section 5 retention)
- **Restriction** — limit how we use your data while a dispute is resolved
- **Portability** — receive your data in machine-readable format (CSV / JSON)
- **Object** — to processing based on legitimate interest
- **Withdraw consent** — for any processing based on consent
- **Lodge a complaint** with the Cyprus Office of the Commissioner for Personal Data Protection (or your local supervisory authority)

To exercise any right: email **privacy@erevna.dloizides.com**. We respond within 30 days.

---

## 9. Cookies

Erevna uses only essential cookies — session tokens to keep you logged in. We do **not** use marketing or analytics cookies. No cookie banner is required because no consent is needed for essential cookies.

If you respond to a form built by a tenant whose subscription includes ads (free tier), the tenant's ad provider may set additional cookies. The tenant is responsible for their cookie disclosure on the form.

---

## 10. Children

Erevna is not directed at children under 16. If your form collects responses from children under 16, you (the tenant) are responsible for the age-verification mechanism and parental consent.

---

## 11. Security

We use industry-standard practices: TLS for all transport, password hashing (argon2 / bcrypt), encrypted backups, network isolation, audit logging, and least-privilege access controls. We test for OWASP Top 10 vulnerabilities. No system is 100% secure; if a breach affects you, we'll notify you within 72 hours per GDPR Article 33–34.

---

## 12. Changes to this policy

We may update this policy. Material changes will be announced by email at least 30 days before they take effect. The "Last updated" date at the top reflects the most recent revision.

---

## 13. Contact

**Privacy questions:** privacy@erevna.dloizides.com
**Data subject requests:** privacy@erevna.dloizides.com
**General support:** support@erevna.dloizides.com

**Operator:** [LEGAL_ENTITY], [ADDRESS_CYPRUS]

---

## Verify before publishing

- [ ] Replace `[LEGAL_ENTITY]` with registered legal name
- [ ] Replace `[ADDRESS_CYPRUS]` with postal address
- [ ] Set `[LAUNCH_DATE]`
- [ ] Confirm email forwarding to privacy@ and support@ subdomains works
- [ ] Confirm Sentry processor relationship + SCCs are signed
- [ ] Confirm Stripe processor relationship + DPA is in place
- [ ] Confirm 7-year billing retention matches Cyprus tax requirements (verify with accountant)
- [ ] **Lawyer review** — Cyprus + GDPR + e-commerce regulation
- [ ] Translate to Greek (Cyprus) if targeting Greek-speaking market
