# Ticket DEV0005: Build customer scan and confirmation

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M1 — request and scan
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](../backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0004 — Build merchant payment request](../merchant/DEV0004-build-merchant-payment-request.md)

## Objective and context

Build the [customer scan and confirmation flow](../../../DEVELOPER_SPEC.md#31-customer-flow) so the app accepts only application payment URLs, fetches authoritative details from the backend, and shows the merchant and euro amount before any transfer is possible.

## Scope and non-goals

In scope:

- Camera permission, scanner, payment URL parsing, payment fetch, confirmation, cancel, loading, and blocked states.
- Plain-language behavior for denied camera access, malformed or foreign QR codes, unknown requests, and non-`PENDING` status.
- Accessible controls and iOS-focused device checks.

Out of scope:

- Wallet creation, balance, transaction construction, test-token transfer, or success before backend verification.

## Expected behavior and edge cases

The scanner extracts only the payment identifier from an allowed application URL. It never trusts a QR-provided wallet, token, merchant name, or amount. The Pay control appears only for a fresh `PENDING` intent, and repeated camera detections cannot stack duplicate navigation or requests.

## Assumptions, decisions, and dependencies

- Depends on DEV0002 customer shell and DEV0003 fetch contract.
- The supported URL host and development override must be explicit configuration.
- Deep or universal links are later work unless required to make the in-app scanner function.

## Implementation plan

1. Add camera permission and scan states.
2. Validate the URL and fetch payment details.
3. Present confirmation and safe blocked states.
4. Add automated presentation tests and real-device scan evidence.

## Acceptance criteria

- [ ] AC1: Scanning a valid active request shows the exact backend-provided merchant and amount with a Pay action.
- [ ] AC2: Malformed, foreign, unknown, expired, cancelled, failed, or confirmed requests cannot reach a payable state.
- [ ] AC3: Denied permission and repeated scan events produce clear, recoverable behavior.

## Validation plan

Run parser and presentation tests for every accepted and rejected status, camera-permission scenarios, and duplicate detections. Verify a real QR scan on a supported iOS device or document a concrete environment blocker.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

The Pay action remains inert until DEV0007. Final success remains blocked until DEV0009 receives backend-confirmed state.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
