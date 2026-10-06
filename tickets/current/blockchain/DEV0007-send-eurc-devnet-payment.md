# Ticket DEV0007: Send EURC Devnet payment

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M2 — Devnet EURC transfer
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](../backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0005 — Build customer scan and confirmation](../customer/DEV0005-build-customer-scan-and-confirmation.md), [DEV0006 — Provision demo customer wallets](DEV0006-provision-demo-customer-wallets.md)

## Objective and context

Connect the customer Pay action to the [customer transaction flow](../../../DEVELOPER_SPEC.md#10-customer-transaction-construction) and transfer the exact requested test EURC amount from the local Devnet wallet to the server-authorized merchant.

## Scope and non-goals

In scope:

- Re-fetch or revalidate the payment before construction.
- Build, sign, simulate when appropriate, submit, and track one SPL token transfer using exact integer units.
- Create the merchant associated token account when the adopted flow requires it.
- Return the signature and payer public key to the server submission boundary, with retry-safe customer states.

Out of scope:

- Declaring the payment successful, backend verification, realtime merchant updates, mainnet, fee sponsorship, or smart contracts.

## Expected behavior and edge cases

Pay is disabled while one attempt is active. Wrong network or mint, insufficient test EURC, insufficient Devnet SOL, stale blockhash, user interruption, failed simulation, broadcast uncertainty, and retry do not create duplicate intentional transfers or a false success state. Only server-authorized payment details determine the transfer.

## Assumptions, decisions, and dependencies

- Depends on DEV0003, DEV0005, and DEV0006.
- Use the currently installed Solana client and token-program interfaces after checking their primary documentation.
- Decide and test retry behavior for the uncertain case where broadcast may have succeeded but the client did not receive a signature response.

## Implementation plan

1. Add exact transaction construction behind the Solana package boundary.
2. Add preparation, simulation, signing, submission, and error normalization.
3. Connect the Pay action and backend submission request.
4. Add deterministic tests and a real Devnet transfer rehearsal.

## Acceptance criteria

- [ ] AC1: A valid funded customer sends the exact raw test EURC amount to the expected merchant on Solana Devnet and receives a signature.
- [ ] AC2: The app submits that signature as an untrusted claim and remains waiting rather than showing success.
- [ ] AC3: Wrong configuration, insufficient funds, duplicate taps, simulation failure, and broadcast failure produce safe retry or recovery behavior.

## Validation plan

Test amount conversion, instruction identities, token-account cases, state transitions, duplicate taps, and normalized failures deterministically. Rehearse at least one real Devnet transfer and record pre/post balances, signature, cluster, configured mint source, and observation date without secrets.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

This ticket proves transfer submission, not business confirmation. DEV0008 independently verifies the transfer before paid state is possible.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
