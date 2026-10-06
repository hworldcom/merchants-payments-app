# Ticket DEV0010: Complete payment lifecycle guards

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M4 — repeatable restaurant demo
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](DEV0003-establish-payment-data-and-api-foundation.md), [DEV0008 — Verify submitted EURC transfers](../blockchain/DEV0008-verify-submitted-eurc-transfers.md), DEV0011

## Objective and context

Complete the [payment lifecycle](../../../DEVELOPER_SPEC.md#9-payment-lifecycle) so expiry, merchant cancellation, duplicate scans, retries, and terminal states behave consistently across the service and both applications.

## Scope and non-goals

In scope:

- Adopt and enforce an expiry policy and server-authoritative time handling.
- Add merchant cancellation for eligible pending requests.
- Make create, submit, verify, expire, and cancel transitions concurrency-safe and retry-aware.
- Return stable error codes with plain-language presentation guidance.

Out of scope:

- Refunds, chargebacks, production settlement, payment references, or automatic discovery of unsubmitted transfers.

## Expected behavior and edge cases

Terminal states cannot move backward or accept a second transfer. Cancellation and expiry racing with submission or verification resolve through explicit atomic rules. Repeated create or submit requests do not create unintended business results, and temporary failures can be retried without weakening validation.

## Assumptions, decisions, and dependencies

- Depends on the data model from DEV0003 and verification transitions from DEV0008.
- Adopt the exact expiry trigger, cancellation-versus-submission precedence, and idempotency key behavior before implementation.
- Client clocks are informative only; server time is authoritative.

## Implementation plan

1. Finalize the transition table and stable error contract.
2. Implement expiry and cancellation atomically.
3. Add idempotency, concurrency, and retry handling.
4. Update both clients' blocked-state mapping and documentation.

## Acceptance criteria

- [ ] AC1: Eligible pending payments expire or cancel according to the adopted policy and cannot later confirm through a new submission.
- [ ] AC2: Confirmed, failed, expired, and cancelled intents cannot create another transfer through the supported client flow.
- [ ] AC3: Concurrent and repeated lifecycle requests resolve deterministically without duplicate confirmation or false paid state.

## Validation plan

Run transition-table, time-boundary, idempotency, database concurrency, service, and client error-mapping tests. Exercise expiry and cancellation in the integrated local flow and relevant Devnet boundary.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Automatic chain reconciliation without signature submission remains P1 unless separately ticketed.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
