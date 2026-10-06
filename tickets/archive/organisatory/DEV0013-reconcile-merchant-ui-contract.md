# Ticket DEV0013: Reconcile the merchant UI contract

- Status: Completed
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M0–M1 product contract
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0002 — Scaffold applications and tooling](DEV0002-scaffold-applications-and-tooling.md), [DEV0003 — Establish payment data and API foundation](../../current/backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0004 — Build merchant payment request](../../current/merchant/DEV0004-build-merchant-payment-request.md), [DEV0014 — Build the static merchant interface](../merchant/DEV0014-build-static-merchant-interface.md)

## Objective and context

Adopt [`MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md`](../../../MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md) as the detailed merchant-interface contract while keeping [`DEVELOPER_SPEC.md`](../../../DEVELOPER_SPEC.md) authoritative for shared system behavior. Reconcile conflicting payment-state, endpoint, amount, expiry, and database terminology before implementation depends on it.

The user supplied the new UI document and explicitly authorized changing it to fit the agreed product needs.

## Scope and non-goals

In scope:

- Add the UI specification to project navigation and document ownership rules.
- Preserve its Design Concept 2 visual direction and plain-language merchant experience.
- Align internal states with `PENDING`, `SUBMITTED`, `CONFIRMED`, `FAILED`, `EXPIRED`, and `CANCELLED`.
- Align API paths with the existing `/api/payments` contract.
- Distinguish displayed euro cents from raw EURC token units without floating-point ambiguity.
- Adopt one explicit 10-minute payment-request expiry and update affected main-spec examples.
- Update the backlog and dependencies for a fixture-driven static merchant interface.

Out of scope:

- Runtime application code, final database migrations, live APIs, customer mobile implementation, Solana integration, or production design assets.

## Expected behavior and edge cases

Developers can determine which document owns a decision and do not need to guess between `PAID` and `CONFIRMED`, `/api/payment-intents` and `/api/payments`, or euro cents and token-minor units. User-facing copy may say “Payment received” and “Confirmed” while the persisted internal state remains `CONFIRMED`. A submitted transaction remains unconfirmed until backend verification succeeds.

## Assumptions, decisions, and dependencies

- `DEVELOPER_SPEC.md` remains authoritative for cross-application behavior and security.
- The UI specification is authoritative for merchant visual design, copy, components, responsive behavior, accessibility, and screen states.
- Merchant display currency is `EUR`; settlement asset is test `EURC`. `amountCents` stores the displayed euro amount and `amountRaw` stores exact token units.
- The demo maps one displayed euro to one test EURC before converting to the configured mint's exact raw units.
- The companion Design Concept 2 image is not present in the repository, so initial implementation uses the complete textual design specification.

## Implementation plan

1. Add document-ownership and navigation links.
2. Normalize state, API, amount, database, realtime, and expiry terminology in both specifications.
3. Add the static merchant-interface ticket and update coordination dependencies.
4. Validate local links, conflicting terminology, and ticket mappings.

## Acceptance criteria

- [ ] AC1: Project navigation identifies both specifications and their non-overlapping authority.
- [ ] AC2: The specifications use one internal state model, endpoint family, amount model, and expiry default.
- [ ] AC3: The UI specification retains the approved visual and plain-language requirements without implying unsupported card, fiat, mainnet, or multi-currency behavior.
- [ ] AC4: The new static UI ticket is indexed and mapped in COR0001 without overlapping DEV0004's live payment integration.

## Validation plan

Run local Markdown-link validation, search for superseded paths and internal `PAID` state declarations, inspect amount examples, and verify the ticket index and COR0001 membership.

## Implementation record

### Changes and rationale

Added the merchant UI specification to the project source hierarchy and kept it subordinate to the shared system and security rules in `DEVELOPER_SPEC.md`. Normalized the newer design document around the safer existing `SUBMITTED` and `CONFIRMED` lifecycle, while adopting its clearer distinction between merchant-facing euro cents and raw EURC token units. Adopted the newer 10-minute request lifetime because the UI is designed around a ten-minute countdown.

Created DEV0014 for fixture-driven visual implementation. This keeps visual work independent from DEV0004, which continues to own authoritative payment creation and QR integration.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| [`AGENTS.md`](../../../AGENTS.md) | Added the UI specification's authority and its boundary with the main specification. |
| [`README.md`](../../../README.md) | Added navigation and clarified display-versus-settlement amount fields. |
| [`DEVELOPER_SPEC.md`](../../../DEVELOPER_SPEC.md) | Adopted `amountCents`, separate `amountRaw`, display/settlement fields, 10-minute expiry, and realtime-first recovery polling. |
| [`MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md`](../../../MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md) | Aligned state, API, amount, database, and realtime terminology while preserving the visual contract. |
| [`DEV0014`](../merchant/DEV0014-build-static-merchant-interface.md) | Added the fixture-driven visual implementation scope and checks. |
| [`COR0001`](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md) | Added document and static-UI ownership to the delivery map. |

No runtime API, database, or deployed behavior changed. The documented API uses `/api/payments`; persisted state uses `CONFIRMED`; `amountCents` stores displayed euro cents; `amountRaw` stores exact EURC token units; the default expiry is 600 seconds.

### Decisions and deviations

- 2026-10-06: Preserved `SUBMITTED` and `CONFIRMED` instead of adopting the UI draft's direct `PENDING -> PAID` transition because customer submission is not proof of payment.
- 2026-10-06: Kept `/api/payments` rather than introducing a second `/api/payment-intents` endpoint family.
- 2026-10-06: The missing companion image does not block the first UI because the text specifies tokens, layouts, components, responsive behavior, copy, and screen states in detail.

## Validation results

- Date and environment: 2026-10-06, local macOS workspace.
- Local Markdown link script: Passed for all repository Markdown files.
- Contract terminology script: Passed; no `/api/payment-intents`, `payment_intents.status`, `amountMinor`, direct `PAID` type declaration, or five-minute expiry remains in the UI contract.
- Ticket mapping script: Passed; DEV0013 and DEV0014 are present in the index and COR0001.
- Application tests: Not applicable; this ticket changed documentation and work records only.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | README and AGENTS link both specifications and state their authority | Passed |
| AC2 | Automated search plus manual review of state, endpoint, amount, and expiry sections | Passed |
| AC3 | Visual, copy, and scope sections remain intact; unsupported currency selector and card behavior remain excluded | Passed |
| AC4 | DEV0014 is indexed and has a distinct fixture-only boundary from DEV0004 | Passed |

## Risks, limitations, and follow-ups

- Backend and database types remain plans until DEV0003 implements and tests them.
- If the missing companion image is later added, compare it with the text contract under a separate ticket and preserve the functional corrections already recorded here.

## Completion and review references

- Completed: 2026-10-06 — merchant UI contract aligned with the shared payment contract
- Commit: Shared initial repository commit — `[DEV0014] Add merchant payments application foundation`
- Review: Self-review completed
- Deployment or release: Not applicable
