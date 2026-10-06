# Ticket DEV0009: Present live confirmed payment

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M3 — verified paid state
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: DEV0004, DEV0005, [DEV0008 — Verify submitted EURC transfers](../blockchain/DEV0008-verify-submitted-eurc-transfers.md)

## Objective and context

Complete the [verified customer and merchant feedback loop](../../../DEVELOPER_SPEC.md#16-realtime-merchant-update): the merchant changes from waiting to paid without refreshing, and the customer sees success only after the backend reports `CONFIRMED`.

## Scope and non-goals

In scope:

- Subscribe or poll for authoritative payment state with cleanup, reconnect, and fallback behavior.
- Present merchant waiting, submitted, confirmed, failed, expired, and cancelled states in plain language.
- Present customer processing, confirmed success, and safe non-success states; refresh the displayed balance after confirmation.
- Add a New Payment transition that does not overwrite the completed record.

Out of scope:

- Transaction verification, payment histories, cancellation controls, production receipts, or notifications outside the open apps.

## Expected behavior and edge cases

`PENDING` and `SUBMITTED` remain waiting; only `CONFIRMED` becomes paid. Missed realtime messages, reconnect, tab backgrounding, out-of-order updates, refresh, or a delayed backend response converge on the persisted state. A failure never briefly renders paid.

## Assumptions, decisions, and dependencies

- Depends on DEV0004, DEV0005, and DEV0008.
- Choose Supabase Realtime or polling based on the simplest reliable observed behavior and record the reason.
- Customer and merchant copy must avoid blockchain jargon and explain the next useful action.

## Implementation plan

1. Add a shared status-read boundary and live update strategy.
2. Implement merchant state transitions and New Payment behavior.
3. Implement customer processing, confirmed success, and balance refresh.
4. Test reconnect, refresh, ordering, responsiveness, and accessibility.

## Acceptance criteria

- [ ] AC1: After backend confirmation, the merchant automatically shows the correct paid amount without manual refresh.
- [ ] AC2: The customer shows success and refreshed balance only after backend confirmation.
- [ ] AC3: Delayed, missed, repeated, or out-of-order updates and every non-confirmed terminal state never show a false paid result.

## Validation plan

Add state-machine, subscription or polling, component, and browser tests. Rehearse the full Devnet flow with both apps visible and measure Pay-to-paid latency. Verify phone, tablet, desktop, keyboard, and reconnect behavior.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Realtime is an implementation choice, not a milestone requirement. Reliable polling is acceptable if it meets the latency and recovery criteria.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
