
# TASK DECOMPOSITION
## KRAFTON x PUBG Vietnam Championship & Airdrop Arena

Course: UIT Web Application Development 2026 — Lab 03, Homework 3

Stack: React 19, Vite, TypeScript

## Workflow

- Complete exactly one task at a time.
- Status values: TODO, IN PROGRESS, BLOCKED, DONE.
- Test each implementation before committing.
- Update the current task status before committing.
- Stage only relevant files.
- Record actual commit references after they exist.
- Write AI_FAILURE_AUDIT.md personally, using verified evidence.
- Never fabricate test results, bugs, or Git history.

## Task Overview

| ID | Task | Status | Commit |
|---|---|---|---|
| T01 | Project setup and documentation | IN PROGRESS | Not recorded |
| T02 | Domain contracts and drop FSM | TODO | Not recorded |
| T03 | Anti-drift countdown hook | TODO | Not recorded |
| T04 | Accessible airdrop cards | TODO | Not recorded |
| T05 | Mock claim service and optimistic rollback | TODO | Not recorded |
| T06 | PUBG leaderboard | TODO | Not recorded |
| T07 | Arena integration and regression testing | TODO | Not recorded |
| T08 | Responsive design and accessibility | TODO | Not recorded |
| T09 | Documentation, audit and final defense | TODO | Not recorded |

## T01 — Project Setup and Documentation

**Goal:** Establish a working React 19 + Vite + TypeScript environment and create the project documentation.

**Dependencies:** Node.js, npm, VS Code and Git.

**Files:**
- React/Vite generated project files
- PROJECT_RULES_HOMEWORK_3.md (existing rules, preserve content)
- TASK_DECOMPOSITION.md (new)
- .gitignore (generated, inspect before committing)

**Input:** Empty project directory and existing project rules.

**Output:** Runnable React application with documented task plan.

**Invariants:** Do not overwrite unrelated projects or commit generated build outputs, dependencies or secrets.

**Acceptance criteria:**
- React and React DOM version 19.x confirmed.
- Vite and TypeScript configured.
- Development server works.
- Build passes.
- Lint passes.
- Project rules are present locally.
- Task plan is documented.
- Git commit succeeds.

**Tests:**
- npm run dev
- npm run build
- npm run lint
- git status -sb
- git log -1 --oneline

**Status:** IN PROGRESS

**Suggested commit:** chore(arena): initialize React project and task plan

**Actual commit:** Not recorded

## T02 — Domain Contracts and Drop FSM

**Goal:** Define typed drop and squad contracts, demo data and legal state transitions.

**Dependencies:** T01.

**Files:** New TypeScript domain modules under src/; exact paths will be established before implementation.

**Input:** Homework requirements and deterministic demo scenarios.

**Output:** Typed models, fixture data and state-transition logic.

**Invariants:** Stable IDs, nonnegative inventory and no contradictory phases.

**Acceptance criteria:** All four phases have defined transitions; invalid transitions are rejected or handled explicitly; demo data is clearly identified.

**Tests:** TypeScript build and deterministic transition tests when the test infrastructure is available.

**Status:** TODO

**Suggested commit:** feat(arena): define domain contracts and drop FSM

**Actual commit:** Not recorded

## T03 — Anti-Drift Countdown

**Goal:** Implement an absolute-time countdown with visibility synchronization.

**Dependencies:** T02.

**Files:** Countdown hook and related tests; exact paths determined during T03.

**Input:** Target epoch milliseconds and optional server offset milliseconds.

**Output:** Remaining milliseconds based on the current adjusted time.

**Invariants:** Remaining time never becomes negative; timer intervals and listeners are cleaned up.

**Acceptance criteria:** Correct future, zero and past behavior; tab resynchronization; dependency changes; no accumulated interval drift.

**Tests:** Build and countdown edge-case checks.

**Status:** TODO

**Suggested commit:** feat(arena): implement anti-drift airdrop timer

**Actual commit:** Not recorded

## T04 — Accessible Airdrop Cards

**Goal:** Display PVS VIP tickets and G-Coin crates with prices, inventory, countdown and phase information.

**Dependencies:** T02, T03.

**Files:** React components and styles; exact paths determined during T04.

**Input:** Typed demo drop data and current phase.

**Output:** Accessible item cards.

**Invariants:** Prices use VND formatting; claim controls reflect phase and inventory; no real ticket availability is implied.

**Acceptance criteria:** Correct information, disabled states, keyboard interaction and accessible labels.

**Tests:** Browser, keyboard, Console, build and lint.

**Status:** TODO

**Suggested commit:** feat(arena): add accessible airdrop cards

**Actual commit:** Not recorded

## T05 — Optimistic Claim and Rollback

**Goal:** Implement a deterministic mock claim service and safe optimistic inventory updates.

**Dependencies:** T02, T04.

**Files:** Mock service, claim logic, components and tests.

**Input:** Item ID and simulated success, 409 or network-error scenario.

**Output:** Confirmed claim or restored inventory with accessible feedback.

**Invariants:** One pending claim per item; no negative inventory; no duplicate decrement or rollback; stale asynchronous responses must not corrupt state.

**Acceptance criteria:** Success, 409 rollback, non-409 error, double-click prevention and lifecycle handling pass.

**Tests:** Deterministic scenarios and browser checks.

**Status:** TODO

**Suggested commit:** feat(arena): implement optimistic claims and rollback

**Actual commit:** Not recorded

## T06 — PUBG Leaderboard

**Goal:** Display demo squad standings with filtering and sorting.

**Dependencies:** T02.

**Files:** Leaderboard components, demo fixtures, styles and tests.

**Input:** Demo records for The Expendables, Cerberus Esports, Roy Esports and AGG.

**Output:** Accessible filterable and sortable standings.

**Invariants:** Stable squad IDs, deterministic tie breakers and derived totals.

**Acceptance criteria:** WWCD, placement and kill sorting; visible filtering; correct empty state; accessible controls.

**Tests:** Sorting, ties, filtering, browser, build and lint.

**Status:** TODO

**Suggested commit:** feat(arena): add filterable PUBG leaderboard

**Actual commit:** Not recorded

## T07 — Arena Integration

**Goal:** Combine all features into one consistent experience.

**Dependencies:** T03, T04, T05, T06.

**Files:** Existing application entry points and arena components.

**Input:** Verified timer, FSM, cards, claim handling and leaderboard.

**Output:** Integrated arena application.

**Invariants:** Preserve state consistency and prevent stale updates.

**Acceptance criteria:** Complete user flows and important regression scenarios pass.

**Tests:** Browser interaction, Console, build, lint and available automated tests.

**Status:** TODO

**Suggested commit:** feat(arena): integrate PUBG arena experience

**Actual commit:** Not recorded

## T08 — Responsive Design and Accessibility

**Goal:** Improve the integrated UI for 375px and desktop viewports.

**Dependencies:** T07.

**Files:** Existing UI components and styles.

**Input:** Integrated arena application.

**Output:** Responsive, keyboard-accessible interface.

**Invariants:** No page-level horizontal overflow; respect reduced-motion preference.

**Acceptance criteria:** Keyboard navigation, focus indicators, meaningful labels, status feedback and contrast checks. Aim for Lighthouse Accessibility 100 and WCAG 2.2 AA.

**Tests:** Chrome DevTools, 375px viewport, keyboard-only interaction, Lighthouse, build and lint.

**Status:** TODO

**Suggested commit:** style(arena): improve responsive accessibility

**Actual commit:** Not recorded

## T09 — Documentation and Final Verification

**Goal:** Review evidence, documentation, Git history and prepare a 3–5 minute defense.

**Dependencies:** T01–T08.

**Files:** README.md, TASK_DECOMPOSITION.md and student-authored AI_FAILURE_AUDIT.md where applicable.

**Input:** Verified application, tests, screenshots and commit history.

**Output:** Submission-ready documentation and defense checklist.

**Invariants:** Do not fabricate AI failures, Lighthouse scores, test results or commits.

**Acceptance criteria:** README documents setup and demo limitations; task statuses match Git history; available evidence is reviewed; defense explains timer, FSM, optimistic claims, rollback and derived state.

**Tests:** Final build, lint, browser regression and Git history inspection.

**Status:** TODO

**Suggested commit:** docs(arena): finalize homework documentation

**Actual commit:** Not recorded
