# More Question Types + Answer Validation (erevna-web frontend)

## Problem
Add 5 new question types (Rating, Nps, Number, Date, LinearScale) plus full answer
validation (validationRules) to the erevna-web survey frontend. Backend contract is
already extended; Orval cannot be re-run (backend undeployed) so generated models are
hand-extended to match.

## Plan
1. Hand-extend generated models: `questionType.ts` (+5 numeric members),
   `question.ts` (+validationRules?, +config?), new `validationRules.ts` +
   `questionConfig.ts`, re-export from `index.ts`.
2. UI enum `QuestionType.ts` (+5 string members).
3. UI `interfaces.ts` Question (+validationRules?, +config?).
4. Light registry `DynamicForm/questionTypes/registry.ts` mapping uiType -> entry
   ({ uiType, apiType, labelKey, render, supportsOptions, defaultConfig?, validate? }).
5. 5 new renderer components + refactor QuestionRenderer to drive off registry.
6. quizHelpers: extend apiToUiType/uiToApiType; add validateAnswer; map config+rules.
7. useQuizFormState.collectErrors -> route through validateAnswer (per-type + rules).
8. Editors: per-type config editor (scale/number) + validation-rules editor.
9. CSV export: numeric/date single value (already generic via formatAnswer — verify).
10. Analytics: aggregate numeric types (avg+distribution), date as list.
11. i18n keys in en.json. Tests for conversion, validation, registry.

## Success criteria
- npm run lint (0 warn), tsc --noEmit (0), yagni:ci (no NEW dead exports), jest green.
- No hardcoded strings; all via FM(). Registry open-closed.

## Status: IN PROGRESS
