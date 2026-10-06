# Work records

This directory tracks planned changes, current status, and implementation evidence. The [developer specification](../DEVELOPER_SPEC.md) remains the product contract, and [AGENTS.md](../AGENTS.md) contains the authoritative contributor workflow.

## Record types

- A **development ticket** is a small implementable task named `DEVNNNN-short-title.md`. It owns implementation and validation evidence, and its identifier is used in commits. Start from [TEMPLATE.md](TEMPLATE.md).
- A **coordination record** is a non-implementation umbrella named `CORNNNN-short-title.md`. It maps peer development tickets, dependencies, and integration checks. Start from [COORDINATION_TEMPLATE.md](COORDINATION_TEMPLATE.md).

Development (`DEV`) and coordination (`COR`) identifiers use independent four-digit sequences. Check all current, archived, and retired records before allocating a number. Identifiers are permanent and never reused. The next available identifiers are `DEV0016` and `COR0002`.

## Areas

- `customer`: Expo and React Native customer flows, device behavior, and customer-facing presentation.
- `merchant`: merchant web routes, components, responsive behavior, and merchant-facing presentation.
- `backend`: application programming interfaces, database schema, server services, jobs, and realtime data delivery.
- `blockchain`: wallet, test-token transfer, Solana remote procedure call integration, and on-chain verification.
- `organisatory`: contributor workflow, repository structure, shared tooling, documentation, and cross-cutting rehearsal.

Open work stays under `current/<area>/`. Completed and cancelled history moves to `archive/<area>/` only after the record and index are updated.

## Workflow

1. Investigate the request and relevant product contract without changing implementation.
2. Create or refine one development ticket with concrete scope, boundaries, acceptance criteria, and validation.
3. Set it to `Ready` when it is implementable and its dependencies allow work to begin.
4. Set it to `In progress` before the first implementation edit.
5. Keep the plan and implementation record accurate as work proceeds.
6. Run the required checks and map actual evidence to every acceptance criterion.
7. Set the ticket to `Completed`, move it to the matching archive area, and update this index and affected links in the same change.

Use plain language throughout. Explain unfamiliar terms and spell out an acronym the first time it appears. Keep product decisions in the developer specification and implementation evidence in the owning ticket.

## Retired development identifiers

Retired identifiers cannot be reused. Add a row when a pre-implementation development ticket is converted into a coordination record.

| Retired identifier | Reason |
| --- | --- |
| None | No identifiers have been retired. |

## Current records

| Record | Area | Milestone | Status | Outcome |
| --- | --- | --- | --- | --- |
| [COR0001 — Deliver the restaurant payments MVP](current/organisatory/COR0001-deliver-restaurant-payments-mvp.md) | Organisatory | M0–M4 | In progress | Coordinate the peer tickets that deliver and rehearse the complete Devnet restaurant payment loop. |
| [DEV0003 — Establish payment data and API foundation](current/backend/DEV0003-establish-payment-data-and-api-foundation.md) | Backend | M0 | Draft | Add the merchant/payment schema and the minimal create/fetch service boundary with exact amount handling. |
| [DEV0004 — Build merchant payment request](current/merchant/DEV0004-build-merchant-payment-request.md) | Merchant | M1 | Draft | Let a merchant enter a euro amount, create an intent, and display its payment URL as a QR code. |
| [DEV0005 — Build customer scan and confirmation](current/customer/DEV0005-build-customer-scan-and-confirmation.md) | Customer | M1 | Draft | Scan an application payment URL and show trusted merchant and amount details before payment. |
| [DEV0006 — Provision demo customer wallets](current/blockchain/DEV0006-provision-demo-customer-wallets.md) | Blockchain | M2 | Draft | Create secure Devnet-only customer wallets and documented test EURC and fee funding. |
| [DEV0007 — Send EURC Devnet payment](current/blockchain/DEV0007-send-eurc-devnet-payment.md) | Blockchain | M2 | Draft | Send the exact server-authorized test EURC transfer and return its signature. |
| [DEV0008 — Verify submitted EURC transfers](current/blockchain/DEV0008-verify-submitted-eurc-transfers.md) | Blockchain | M3 | Draft | Verify untrusted signatures and allow only exact successful transfers to confirm payments. |
| [DEV0009 — Present live confirmed payment](current/merchant/DEV0009-present-live-confirmed-payment.md) | Merchant | M3 | Draft | Update both sides from backend-confirmed state, including live merchant paid feedback and customer success. |
| [DEV0010 — Complete payment lifecycle guards](current/backend/DEV0010-complete-payment-lifecycle-guards.md) | Backend | M4 | Draft | Add expiry, cancellation, duplicate protection, retry behavior, and clear terminal-state rules. |
| [DEV0011 — Add payment history and demo recovery](current/customer/DEV0011-add-payment-history-and-demo-recovery.md) | Customer | M4 | Draft | Add customer and merchant history plus plain-language recovery for common demo failures. |
| [DEV0012 — Rehearse and document the demo](current/organisatory/DEV0012-rehearse-and-document-the-demo.md) | Organisatory | M4 | Draft | Prove the complete happy and rejection paths and publish repeatable setup and rehearsal guidance. |

## Archived records

| Record | Area | Milestone | Status | Outcome |
| --- | --- | --- | --- | --- |
| [DEV0015 — Harden Git ignore rules](archive/organisatory/DEV0015-harden-git-ignore-rules.md) | Organisatory | Project maintenance | Completed | Protected the first commit from generated, local, sensitive, and temporary files while keeping project source visible. |
| [DEV0014 — Build the static merchant interface](archive/merchant/DEV0014-build-static-merchant-interface.md) | Merchant | M0–M1 | Completed | Added the fixture-driven dashboard, exact amount entry, QR/waiting, receipt, activity, settings, tests, and responsive visual evidence. |
| [DEV0013 — Reconcile the merchant UI contract](archive/organisatory/DEV0013-reconcile-merchant-ui-contract.md) | Organisatory | M0–M1 | Completed | Aligned the merchant visual specification with the shared state, endpoint, amount, expiry, and document-ownership contracts. |
| [DEV0002 — Scaffold applications and tooling](archive/organisatory/DEV0002-scaffold-applications-and-tooling.md) | Organisatory | M0 | Completed | Added the pnpm workspace, both application shells, shared packages, Devnet configuration boundary, and validation commands. |
| [DEV0001 — Establish project workflow](archive/organisatory/DEV0001-establish-project-workflow.md) | Organisatory | Before M0 | Completed | Added project instructions, milestones, ticket templates, the initial backlog, and the project skill. |
