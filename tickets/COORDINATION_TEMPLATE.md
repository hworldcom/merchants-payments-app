# Coordination CORNNNN: Short title

Use this template only for a non-implementation record that coordinates peer development tickets. It does not authorize implementation, own detailed implementation evidence, or supply a commit identifier.

- Status: Draft
- Created: YYYY-MM-DD
- Last updated: YYYY-MM-DD
- Milestone: Applicable milestone or cross-cutting initiative
- Converted from: Retired `DEVNNNN`, or `Not applicable — created as coordination`
- Tracked development tickets: Direct implementation tickets or explicitly named missing tickets
- Related records: Dependencies, downstream consumers, follow-ups, or None

## Objective and boundaries

Describe the shared outcome and boundaries. State that concrete implementation remains owned by the mapped development tickets.

## Direct development work

Map every required implementation part to exactly one peer ticket. Every listed ticket must link back to this coordination record.

| Implementation part | Development ticket | Owned result | Start condition or dependency |
| --- | --- | --- | --- |
| Concrete part | Repository-relative `DEVNNNN — Title` link | Exact boundary | When work can start |

Identify required tickets that do not exist. Do not implement their work under this record.

## Other relationships

List external dependencies, downstream consumers, follow-ups, and historical baselines separately from direct membership.

## Delivery sequence and completion conditions

State ordering, independent branches, blockers, integration points, and observable conditions for completion. Include the required final state of every direct ticket.

## Progress and integration record

Keep concise cross-ticket status, decisions, deviations, and integration results here. Link to development tickets for implementation details.

## Validation results

Record checks of the work map, links, shared boundaries, status, and final integration. These checks do not replace ticket-level tests.

## Risks, limitations, and follow-ups

Record cross-ticket risks and unresolved coordination questions in plain language.

## Completion and review references

- Completed: Date and coordinated outcome, or Not completed
- Direct development tickets: Final statuses and links
- Commit: Not applicable — coordination identifiers are not used in commit subjects
- Review: Integration review or pull-request reference when available
- Deployment or release: Actual coordinated status, if applicable
