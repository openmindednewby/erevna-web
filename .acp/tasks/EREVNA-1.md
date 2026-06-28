---
id: EREVNA-1
title: "More question types (Rating, Nps, Number, Date, LinearScale) + answer validation in erevna-web"
status: in-progress
requirements: []
tests: []
assignee: ~
source: migrated:more-question-types-and-validation.md
created: 2026-06-01
updated: 2026-06-28
---

Add 5 new survey question types plus full per-type answer validation (validationRules) to the erevna-web frontend. Backend contract is already extended but Orval cannot be re-run (backend undeployed), so generated models are hand-extended. Plan covers a registry-driven QuestionRenderer, new renderer components, quizHelpers conversion/validation, editors, CSV export, numeric/date analytics aggregation, and i18n keys. Still IN PROGRESS; success gate is lint (0 warn), tsc 0, yagni clean, jest green, FM()-only strings.
