# Ticket DEV0011: Add payment history and demo recovery

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M4 — repeatable restaurant demo
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: DEV0009, [DEV0010 — Complete payment lifecycle guards](../backend/DEV0010-complete-payment-lifecycle-guards.md), DEV0012

## Objective and context

Add the [merchant and customer histories](../../../DEVELOPER_SPEC.md#18-merchant-payment-history) and the plain-language recovery states needed to make the prototype feel operational during repeated restaurant demonstrations.

## Scope and non-goals

In scope:

- Merchant daily received total, count, and recent confirmed payments.
- Customer recent confirmed payments stored or queried through an explicitly adopted privacy boundary.
- Empty, loading, partial, and failed history states.
- Recovery actions for insufficient demo balance, insufficient fee funds, expired or completed request, transfer failure, and verification delay or failure.

Out of scope:

- Accounting exports, receipts, refunds, searchable history, blockchain explorer as primary navigation, or production-grade customer identity.

## Expected behavior and edge cases

History shows accurate confirmed records and does not count pending or failed payments as received. Duplicate refresh, timezone/day boundaries, empty results, partial service failure, and local customer data reset have explicit behavior. Recovery copy says what happened and what the user or demo operator can do next without SOL or token-program jargon.

## Assumptions, decisions, and dependencies

- Depends on DEV0009 and DEV0010 stable states.
- Adopt the customer-history storage or lookup boundary before implementation and record its privacy tradeoff.
- The merchant day's timezone must be explicit rather than inferred from the server process.

## Implementation plan

1. Define history query, ordering, timezone, and privacy contracts.
2. Implement merchant totals and recent list.
3. Implement customer recent list.
4. Add recovery copy and actions, then verify responsive and failure states.

## Acceptance criteria

- [ ] AC1: Merchant history totals and rows reflect only the correct confirmed payments for the adopted merchant day.
- [ ] AC2: Customer history shows the correct merchant, amount, and time for that demo wallet without exposing blockchain details in the main list.
- [ ] AC3: Every required demo failure has a clear next action and cannot be mistaken for success.

## Validation plan

Add query, timezone, ordering, privacy-boundary, presentation, empty, and error-state tests. Verify histories after repeated integrated payments and inspect all required recovery copy on supported sizes.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Customer history without production identity is a demo-only design and must be described honestly in the implementation record.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
