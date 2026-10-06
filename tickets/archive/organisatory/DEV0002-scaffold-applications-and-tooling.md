# Ticket DEV0002: Scaffold applications and tooling

- Status: Completed
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: M0 — delivery foundation
- Coordination: [COR0001 — Deliver the restaurant payments MVP](../../current/organisatory/COR0001-deliver-restaurant-payments-mvp.md)
- Related records: [DEV0003 — Establish payment data and API foundation](../../current/backend/DEV0003-establish-payment-data-and-api-foundation.md), [DEV0014 — Build the static merchant interface](../merchant/DEV0014-build-static-merchant-interface.md), [DEV0013 — Reconcile the merchant UI contract](DEV0013-reconcile-merchant-ui-contract.md)

## Objective and context

Create the runnable repository foundation described in the [recommended stack and repository layout](../../../DEVELOPER_SPEC.md#4-recommended-stack). The repository currently contains documentation only, so every later ticket depends on stable application, package, configuration, and validation boundaries.

## Scope and non-goals

In scope:

- Create the workspace, Next.js merchant app, Expo customer app, shared payment and Solana packages, and database migration location.
- Establish TypeScript, lint, test, build, formatting, and local start commands with a documented supported runtime.
- Add environment examples and fail-fast Devnet/network configuration validation without secrets or hard-coded mutable addresses.

Out of scope:

- Product screens beyond a minimal shell, payment persistence, wallets, token transfers, or deployment.

## Expected behavior and edge cases

Both apps start from a clean install and can consume a small shared typed module. Missing or contradictory network configuration fails with a clear developer message. No command connects silently to mainnet, creates real assets, or assumes a test EURC mint without validation.

## Assumptions, decisions, and dependencies

- Confirm package-manager and runtime versions when the ticket starts and record why they were selected.
- Inspect current Next.js, Expo, React Native, and Solana package documentation before choosing versions.
- Keep platform-specific wallet code outside the shared payment-domain package.
- 2026-10-06: Adopt pnpm workspaces because pnpm is already installed and both Next.js and Expo document current workspace support. Use the Next.js App Router and Expo's TypeScript blank application shape.
- 2026-10-06: The first merchant screen remains a minimal shell in this ticket; DEV0014 owns product-specific fixture UI and visual behavior.

## Implementation plan

1. Initialize the workspace and both app shells.
2. Add shared package boundaries and environment parsing.
3. Establish test, lint, type-check, build, and local start commands.
4. Document setup and record exact validation results.

## Acceptance criteria

- [ ] AC1: A clean checkout can install dependencies and start both application shells with documented commands.
- [ ] AC2: Shared TypeScript code is consumed without duplication and all baseline validation commands pass.
- [ ] AC3: Missing or inconsistent Devnet configuration fails clearly before any payment action.

## Validation plan

Run the established install, test, lint, type-check, and build commands from a clean state. Start each app, observe the shell, and exercise missing and mainnet-mismatch configuration cases.

## Implementation record

### Changes and rationale

Created a pnpm workspace with a Next.js App Router merchant application, an Expo TypeScript customer application, and separate schemas, payments, Solana, and user-interface token packages. Kept both application screens deliberately minimal so product visuals remain owned by DEV0014 and customer behavior remains owned by its later tickets.

Centralized the design tokens in TypeScript and cascading style sheet forms so web and native clients can consume the same values. Added exact payment-state and amount field names to the shared payment package, a Devnet configuration reader that rejects missing and non-Devnet settings, baseline tests, and one root validation command.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| [`package.json`](../../../package.json), [`pnpm-workspace.yaml`](../../../pnpm-workspace.yaml), and [`pnpm-lock.yaml`](../../../pnpm-lock.yaml) | Workspace commands, supported Node versions, package graph, and reproducible dependencies. |
| [`apps/merchant-web`](../../../apps/merchant-web) | Next.js 16.3.8 App Router shell, CSS entry point, lint, type-check, test, build, and generated framework agent guidance. |
| [`apps/customer-mobile`](../../../apps/customer-mobile) | Expo 57 TypeScript shell with automatic monorepo resolution and shared tokens. |
| [`packages/ui-tokens`](../../../packages/ui-tokens) | Canonical colors, spacing, radii, font stack, and restrained Solana gradient for web and native use. |
| [`packages/payments`](../../../packages/payments) | Shared payment states, summary shape, and euro-cent formatter. |
| [`packages/schemas`](../../../packages/schemas) | Devnet-only environment boundary with missing, mainnet, and request-lifetime rejection tests. |
| [`packages/solana`](../../../packages/solana) | Dependency-free wallet and transfer service types; no chain client is installed yet. |
| [`.env.example`](../../../.env.example) | Non-secret Devnet, database, URL, and 600-second request-lifetime names. |
| [`README.md`](../../../README.md) | Install, start, validation, environment, and current-state instructions. |
| [`supabase/README.md`](../../../supabase/README.md) and [`scripts/README.md`](../../../scripts/README.md) | Explicit placeholders and safety boundaries for work owned by later tickets. |

No database migration, wallet, token address, API route, live service, or deployment was created. Payment operations still require later tickets.

### Decisions and deviations

- 2026-10-06: Used pnpm 9.15.4 because it is installed locally and current Expo and pnpm documentation support pnpm workspaces.
- 2026-10-06: Used Next.js 16.3.8, React 19.2.3, Expo 57.0.26, and React Native 0.86.3 based on the current official generators. React was normalized to 19.2.3 across both apps to remove workspace peer conflicts.
- 2026-10-06: Used TypeScript 6.0.3 because the current Expo template selects it and both application type checks pass. The newer TypeScript 7 release was not adopted without framework-template support.
- 2026-10-06: Next.js generated `apps/merchant-web/AGENTS.md` and `CLAUDE.md` on first start. They are retained because the framework regenerates them and correctly direct agents to installed Next.js documentation.

## Validation results

- Date and environment: 2026-10-06 on macOS, Node 24.21.0, pnpm 9.15.4.
- `pnpm install`: Passed for seven workspace projects with no unresolved peer-dependency warnings after version normalization.
- `pnpm check`: Passed.
  - ESLint: merchant application passed.
  - TypeScript: merchant, customer, and all four shared packages passed.
  - Vitest: two files and five tests passed.
  - Next.js production build: passed; `/` and `/_not-found` were statically generated.
- `pnpm exec expo install --check` in `apps/customer-mobile`: Passed; dependencies are up to date.
- `pnpm dev:merchant`: Passed; Next.js became ready at `http://localhost:3000` in 256 ms.
- `CI=1 pnpm --filter @merchant-payments/customer-mobile start -- --offline`: Passed; Metro waited at `http://localhost:8081`.
- Live database, remote procedure call, and EURC mint checks: Not run because no credentials or current token configuration are required or authorized by this foundation ticket.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | Both development servers started with documented commands | Passed |
| AC2 | Shared tokens are consumed by both apps; lint, six-project type-check, five tests, and production build passed | Passed |
| AC3 | Four configuration tests cover valid Devnet, mainnet rejection, missing mint, and incorrect request lifetime | Passed |

## Risks, limitations, and follow-ups

DEV0003 still owns persistence and payment interfaces. The customer application has type-check coverage but no native simulator or real-device rendering evidence yet; those checks belong to customer behavior tickets. The current pnpm install reports upstream deprecation notices for ESLint 9 and a transitive `uuid` package, but the official Next.js 16.3.8 template currently selects ESLint 9 and all required validation passes.

## Completion and review references

- Completed: 2026-10-06 — runnable workspace, both application shells, shared packages, and validation established
- Commit: Shared initial repository commit — `[DEV0014] Add merchant payments application foundation`
- Review: Self-review completed
- Deployment or release: Not deployed
