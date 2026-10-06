# Ticket DEV0003: Establish payment data and API foundation

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M0 — delivery foundation
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0002 — Scaffold applications and tooling](../../archive/organisatory/DEV0002-scaffold-applications-and-tooling.md), DEV0004, DEV0005, DEV0008

## Objective and context

Implement the [payment-intent architecture](../../../DEVELOPER_SPEC.md#8-payment-intent-architecture), initial database model, and minimal create/fetch service contracts so merchant and customer work share one authoritative payment record.

## Scope and non-goals

In scope:

- Merchant and payment migrations with exact raw token amounts, display amounts, state, expiry, and unique transaction signature.
- Seed or development configuration for one demo merchant.
- Server-side amount parsing and create/fetch interfaces for `PENDING` intents.
- Tests for validation, authorization boundary, amount precision, response shape, and uniqueness constraints.

Out of scope:

- QR presentation, wallet transfer, signature submission and verification, realtime updates, history, or production authentication.

## Expected behavior and edge cases

The merchant create boundary accepts a valid euro-formatted amount, resolves merchant and network details on the server, and returns a unique payment URL. Public fetch returns only the data needed for confirmation. Zero, negative, over-precision, malformed, unknown, and non-payable requests fail without floating-point conversion or leaked secrets.

## Assumptions, decisions, and dependencies

- Depends on DEV0002 workspace and database tooling.
- The ticket must adopt an explicit amount range, expiry default, identifier format, and demo merchant access boundary before implementation.
- Raw amount calculation must use the verified configured mint decimals.

## Implementation plan

1. Define shared payment types and state constraints.
2. Add and test database migrations.
3. Implement create and fetch services or routes.
4. Document data, configuration, migration, and rollback contracts.

## Acceptance criteria

- [ ] AC1: A valid merchant request creates one `PENDING` intent with exact display and raw amounts and returns a stable payment URL.
- [ ] AC2: Fetching a known intent returns trusted merchant, amount, currency, status, and expiry data without private configuration.
- [ ] AC3: Invalid amounts, unknown identifiers, duplicate signatures, and invalid stored states are rejected deterministically.

## Validation plan

Run migration and constraint checks plus focused service or route tests for valid, boundary, malformed, unknown, and concurrent creation cases. Run repository lint, type-check, and relevant builds.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

Demo merchant access must not be presented as production authentication. DEV0010 owns cancellation, expiry, retry, and full terminal-state behavior.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
