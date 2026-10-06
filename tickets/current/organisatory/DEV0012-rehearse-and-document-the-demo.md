# Ticket DEV0012: Rehearse and document the demo

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M4 — repeatable restaurant demo
- Coordination: [COR0001 — Deliver the restaurant payments MVP](COR0001-deliver-restaurant-payments-mvp.md)
- Related records: DEV0002–DEV0011

## Objective and context

Prove the [definition of a working MVP](../../../README.md#definition-of-working-mvp) and [P0 acceptance scenarios](../../../DEVELOPER_SPEC.md#25-p0-acceptance-tests), then document a repeatable setup and demonstration run for a developer who has not seen the conversation.

## Scope and non-goals

In scope:

- Consolidate verified install, configuration, database, merchant, customer, funding, and reset instructions.
- Rehearse the happy path repeatedly with real test EURC on Devnet and measure the two documented latency metrics.
- Rehearse wrong amount, recipient, token, failed transaction, duplicate signature, completed rescan, and expired request rejection.
- Record device, browser, viewport, environment, external dependency, limitation, and recovery evidence.

Out of scope:

- Adding missing product behavior under this documentation ticket, production load or security certification, mainnet, App Store release, or restaurant pilot operations.

## Expected behavior and edge cases

A new developer can follow the guide without undocumented secrets or tribal knowledge. The happy path takes roughly 20–30 seconds under documented conditions, and no rejection scenario produces a false success state. External service instability is reported honestly rather than hidden by weaker checks.

## Assumptions, decisions, and dependencies

- Begins only after DEV0002–DEV0011 meet their own acceptance criteria.
- Use clearly identified test wallets and valueless Devnet assets; never record secret key material.
- Any missing behavior discovered during rehearsal gets a new linked development ticket and keeps this ticket open.

## Implementation plan

1. Audit existing setup and operating documentation against the completed implementation.
2. Run deterministic repository validation from a clean state.
3. Run and measure repeated real-device Devnet happy paths.
4. Run every P0 rejection scenario and document results, limitations, and recovery.

## Acceptance criteria

- [ ] AC1: A new developer can set up, fund, start, reset, and rehearse the demo from checked-in documentation.
- [ ] AC2: The full merchant-to-customer-to-merchant happy path succeeds repeatedly with recorded timing and exact environment evidence.
- [ ] AC3: Every P0 rejection scenario is exercised and never produces a false paid state.
- [ ] AC4: Known limitations, unrun checks, and external dependencies are stated in plain language.

## Validation plan

Run every documented command from a clean state, record relevant test counts, and use a checklist for the happy path and each rejection scenario. Capture non-secret transaction identifiers and timestamps when useful for reproducibility.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Devnet and faucet availability are external. A temporary outage blocks live evidence but must not be bypassed with a simulated claim of completion.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
