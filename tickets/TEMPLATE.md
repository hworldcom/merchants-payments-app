# Ticket DEVNNNN: Short outcome-oriented title

Copy this file to `tickets/current/<area>/DEVNNNN-short-title.md`. Use the next unused identifier after checking [the work index](README.md), current records, archived records, and retired identifiers. Read [AGENTS.md](../AGENTS.md) before drafting.

- Status: Draft
- Created: YYYY-MM-DD
- Last updated: YYYY-MM-DD
- Milestone: M0–M4 or project maintenance
- Coordination: One repository-relative `CORNNNN — Title` link, or `None — independent development ticket`
- Related records: Dependencies, follow-ups, and historical context, or None

## Objective and context

Explain the current problem, desired outcome, affected user or system, and why the change matters. Link the relevant sections of [DEVELOPER_SPEC.md](../DEVELOPER_SPEC.md) and write for someone who has not seen the conversation.

## Scope and non-goals

In scope:

- Concrete behavior or deliverable owned by this ticket.

Out of scope:

- Closely related behavior intentionally excluded.

## Expected behavior and edge cases

Describe the normal flow and observable result. Include relevant permissions, trust boundaries, preconditions, state transitions, validation, exact amount handling, duplicate requests, timeout, retry, recovery, and responsive or accessibility states. For a bug, record reproduction steps, the actual result, expected result, and planned regression test.

## Assumptions, decisions, and dependencies

Record adopted choices with reasons, assumptions that need verification, ready or blocked dependencies, and unresolved questions. Separate confirmed requirements from suggested defaults.

## Implementation plan

List small implementation steps, likely files or components, changed interfaces, data or configuration changes, migration and rollback needs, observability, and documentation updates. Update this plan before materially changing scope or approach.

## Acceptance criteria

- [ ] AC1: Given a clear starting state, when an action occurs, then an observable result follows.
- [ ] AC2: A relevant boundary or failure case produces the required safe result.

## Validation plan

Map every criterion to a concrete automated or manual check. Include focused tests, relevant existing suites, lint, type checks, builds, device or viewport checks, and Devnet rehearsal where applicable. Explain why a check does not apply.

| Criterion | Planned evidence | Environment or command |
| --- | --- | --- |
| AC1 | Test or observation | Command or prerequisite |
| AC2 | Boundary or failure check | Command or prerequisite |

## Implementation record

Pending until implementation starts. Keep planned intent separate from actual evidence.

### Changes and rationale

Describe the before and after behavior, chosen approach, and why it satisfies the objective.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| Repository-relative link | What changed here and why |

Record interface, schema, event, configuration, dependency, compatibility, setup, migration, operations, and rollback effects. State explicitly when none apply. Never include secrets.

### Decisions and deviations

Record dated decisions and material departures from the original plan, including reasons and resulting scope changes. State explicitly if there were none.

## Validation results

Record actual evidence, not planned or assumed success.

- Date and environment:
- Exact commands and outcomes, including relevant counts:
- Manual or live steps and observed outcomes:
- Failed, blocked, skipped, or unrun checks and reasons:

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | Command output or observation | Not run |
| AC2 | Command output or observation | Not run |

## Risks, limitations, and follow-ups

Record known limitations, unresolved issues, and linked follow-up tickets. Unmet acceptance criteria stay in this ticket and prevent completion.

## Completion and review references

- Completed: Date and summary, or Not completed
- Commit: Reference and `[DEVNNNN] ...` subject, or Not created
- Review: Pull request or independent review reference, or self-review only
- Deployment or release: Actual environment and evidence, or Not deployed / Not applicable
