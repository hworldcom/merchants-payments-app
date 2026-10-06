# Ticket DEV0006: Provision demo customer wallets

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M2 — Devnet EURC transfer
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0002 — Scaffold applications and tooling](../../archive/organisatory/DEV0002-scaffold-applications-and-tooling.md), [DEV0007 — Send EURC Devnet payment](DEV0007-send-eurc-devnet-payment.md)

## Objective and context

Implement the [Devnet wallet and demo-funding boundary](../../../DEVELOPER_SPEC.md#5-devnet-wallet-design) needed for a controlled customer demonstration without presenting seed phrases, SOL, or faucet mechanics to restaurant users.

## Scope and non-goals

In scope:

- Generate one local Solana Devnet keypair per app installation and store it using the selected secure device-storage facility.
- Restore the same public address after restart and expose only a narrow wallet service to payment code.
- Provide a protected development-only path or command to fund test EURC and enough Devnet SOL for fees.
- Show the customer test EURC balance as euros and document reset and recovery behavior.

Out of scope:

- Mainnet, production custody, backup or seed phrase user interface, social login, regulated funding, or sponsored transactions.

## Expected behavior and edge cases

First launch creates and stores a wallet once; later launches reuse it. Storage failure, corrupt material, unsupported platform behavior, funding replay, rate limits, and wrong-network configuration fail clearly without printing secret key material. Funding cannot run in a production or non-Devnet environment.

## Assumptions, decisions, and dependencies

- Depends on DEV0002 and current primary documentation for Expo secure storage and the installed Solana client.
- Verify the current Circle test EURC mint, decimals, faucet behavior, and Devnet remote procedure call behavior when implementation starts; record source and date.
- Choose admin command versus protected endpoint before implementation and document its authorization boundary.

## Implementation plan

1. Define and test the wallet service boundary.
2. Implement secure generation and restoration.
3. Add balance retrieval and test-only funding.
4. Document safe setup, reset, limits, and validation evidence.

## Acceptance criteria

- [ ] AC1: A fresh supported installation creates one Devnet wallet and restores the same address after restart without exposing the secret.
- [ ] AC2: Demo tooling funds the intended wallet with verified test EURC and sufficient Devnet SOL while rejecting non-Devnet use.
- [ ] AC3: The customer sees a euro-denominated demo balance and plain-language recovery for storage or funding failure.

## Validation plan

Add deterministic wallet-service and configuration tests, exercise secure-store create/restore/failure paths, and perform a dated Devnet funding and balance check. Inspect logs and output for secret leakage.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

This key model is acceptable only for valueless Devnet tokens and must not be reused for mainnet without a separate security design.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
