# Ticket DEV0008: Verify submitted EURC transfers

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M3 — verified paid state
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](../backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0007 — Send EURC Devnet payment](DEV0007-send-eurc-devnet-payment.md), DEV0009

## Objective and context

Implement the [backend transaction verification](../../../DEVELOPER_SPEC.md#12-backend-transaction-verification) that is the only authority allowed to move a payment to `CONFIRMED`.

## Scope and non-goals

In scope:

- Accept a signature and payer public key as untrusted input and move an eligible intent to `SUBMITTED`.
- Fetch and inspect the transaction at the adopted confirmation level.
- Verify cluster, success, mint, exact raw amount, recipient ownership, payer relationship where practical, signature uniqueness, intent timing, and current state.
- Record normalized failure reasons and make retry/concurrency behavior deterministic.

Out of scope:

- Customer transaction construction, merchant presentation, production finality policy, refunds, or transaction discovery without a submitted signature.

## Expected behavior and edge cases

Only one exact successful transfer confirms one eligible payment. Wrong amount, recipient, token, network, failed or missing transaction, reused signature, expired or cancelled request, concurrent submissions, delayed confirmation, and temporary remote procedure call failure must remain fail-closed.

## Assumptions, decisions, and dependencies

- Depends on DEV0003 data constraints and DEV0007 transaction shape.
- Adopt a bounded retry and timeout policy and distinguish retryable infrastructure failure from permanent mismatch.
- Verification parsing must cover the actual transaction version and token-account forms emitted by DEV0007.

## Implementation plan

1. Define the submission, verification, and failure contracts.
2. Implement transaction fetch and exact transfer inspection.
3. Make state changes and signature binding atomic.
4. Add fixtures, adversarial tests, concurrency tests, and a dated Devnet proof.

## Acceptance criteria

- [ ] AC1: An exact successful Devnet transfer moves one eligible payment through `SUBMITTED` to `CONFIRMED` once.
- [ ] AC2: Every P0 wrong amount, recipient, token, failed transaction, duplicate signature, and terminal-state case remains not confirmed.
- [ ] AC3: Concurrent submissions and temporary provider failure cannot create double confirmation or a false paid state and have documented retry behavior.

## Validation plan

Run deterministic fixture and service tests for valid and adversarial transactions, database uniqueness and concurrency checks, and a real Devnet verification against DEV0007 output. Record exact commands and evidence for every P0 scenario.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Devnet provider availability can delay confirmation. The user experience must describe delay without weakening verification.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
