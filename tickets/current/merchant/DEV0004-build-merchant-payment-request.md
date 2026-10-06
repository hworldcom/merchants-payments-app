# Ticket DEV0004: Build merchant payment request

- Status: Draft
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M1 — request and scan
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](../backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0005 — Build customer scan and confirmation](../customer/DEV0005-build-customer-scan-and-confirmation.md)

## Objective and context

Build the [merchant request flow](../../../DEVELOPER_SPEC.md#32-merchant-flow) so a restaurant can enter an amount, create a server-side payment intent, and present its payment URL as a scannable QR code in under five seconds.

## Scope and non-goals

In scope:

- Responsive amount entry, submit behavior, QR display, amount and merchant summary, waiting state, loading, and recoverable create errors.
- Client-side format guidance backed by server validation.
- Accessible focus, labels, keyboard interaction, and mobile/tablet/desktop layout checks.

Out of scope:

- Cancellation, history, backend verification, live paid transition, authentication, or point-of-sale integration.

## Expected behavior and edge cases

Submitting a valid amount creates exactly one payment intent per completed action and displays only its application payment URL in the QR. Repeated clicks, slow responses, invalid amount text, and server errors do not create misleading waiting states or duplicate requests.

## Assumptions, decisions, and dependencies

- Depends on the DEV0003 create contract.
- Adopt locale and input rules in the ticket before implementation; do not let browser floating-point parsing become authoritative.
- The QR library and error-correction level should be chosen based on reliable phone scanning rather than visual decoration.

## Implementation plan

1. Build and test the amount form.
2. Connect it to the create contract with duplicate-submit protection.
3. Render and test the QR and waiting state.
4. Verify responsive, keyboard, loading, and error behavior.

## Acceptance criteria

- [ ] AC1: A merchant can create a valid payment request and see the exact amount and scannable application URL within the target flow.
- [ ] AC2: Invalid input, repeated submission, and create failure cannot display a false active payment.
- [ ] AC3: The flow works with keyboard input and at supported phone, tablet, and desktop widths.

## Validation plan

Add component or browser tests for input, submission, duplicate prevention, QR payload, waiting state, and errors. Verify scanning with a real supported phone once the customer scanner is available.

## Implementation record

Pending implementation.

## Validation results

Not run.

## Risks, limitations, and follow-ups

The waiting screen does not become paid until DEV0009. Cancellation is owned by DEV0010.

## Completion and review references

- Completed: Not completed
- Commit: Not created
- Review: None
- Deployment or release: Not deployed
