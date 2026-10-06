# Contributor instructions for Restaurant EURC Payments

## Project sources

- Read [README.md](README.md) for the product summary and repository navigation.
- Treat [DEVELOPER_SPEC.md](DEVELOPER_SPEC.md) as the current product and engineering contract. It owns scope, user flows, architecture, security boundaries, delivery milestones, and acceptance scenarios.
- Treat [MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md](MERCHANT_APP_UI_IMPLEMENTATION_SPEC.md) as the merchant-interface contract. It owns visual design, copy, component guidance, responsive behavior, accessibility, and merchant screen states. When it touches shared payment behavior, it must use the terms and safety boundaries in `DEVELOPER_SPEC.md`.
- Treat [tickets/README.md](tickets/README.md) as the work index. Tickets record planned changes and implementation evidence; they do not replace the developer specification.
- Keep confirmed requirements separate from suggested defaults. A suggestion in the specification must be adopted in a ticket before code depends on it.
- Update the developer specification in the same change when a ticket changes product behavior, architecture, security boundaries, or milestone scope. Keep README focused on orientation and setup rather than duplicating the specification.

## Ticket before implementation

- Create a development ticket under `tickets/current/<area>/` before the first implementation edit. This applies to scaffolding, features, fixes, refactors, dependencies, configuration, migrations, tests, and documentation.
- Read-only investigation may happen before a ticket. The workflow bootstrap is recorded retrospectively in [DEV0001](tickets/archive/organisatory/DEV0001-establish-project-workflow.md) because the ticket system did not yet exist.
- Use `DEVNNNN-short-title.md` and the heading `# Ticket DEVNNNN: Short title` for an implementable task. Start from [tickets/TEMPLATE.md](tickets/TEMPLATE.md).
- Use `CORNNNN-short-title.md` and the heading `# Coordination CORNNNN: Short title` only when several peer development tickets need a shared work map. Start from [tickets/COORDINATION_TEMPLATE.md](tickets/COORDINATION_TEMPLATE.md). A coordination record does not authorize implementation and is not a commit identifier.
- A development ticket owns one small, reviewable result and its validation evidence. Choose one primary area: `customer`, `merchant`, `backend`, `blockchain`, or `organisatory`.
- Give every development ticket either one direct coordination link or `None — independent development ticket`. Dependencies and follow-ups belong under related records, not coordination membership.
- Keep the hierarchy flat: coordination record to peer development tickets. Do not create child-of-child ticket trees.
- Allocate the next unused identifier after checking current records, archived records, and the retired-identifier table in [tickets/README.md](tickets/README.md). Never renumber or reuse an identifier.
- Before implementation, write the objective, scope, non-goals, expected behavior, edge cases, decisions, dependencies, implementation plan, acceptance criteria, and validation plan.
- Mark the ticket `In progress` when implementation starts. Update its plan before materially changing the approach or behavior, and create a linked ticket for unrelated work.

## Ticket lifecycle

| Status | Meaning |
| --- | --- |
| Draft | Planning is incomplete and implementation has not started. |
| Ready | Scope and validation are clear, dependencies permit starting, and the work is authorized by the user's request. |
| In progress | Implementation or required validation is underway. |
| Blocked | A concrete dependency, decision, or environment problem prevents progress. |
| Completed | Acceptance criteria and required validation passed, and the implementation record is complete. |
| Cancelled | Work will not proceed; the reason and any replacement are recorded. |

- Keep status and `Last updated` accurate. If work pauses, record what exists, what was checked, what remains, the blocker, and the next action.
- Move completed or cancelled records to the matching `tickets/archive/<area>/` directory and update all affected index links in the same change.
- Preserve archived records as history. Later changes use a new linked ticket rather than rewriting completed evidence.

## Planning and implementation

- Plan first, implement second, and review against the acceptance criteria last. A clear implementation request authorizes the ticket and the scoped work; the ticket is not an extra approval gate.
- Keep changes focused on the active ticket and preserve unrelated user work.
- Prefer a small end-to-end slice when it produces independently observable behavior. Record dependencies when a slice cannot stand alone.
- Inspect installed package versions and current primary documentation before integrating mutable frameworks or external services. This especially applies to Expo, Solana client libraries, Circle test EURC details, Supabase, and Next.js.
- Use the available Solana development skill for wallet, transaction, token, remote procedure call, or Devnet work. Never infer current addresses, package interfaces, or network behavior from memory when they can be verified.

## Required implementation record

Keep the development ticket current so a developer who has not seen the conversation can understand:

- what changed and the resulting behavior;
- where it changed and the purpose of the important files;
- why the approach was chosen, including meaningful tradeoffs or deviations;
- which interfaces, data shapes, dependencies, environment variables, migrations, or operating steps changed;
- how each acceptance criterion was verified, with exact commands and observed results;
- what remains, including known risks, limitations, and linked follow-ups.

Do not use vague evidence such as “implemented,” “fixed,” or “tests pass.” Distinguish planned checks from actual results and passed checks from failed, blocked, or unrun checks.

## Product and security boundaries

- This MVP uses Circle test EURC on Solana Devnet. It must not move real money or silently connect to mainnet.
- Show restaurant users euros, merchant names, payment state, and clear recovery messages. Keep token addresses, transaction signatures, network fees, and blockchain terminology out of the primary experience.
- The payment intent stored by the backend is authoritative for the merchant, recipient, amount, token, network, status, and expiry. The QR code and customer app are untrusted inputs.
- Only the backend may mark a payment `CONFIRMED`, and only after it verifies the exact successful on-chain transfer. A client claim, submitted signature, or optimistic interface must never produce a false paid state.
- Store monetary and token amounts without floating-point loss. Validate network, mint, raw amount, recipient ownership, signature uniqueness, and terminal payment state.
- Treat local private keys and funding tools as Devnet-only. Never put private keys, seed phrases, service credentials, or unredacted secrets in source, tickets, logs, fixtures, or chat output.
- Keep wallet, funding, verification, and future settlement providers behind replaceable boundaries. Do not add a smart contract without a concrete approved requirement.

## Validation and definition of done

- Add or update meaningful automated tests for new behavior and important state, authorization, amount, idempotency, and failure boundaries. A bug fix should include a regression test when feasible.
- Run focused tests while developing and the relevant existing test, lint, type-check, and build commands before completion. The repository-foundation ticket owns establishing the actual commands; do not claim commands exist before then.
- For interface changes, verify relevant mobile and desktop sizes, keyboard use, loading, empty, success, and error states. For database changes, validate migrations and constraints. For Solana changes, deterministic tests supplement rather than replace the required Devnet rehearsal.
- Documentation-only work requires link, structure, and consistency checks rather than application tests.
- Complete a ticket only after all applicable acceptance criteria pass and the implementation record is finished. Local completion does not imply deployment or independent review.
- Final handoff must link the ticket and summarize the outcome, validation, and material limitations.

## Commit rule

- Create commits only when the user asks or earlier authorization explicitly includes committing.
- Every commit subject must contain the owning development ticket identifier: `[DEVNNNN] Imperative summary`.
- Never use a coordination identifier in a commit subject. Prefer one development ticket per commit and include the ticket record with the implementation it documents.

## Plain-language writing

- Use direct, everyday language in plans, tickets, documentation, code comments, interface copy, and handoffs. Prefer a familiar word over specialist jargon when both mean the same thing.
- Explain an unfamiliar technical term the first time it is needed. Spell out an acronym on first use, followed by the acronym in parentheses when it will appear again.
- Keep established code identifiers, protocol names, and payment states unchanged, but explain them in plain language around the identifier.
- Write for someone who has not seen the conversation. State facts, assumptions, decisions, and implementation evidence separately.
- In user-facing copy, describe what happened and what the user can do next. Do not expose implementation details merely because they are useful to developers.
