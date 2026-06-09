# Public/Anonymous Survey Respondent Frontend (Erevna B3 + B4)

## Problem statement
Today only logged-in tenant staff can fill a survey. We need:
- **B3**: a public, anonymous route `/public/survey/{externalId}` where anyone with a
  link can fill the active survey, reusing the existing fill UI.
- **B4**: a Share/QR action on Active templates in the owner dashboard.

Mirror the Katalogos public-menu pattern that already exists in this repo.

## Backend contracts (LIVE, public, anonymous, direct-to-questioner-API)
- `GET {QUESTIONER_API_URL}/public/questionerTemplates/{externalId}`
  -> `200 { externalId, name, description, contents: { questions: [...] } }`
  (answers stripped). `404` if missing/not active.
- `POST {QUESTIONER_API_URL}/public/questionerTemplates/{externalId}/responses`
  body `{ name?, description?, contents }` -> `200 { externalId }`. `404` if not active.
- Public share URL: `{origin}/public/survey/{externalId}`.

## Reuse map
- Fetch pattern: `src/server/customHooks/usePublicMenuGetById.ts`
  (`get(path, params, { withToken:false, withCredentials:false, baseURL })`).
- Public layout: `app/public/menu/embed/_layout.tsx` (LazyQueryProvider + headerless Stack).
- Fill stack: `useQuizForm(data, createCompleted, refetch, FM)` consumed by
  `app/(protected)/quiz-active/index.tsx`. `createCompleted` must expose
  `mutateAsync: ({ data: CreateCompletedQuestionerRequest }) => Promise<unknown>`.
- QR: `src/components/OnlineMenus/QrCode` (`QrCodeModal` takes `menuName`, `publicUrl`),
  `buildPublicMenuUrl.ts`, `useMenuQrCode.ts`.
- QR row action: `TenantListItem` `onQrCode?` prop; labels via
  `${ns}.qrCode.{title,qrCodeHint,qrCodeDisabledHint}`. The QR button is a
  `StatusAwareButton` -> auto-disabled when item is not active (satisfies
  "only active surveys get a public link").

## Files to create
- `src/server/customHooks/usePublicQuestionerTemplate.ts`
- `src/server/customHooks/usePublicSubmitResponse.ts` (+ pure `toPublicResponseBody` mapper)
- `src/server/customHooks/usePublicSubmitResponse.test.ts`
- `src/components/OnlineMenus/QrCode/utils/buildPublicSurveyUrl.ts`
- `src/components/OnlineMenus/QrCode/utils/buildPublicSurveyUrl.test.ts`
- `src/hooks/usePublicSurvey.ts` (the public quiz screen orchestration hook)
- `src/hooks/useQuizTemplateQrCode.ts` (mirror of useMenuQrCode)
- `src/features/questioner/components/PublicSurveyScreen.tsx`
- `app/public/survey/_layout.tsx`
- `app/public/survey/[id].tsx`

## Files to modify
- `src/localization/locales/en.json` (publicSurvey.*, quizTemplates.qrCode.*)
- `src/shared/testIds/commonTestIds.ts` (public survey + QR testIds)
- `app/(protected)/quiz-templates/index.tsx` (wire onQrCode + modal)

## Success criteria
- `/public/survey/{id}` fills + submits without auth, 404 -> friendly screen, success -> ThankYouOverlay.
- Active template rows show a working Share/QR action (modal + copy link).
- All text via FM(); keys added first. testID/a11y on interactive elements.
- npm lint/typecheck/yagni:ci/test all green.

## Decisions
- `usePublicSubmitResponse` returns `{ mutateAsync }` matching `useQuizForm`'s `MutationArg`,
  built on a `useMutation` so it integrates with the LazyQueryProvider's QueryClient.
- 404 detection via a small `isNotFoundError(error)` axios-status check (no new dep).
- Reuse `QrCodeModal` (added optional `title`/`note` props, backward compatible) so the
  survey share dialog can show "Share" title + the "anyone with this link" note while
  keeping the menu callers unchanged.
- QR action shown on every template row but auto-disabled when not Active (existing
  `StatusAwareButton` behaviour) — satisfies "only active surveys serve a public link".
- `PublicSurveyState` enum extracted to its own file per enum-file-isolation rule.

## Results — verification gates (Tilt offline, npm direct)
- `npm run lint:strict` — PASS (0 errors / 0 warnings)
- `npx tsc --noEmit` — PASS (clean)
- `npm run yagni:ci` — PASS (0 dead exports)
- `npm test` — PASS (334 suites, 4013 tests)
- `npx expo export --platform web` — PASS (`Exported: dist`; `[id]` survey bundle emitted)

## Status: COMPLETE
