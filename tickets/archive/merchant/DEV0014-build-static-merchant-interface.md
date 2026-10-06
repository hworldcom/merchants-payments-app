# Ticket DEV0014: Build the static merchant interface

- Status: Completed
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M0–M1 visual foundation
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0002 — Scaffold applications and tooling](../organisatory/DEV0002-scaffold-applications-and-tooling.md), [DEV0004 — Build merchant payment request](../../current/merchant/DEV0004-build-merchant-payment-request.md), [DEV0009 — Present live confirmed payment](../../current/merchant/DEV0009-present-live-confirmed-payment.md), [DEV0013 — Reconcile the merchant UI contract](../organisatory/DEV0013-reconcile-merchant-ui-contract.md)

## Objective and context

Implement Phase 1 of the [merchant UI specification](../../../MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md#20-suggested-frontend-implementation-order) with fixture data so the approved visual system and complete merchant journey can be reviewed before backend integration.

## Scope and non-goals

In scope:

- Central design tokens and a mobile-first merchant application shell.
- Home dashboard, compact navigation, fixture metrics, and recent payments.
- Interactive euro amount entry with a numeric keypad and optional note.
- Fixture QR/waiting, confirmed receipt, payments list, and minimal settings screens.
- Responsive, keyboard, accessible-label, loading/disabled, empty, and representative error presentation where it belongs in the static journey.
- Component tests and visual checks at the primary 390–430 px width and a desktop width.

Out of scope:

- Calling payment APIs, generating authoritative payment intents, realtime subscriptions, customer app behavior, Solana transactions, or treating fixture state as real payment evidence.

## Expected behavior and edge cases

The merchant can navigate the fixture product, enter a valid euro amount without floating-point arithmetic, add an optional note, and preview waiting and confirmed presentation. There is no EUR/EURC selector, card-payment copy, mainnet implication, or premature success claim. The content remains centered and readable on desktop and respects phone-sized touch targets.

## Assumptions, decisions, and dependencies

- Requires the merchant application shell and UI token package from DEV0002; it may start once those parts exist even if the separate customer shell is still being validated.
- Uses local fixture data only, clearly separated from future service adapters.
- Uses the textual UI contract because `merchant_app_design_2_reference.png` is not currently present.
- Internal fixture states use the shared `CONFIRMED` terminology; interface copy remains “Payment received” and “Confirmed.”
- 2026-10-06: Implement the preview as one client-side merchant surface with explicit view states so the complete visual journey can be reviewed without pretending that routes or live payment data already exist.
- 2026-10-06: Use `qrcode.react` for a standards-compliant fixture QR and Lucide icons for consistent, accessible interface symbols. Neither dependency is authoritative payment logic.
- 2026-10-06: Keep the amount draft as a string and convert it to integer cents only after validation; never calculate canonical money with floating-point arithmetic.

## Implementation plan

1. Create reusable merchant components and fixture data.
2. Build dashboard, payments, settings, amount-entry, QR/waiting, and receipt screens.
3. Add amount-input rules, navigation, and fixture-only transitions.
4. Add component tests and run responsive visual review.
5. Document actual behavior, affected files, and validation evidence.

## Acceptance criteria

- [x] AC1: The implemented surfaces follow the white-first, purple-action, green-confirmation visual hierarchy and use centralized tokens.
- [x] AC2: A merchant can enter a positive amount with at most two decimal places, add a note, and preview a request without a currency or asset selector.
- [x] AC3: Dashboard, waiting, receipt, payments, and settings surfaces use the required plain-language copy and keep blockchain details secondary.
- [x] AC4: The interface remains usable at 390 px and desktop widths, has 44 px minimum interactive targets, visible focus, and non-color status labels.
- [x] AC5: Automated tests cover the main fixture journey and guard against the removed currency selector and unsupported card-payment language.

## Validation plan

Run merchant component tests, lint, type-check, and production build. Start the app and inspect the dashboard, amount, waiting, receipt, payments, and settings views at 390 px and desktop width, including keyboard focus and invalid or disabled amount behavior.

## Implementation record

### Changes and rationale

Built one mobile-first client surface with explicit local view states for the dashboard, amount entry, QR/waiting, confirmed receipt, payment activity, and settings. This makes the approved journey reviewable before the API and Solana work exists, while the fixture notices prevent preview data from being mistaken for verified payment evidence.

Kept canonical input as a validated string and converted it to integer euro cents. Added a standards-compliant fixture QR, centralized status and payment types, large controls, visible focus, reduced-motion handling, and plain-language empty and disconnected states. The primary interface shows euros; EURC and Solana appear only in secondary details.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| [`merchant-app.tsx`](../../../apps/merchant-web/src/components/merchant-app.tsx) | Complete fixture journey, navigation, status presentation, and screen semantics. |
| [`merchant-app.module.css`](../../../apps/merchant-web/src/components/merchant-app.module.css) | Responsive shell, design hierarchy, controls, focus, and reduced-motion behavior. |
| [`amount.ts`](../../../apps/merchant-web/src/components/amount.ts) | Exact keypad input rules and integer-cent conversion. |
| [`fixtures.ts`](../../../apps/merchant-web/src/components/fixtures.ts) | Clearly separated merchant and payment preview data. |
| [`merchant-app.test.tsx`](../../../apps/merchant-web/src/components/merchant-app.test.tsx) and [`amount.test.ts`](../../../apps/merchant-web/src/components/amount.test.ts) | Main journey, copy boundary, navigation, and amount edge-case coverage. |
| [`tokens.css`](../../../packages/ui-tokens/src/tokens.css) | Shared color, spacing, radius, and typography tokens used by the interface. |
| [`README.md`](../../../README.md) | Local preview instructions and fixture limitations. |

No API, database, wallet, realtime subscription, or Solana transaction was added. DEV0004 replaces the request fixtures; DEV0009 replaces the confirmed preview with backend-confirmed state.

### Decisions and deviations

- 2026-10-06: The missing companion image did not block implementation because the written specification fully defines the hierarchy, tokens, copy, responsive behavior, and screen states.
- 2026-10-06: The receipt includes a deliberate “Fixture receipt” notice. A confirmation preview is not transaction evidence.
- 2026-10-06: Added a small application icon after browser review exposed a missing-favicon request.

## Validation results

- Date and environment: 2026-10-06, local macOS workspace, Node.js and pnpm workspace.
- `pnpm check`: Passed. This ran repository lint, type checks for both apps and all shared packages, four schema tests, seven merchant tests, and the Next.js production build.
- Merchant component tests: Passed, 2 files and 7 tests.
- Production build: Passed; `/` is statically prerendered.
- Browser review: Passed in Chrome against the local production build at 390 × 844 and a 1390 × 768 desktop window.
- Reviewed views: dashboard, disabled amount state, €25.50 input, QR/waiting, fixture confirmation receipt, payment filters/list, and settings.
- Accessibility review: visible keyboard focus, labelled icon buttons and QR, non-color status text, 44 px control targets, and reduced-motion rules were present.
- Final production reload: Passed with the application icon visible and zero console messages.
- Local Markdown link check: Passed for all 26 repository Markdown files.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | Desktop and 390 px screenshots showed the white canvas, purple action, green confirmation, and shared token styling | Passed |
| AC2 | Component journey and amount unit tests covered €25.50, note entry, disabled zero amount, decimals, and maximum length | Passed |
| AC3 | Manual screen review and copy assertions covered dashboard, waiting, receipt, activity, settings, and fixture warnings | Passed |
| AC4 | Chrome responsive review plus focus and CSS checks covered both widths, target sizes, labels, and reduced motion | Passed |
| AC5 | Seven merchant tests passed and explicitly rejected currency-selector and card-payment language | Passed |

## Risks, limitations, and follow-ups

- Fixture QR and payment states are presentation previews only. DEV0004 and DEV0009 own authoritative API and realtime behavior.
- Visual comparison to the companion image remains unavailable until the asset is added.

## Completion and review references

- Completed: 2026-10-06 — fixture-driven merchant interface implemented and visually reviewed
- Commit: Initial repository commit — `[DEV0014] Add merchant payments application foundation`
- Review: Self-review completed
- Deployment or release: Not deployed
