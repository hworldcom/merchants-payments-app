# Ticket DEV0015: Harden Git ignore rules

- Status: Completed
- Created: 2026-10-06
- Last updated: 2026-10-06
- Milestone: Project maintenance before the first commit
- Coordination: None — independent development ticket
- Related records: [DEV0002 — Scaffold applications and tooling](DEV0002-scaffold-applications-and-tooling.md)

## Objective and context

Update the repository's ignore rules after Git initialization so generated output, local settings, caches, reports, credentials, and temporary service state cannot enter the first commit by accident. Keep source, shared configuration, the pnpm lockfile, and safe environment examples visible to Git.

## Scope and non-goals

In scope:

- Cover the current Next.js, Expo, pnpm, TypeScript, Vitest, editor, deployment, and Supabase local artifacts.
- Keep `.env.example`, `pnpm-lock.yaml`, `next-env.d.ts`, and application source available for commits.
- Verify rules with Git's own ignore matcher and inspect repository status.

Out of scope:

- Staging or committing files.
- Deleting generated files.
- Changing application behavior, dependencies, or environment values.

## Expected behavior and edge cases

Git must ignore generated dependencies, builds, caches, local environment files, signing material, reports, and logs at the root or inside workspace packages. The safe `.env.example`, lockfile, generated Next.js type declaration, source files, and tickets must remain visible. Existing untracked work must not be removed or overwritten.

## Assumptions, decisions, and dependencies

- The customer application currently uses Expo without checked-in native `ios` or `android` projects, but those directories are not ignored because a later ticket may intentionally add native source.
- Signing extensions are ignored because credentials must never enter source control.
- No dependency or external documentation lookup is required; Git's local matcher is authoritative for these repository paths.

## Implementation plan

1. Group `.gitignore` entries by purpose and add missing local artifacts.
2. Use `git check-ignore --no-index` to test ignored and deliberately tracked examples.
3. Inspect `git status`, record exact results, update the index, and archive this ticket.

## Acceptance criteria

- [x] AC1: Generated dependencies, builds, caches, reports, local service state, logs, environment files, and signing files are ignored.
- [x] AC2: `.env.example`, `pnpm-lock.yaml`, `apps/merchant-web/next-env.d.ts`, source files, and tickets remain visible to Git.
- [x] AC3: No file is staged, committed, deleted, or otherwise changed outside this ticket's documentation and `.gitignore`.

## Validation plan

| Criterion | Planned evidence | Environment or command |
| --- | --- | --- |
| AC1 | Git reports every generated or sensitive sample path as ignored | `git check-ignore --no-index -v <ignored samples>` |
| AC2 | Git reports deliberately tracked sample paths as not ignored | `git check-ignore --no-index <tracked samples>` with expected exit code 1 |
| AC3 | Repository status contains no staged entries and all project source remains present | `git status --short --untracked-files=all` and staged-diff check |

## Implementation record

### Changes and rationale

Expanded the existing rules into clear groups for dependencies, framework output, Expo state, test reports, caches, local configuration, signing files, Supabase state, editor files, logs, and packaged output. Kept native `ios` and `android` directories visible because a later ticket may intentionally add native source.

### Affected files and contracts

| File or component | Change and purpose |
| --- | --- |
| [`.gitignore`](../../../.gitignore) | Extend repository safety rules before the first commit. |
| [`tickets/README.md`](../../README.md) | Record the ticket lifecycle and reserve the next development identifier. |

No application interface, schema, dependency, environment value, migration, deployment, or runtime behavior changes.

### Decisions and deviations

- 2026-10-06: Did not ignore Expo `ios` or `android` directories. Generated native projects and intentional native source cannot be distinguished safely by one broad rule.
- 2026-10-06: Kept `.env.example`, `pnpm-lock.yaml`, and `next-env.d.ts` visible because they describe safe configuration, exact dependencies, and Next.js types.

## Validation results

- Date and environment: 2026-10-06, local Git repository on macOS.
- Ignored-path check: Passed. `git check-ignore --no-index -v` matched 16 representative paths covering dependencies, Next.js and Expo output, the local pnpm store, environment files, test reports, Vercel state, Supabase state, signing files, logs, and package archives.
- Tracked-path boundary check: Passed. `git check-ignore -q --no-index` returned exit code 1 for `.env.example`, `pnpm-lock.yaml`, `apps/merchant-web/next-env.d.ts`, `apps/merchant-web/src/app/page.tsx`, and this ticket, proving they are not ignored.
- Staging check: Passed. `git diff --cached --name-only` returned no paths.
- Status review: Passed. Project source and documentation remain visible as untracked files; existing `node_modules`, `.next`, and `.expo` artifacts remain ignored.
- Markdown link check: Passed for all 27 repository Markdown files after archiving the ticket.
- Application tests: Not run because this change affects only Git file selection and cannot change application behavior.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1 | Git matched every representative generated or sensitive path to the intended rule | Passed |
| AC2 | All five deliberately tracked paths returned the expected not-ignored exit code | Passed |
| AC3 | The staged diff was empty and status showed no deletion or staging | Passed |

## Risks, limitations, and follow-ups

- Ignore rules reduce accidental inclusion but do not replace reviewing staged content before every commit.

## Completion and review references

- Completed: 2026-10-06 — Git ignore rules hardened and verified before the first commit
- Commit: Shared initial repository commit — `[DEV0014] Add merchant payments application foundation`
- Review: Self-review only
- Deployment or release: Not applicable
