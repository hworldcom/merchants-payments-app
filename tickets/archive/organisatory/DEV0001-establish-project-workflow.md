# Ticket DEV0001: Establish project workflow

- Status: Completed
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: Before M0
- Coordination: None — independent development ticket
- Related records: [COR0001 — Deliver the restaurant payments MVP](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md)

## Objective and context

Turn the documentation-only repository into a project that can be delivered through explicit milestones and reviewable development tickets. Adapt the useful workflow boundaries from `fitness-booking-social-app`, document every created artifact, and make plain language a rule for this project and the user's reusable project skills.

This is the workflow bootstrap record. It was completed in the same change that introduced the ticket system because no ticket location or template existed before that change.

## Scope and non-goals

In scope:

- Review the complete README and developer specification.
- Add repository contributor instructions, ticket templates, lifecycle rules, milestones, an initial coordinated backlog, and navigation links.
- Add and validate a reusable `merchants-payments-app` skill.
- Add a plain-language rule to the existing user-owned project skills.

Out of scope:

- Application scaffolding or runtime behavior, package selection, payment implementation, external deployment, or edits to unrelated product requirements.

## Expected behavior and edge cases

Future implementation begins with one current development ticket, records observable acceptance criteria and validation, and leaves a durable implementation trail. Milestones and coordination do not replace implementable tickets. Archived records remain historical. Technical language stays accurate but unfamiliar terms are explained in ordinary words.

## Assumptions, decisions, and dependencies

- The developer specification remains the product contract; its former implementation phases were clarified into M0–M4 without changing the intended MVP.
- Areas reflect this product: customer, merchant, backend, blockchain, and organisatory.
- The initial backlog is planning only. It does not claim that implementation has started or that mutable external details have been verified.
- User-owned project skills under `/Users/hoangdeveloper/.codex/skills` are in scope for the requested language-rule update; bundled system skills are not.

## Implementation plan

1. Compare the source documents with the reference workflow.
2. Add project instructions and work-record templates.
3. Define milestones and create a flat coordination map with peer tickets.
4. Add the project skill and update plain-language guidance in other user-owned project skills.
5. Validate links, ticket consistency, and skill structure.

## Acceptance criteria

- [x] AC1: Repository instructions identify authoritative documents, ticket lifecycle, validation, security, commit, and plain-language rules.
- [x] AC2: M0–M4 have observable outcomes and each deliverable maps to an indexed development ticket.
- [x] AC3: Templates and the initial backlog document scope, non-goals, dependencies, acceptance criteria, validation, and future implementation evidence.
- [x] AC4: The new project skill validates and every user-owned project skill contains a plain-language rule.

## Validation plan

Check Markdown links and ticket membership with a local script, search all custom project skills for their language rules, run the bundled skill validator, and inspect the final file inventory and diff.

## Implementation record

### Changes and rationale

Added a deliberately smaller version of the reference app's workflow: one product contract, ticket-before-implementation, optional flat coordination, stable identifiers, required evidence, and archival history. Converted the existing four phases into five milestone outcomes so repository foundation is visible before the first user flow. Created a coordinated backlog rather than treating milestone prose as an implementation plan.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| [`AGENTS.md`](../../../AGENTS.md) | Authoritative contributor, ticket, validation, security, commit, and writing rules. |
| [`README.md`](../../../README.md) | Project navigation and workflow entry point. |
| [`DEVELOPER_SPEC.md`](../../../DEVELOPER_SPEC.md) | M0–M4 outcomes, exit checks, and owning-ticket links. |
| [`tickets/README.md`](../../README.md) | Record guide, identifier register, and current/archive index. |
| [`tickets/TEMPLATE.md`](../../TEMPLATE.md) | Development-ticket planning and evidence fields. |
| [`tickets/COORDINATION_TEMPLATE.md`](../../COORDINATION_TEMPLATE.md) | Flat peer-ticket coordination template. |
| [`COR0001`](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md) | Complete MVP work map and delivery order. |
| `tickets/current/**/DEV0002–DEV0012` | Initial milestone backlog. |
| `/Users/hoangdeveloper/.codex/skills/merchants-payments-app/` | Reusable project routing, workflow, guardrails, and interface metadata. |
| Other `/Users/hoangdeveloper/.codex/skills/*/SKILL.md` project skills | Consistent plain-language guidance. |

No runtime application, database, external service, secret, or deployment contract changed.

### Decisions and deviations

- 2026-10-06: Used five product-specific areas rather than the reference repository's four because customer mobile and merchant web work have different platforms and validation needs.
- 2026-10-06: Kept automatic skill discovery enabled and added no extra scripts or references because the repository itself already contains the required source documents.
- The bundled skill initializer lacked executable permission, so it was run with Python directly; output was otherwise unchanged.

## Validation results

- Date and environment: 2026-10-06, local macOS workspace.
- Markdown link and work-map consistency: Passed by local validation script.
- Skill structure: Passed with the bundled `quick_validate.py` checker.
- Plain-language skill audit: Passed for all five user-owned project skills.
- Application tests: Not applicable; this ticket changes only documentation and reusable skill instructions.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | Required sections and links present in `AGENTS.md` | Passed |
| AC2 | Milestone links resolve and DEV0002–DEV0012 appear in the index and COR0001 work map | Passed |
| AC3 | Both templates and all backlog records contain the required planning and evidence headings | Passed |
| AC4 | Skill validator and custom-skill language audit | Passed |

## Risks, limitations, and follow-ups

- The backlog contains planning assumptions that each owning ticket must verify before implementation, especially mutable Solana, Circle, Expo, Supabase, and Next.js details.
- Empty archive area directories will be created when their first record is archived; only the current bootstrap archive path is needed now.

## Completion and review references

- Completed: 2026-10-06 — workflow, milestones, initial backlog, and skill guidance established
- Commit: Shared initial repository commit — `[DEV0014] Add merchant payments application foundation`
- Review: Self-review only
- Deployment or release: Not applicable
