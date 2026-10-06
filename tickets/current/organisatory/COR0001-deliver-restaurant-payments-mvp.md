# Coordination COR0001: Deliver the restaurant payments MVP

- Status: In progress
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M0–M4
- Converted from: Not applicable — created as coordination
- Tracked development tickets: DEV0002–DEV0014
- Related records: [DEV0001 — Establish project workflow](../../archive/organisatory/DEV0001-establish-project-workflow.md)

## Objective and boundaries

Coordinate the peer development tickets that turn the current specification into a repeatable 20–30 second restaurant payment demonstration using test EURC on Solana Devnet. This record owns sequencing, shared boundaries, and final integration checks. It does not implement runtime behavior; each concrete change and its evidence belong to one development ticket.

The product boundary remains the [developer specification](../../../DEVELOPER_SPEC.md): one merchant web app, one iOS-focused customer app, server-side payment intents, direct test EURC transfers, backend verification, and no real funds, mainnet, production custody, smart contract, or fiat settlement.

## Direct development work

| Implementation part | Development ticket | Owned result | Start condition or dependency |
| --- | --- | --- | --- |
| Application and tooling foundation | [DEV0002](../../archive/organisatory/DEV0002-scaffold-applications-and-tooling.md) | Runnable monorepo, app shells, shared packages, configuration checks, and validation commands | Completed |
| Merchant UI contract | [DEV0013](../../archive/organisatory/DEV0013-reconcile-merchant-ui-contract.md) | Reconciled visual, state, endpoint, amount, and expiry terminology | Completed before UI implementation |
| Static merchant interface | [DEV0014](../../archive/merchant/DEV0014-build-static-merchant-interface.md) | Fixture-driven dashboard, amount, waiting, receipt, payments, and settings surfaces | Completed; DEV0004 and DEV0009 replace fixtures with authoritative API and confirmed state behavior |
| Payment data and service foundation | [DEV0003](../backend/DEV0003-establish-payment-data-and-api-foundation.md) | Merchant/payment schema plus exact create/fetch contracts | Begins after DEV0002 supplies the workspace and database tooling |
| Merchant request experience | [DEV0004](../merchant/DEV0004-build-merchant-payment-request.md) | Amount entry, intent creation, QR display, and waiting state | Requires DEV0003 create contract |
| Customer scan and confirmation | [DEV0005](../customer/DEV0005-build-customer-scan-and-confirmation.md) | QR parsing, trusted fetch, and payable or blocked confirmation states | Requires DEV0003 fetch contract; can proceed beside DEV0004 |
| Demo customer wallet and funding | [DEV0006](../blockchain/DEV0006-provision-demo-customer-wallets.md) | Devnet-only local wallet plus test EURC and fee funding | Requires DEV0002 customer app and verified current Devnet configuration |
| Test EURC payment | [DEV0007](../blockchain/DEV0007-send-eurc-devnet-payment.md) | Exact customer-to-merchant transfer and signature submission boundary | Requires DEV0003, DEV0005, and DEV0006 |
| Backend transaction verification | [DEV0008](../blockchain/DEV0008-verify-submitted-eurc-transfers.md) | Fail-closed transaction inspection and confirmed state transition | Requires DEV0003 and the transaction shape from DEV0007 |
| Live confirmed experience | [DEV0009](../merchant/DEV0009-present-live-confirmed-payment.md) | Automatic merchant paid state and backend-confirmed customer success | Requires DEV0004, DEV0005, and DEV0008 |
| Lifecycle guards | [DEV0010](../backend/DEV0010-complete-payment-lifecycle-guards.md) | Expiry, cancellation, duplicate protection, retries, and terminal-state rules | Requires DEV0003 and DEV0008 |
| Histories and demo recovery | [DEV0011](../customer/DEV0011-add-payment-history-and-demo-recovery.md) | Merchant/customer history and plain-language recovery states | Requires DEV0009 and DEV0010 |
| Full rehearsal and operating guide | [DEV0012](DEV0012-rehearse-and-document-the-demo.md) | Reproducible setup, measured happy path, rejection evidence, and limitations | Requires DEV0002–DEV0011 to be complete |

## Other relationships

- Circle's faucet, test EURC mint, and Solana Devnet are external dependencies whose current details must be verified by the tickets that use them.
- Future mainnet custody, regulated funding, bank settlement, refunds, point-of-sale integration, and App Store release are downstream work, not members of this coordination record.

## Delivery sequence and completion conditions

1. Reconcile the merchant UI contract through DEV0013 while DEV0002 establishes the workspace.
2. Complete M0 through DEV0002 and DEV0003. DEV0014 may build the fixture-driven merchant experience after DEV0013 and the merchant shell are ready.
3. Complete M1 through DEV0004 and DEV0005; these may proceed in parallel after the shared service contract is stable. DEV0004 replaces DEV0014 fixtures with authoritative payment-intent behavior rather than rebuilding the visual foundation.
4. Complete M2 through DEV0006 and DEV0007.
5. Complete M3 through DEV0008 and DEV0009.
6. Complete M4 guards and presentation through DEV0010 and DEV0011, then run DEV0012.

This coordination record completes only when every direct ticket is completed or explicitly cancelled with a reviewed replacement, the full happy path succeeds repeatedly on Devnet, every P0 rejection scenario remains fail-closed, and the operating guide is sufficient for a new developer to rehearse the demo.

## Progress and integration record

- 2026-10-06: Initial work map created from the existing README and developer specification. No application implementation has started.
- 2026-10-06: The user supplied a detailed merchant UI specification and authorized implementation. DEV0013 owns contract reconciliation, DEV0002 owns the runnable workspace, and DEV0014 owns the fixture-driven visual foundation.
- 2026-10-06: DEV0014 completed the fixture-driven merchant interface and responsive browser review. Live payment creation and confirmation remain with DEV0004 and DEV0009.

## Validation results

- 2026-10-06: The initial work map assigns each M0–M4 deliverable to one direct development ticket and every direct ticket links back to this record.
- Final integration validation: Not run; product implementation has not started.

## Risks, limitations, and follow-ups

- External Devnet services and test-token details can change. The owning tickets must record the source and observation date rather than copying mutable values into this record.
- The estimated schedule in the specification is directional. Ticket evidence, not elapsed calendar time, determines milestone completion.

## Completion and review references

- Completed: Not completed
- Direct development tickets: DEV0002, DEV0013, and DEV0014 are Completed; DEV0003–DEV0012 are Draft
- Commit: Not applicable — coordination identifiers are not used in commit subjects
- Review: Self-review only
- Deployment or release: Not deployed
