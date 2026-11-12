
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
| T01 | Project setup and documentation | DONE | Not recorded |
| T02 | Domain contracts and drop FSM | DONE | Not recorded |
| T03 | Anti-drift countdown hook | Done | Not recorded |
| T04 | Accessible airdrop cards | DONE | Not recorded |
| T05 | Mock claim service and optimistic rollback | DONE | Not recorded |
| T06 | PUBG leaderboard | DOne | Not recorded |
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

**Status:** DONE

**Suggested commit:** chore(arena): initialize React project and task plan

**Actual commit:** Not recorded

## T02 — Domain Contracts and Drop FSM

**Goal:** Define typed drop and squad contracts, demo data and legal state transitions.

**Dependencies:** T01.

**Files:** 
**Files:**
- src/features/arena/domain/types.ts (new)
- src/features/arena/domain/demoData.ts (new)
- src/features/arena/domain/dropMachine.ts (new)
- src/features/arena/domain/domainChecks.ts (new)
- TASK_DECOMPOSITION.md (updated)

**Input:** Homework requirements and deterministic demo scenarios.

**Output:** Typed models, fixture data and state-transition logic.

**Invariants:** Stable IDs, nonnegative inventory and no contradictory phases.

**Acceptance criteria:** All four phases have defined transitions; invalid transitions are rejected or handled explicitly; demo data is clearly identified.

**Tests:** 
- npm run build — PASS
- npm run lint — PASS
- Browser Console domain checks — 20 PASS

**Status:** DONE

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

**Status:** Done

**Suggested commit:** feat(arena): implement anti-drift airdrop timer

**Actual commit:** Not recorded


## T04 — Accessible Airdrop Cards

**Goal:** Build accessible and responsive demo airdrop cards using the existing domain contracts and countdown hook.

**Dependencies:** T02, T03.

**Files:**
- src/features/arena/components/DropCard.tsx (new)
- src/features/arena/components/DropCard.module.css (new)
- src/features/arena/Arena.module.css (new)
- src/App.tsx (modified)
- src/index.css (modified)
- TASK_DECOMPOSITION.md (updated)

**Inputs:**
- Typed demo drop items from T02.
- Countdown hook from T03.
- Demo scenario selection.

**Outputs:**
- PUBG-inspired arena landing page.
- Accessible VIP ticket and G-Coin crate cards.
- Countdown and phase presentation.
- Deterministic demo scenario controls.
- Non-commercial preview action.

**Contracts and invariants:**
- Demo data must be labeled clearly.
- No real claim, transaction or inventory update occurs.
- Prices are formatted in VND.
- Countdown uses absolute target epochs.
- Displayed phases are derived from clock and stock.
- Preview controls cannot claim sold-out, expired or unopened items.
- T02 domain modules and T03 timer modules remain unchanged.

**Acceptance criteria:**
- Both demo items render correctly.
- WARMUP, AIRDROP_LIVE, LOOTED_OUT and EXPIRED are displayed correctly.
- Buttons reflect availability.
- Preview action never reports a real claim.
- 375px viewport remains usable.
- Keyboard interactions and focus indicators work.
- Console contains no application errors.
- Build and lint pass.

**Tests:**
- npm run build
- npm run lint
- Manual browser functional checks
- Four demo phase scenarios
- Claim-preview interaction
- 375px responsive inspection
- Keyboard navigation and focus checks
- Chrome DevTools Console
- Lighthouse Accessibility inspection

**Status:** DONE

**Suggested commit:** feat(arena): build accessible airdrop cards

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

**Status:** DONE

**Suggested commit:** feat(arena): implement optimistic claims and rollback

**Actual commit:** Not recorded


## T06 — PUBG Leaderboard

**Goal:** Implement a responsive, accessible PUBG Vietnam demo leaderboard with deterministic filtering and sorting.

**Dependencies:** T02, T04, T05.

**Files:**
- src/features/arena/domain/leaderboardLogic.ts (new)
- src/features/arena/domain/leaderboardChecks.ts (new)
- src/features/arena/components/Leaderboard.tsx (new)
- src/features/arena/components/Leaderboard.module.css (new)
- src/App.tsx (modified)
- TASK_DECOMPOSITION.md (updated)

**Input:**
- Typed squad records from demoSquads.
- User-entered search text.
- Minimum WWCD filter.
- Selected sorting metric.

**Output:**
- Accessible and responsive leaderboard.
- Squad filtering and deterministic sorting.
- Derived total points.
- Empty state and reset controls.

**Contracts and invariants:**
- Squad records use stable squadId values.
- All scores are explicitly labeled demo data.
- Total points equal placement points plus kill points.
- WWCD is shown separately.
- Filtering is case-insensitive and trims whitespace.
- Sorting uses descending numeric metrics.
- Tie breakers are deterministic.
- Original squad data is never mutated.
- Filtered and sorted rows are derived from source data.
- No external API or real-time results are used.

**Acceptance criteria:**
- All four required squads are displayed.
- All six table columns contain correct data.
- Search by squad name works.
- Minimum WWCD filtering works.
- WWCD, placement, kill and total sorting work.
- Equal-score ties are resolved deterministically.
- Combined filters and empty results are handled.
- Reset controls restore default filters.
- Semantic HTML and labeled controls are used.
- Keyboard navigation works.
- The 375px viewport remains usable.
- Existing airdrop claim behavior is preserved.
- Build and lint pass.

**Tests:**
- npm run build
- npm run lint
- 20 deterministic leaderboard checks
- Manual search and filtering tests
- Sorting and tie-breaker checks
- Empty-state and reset checks
- Keyboard interaction checks
- 375px responsive inspection
- Browser Console inspection
- Airdrop regression checks

**Status:** DONE

**Suggested commit:** feat(arena): implement filterable PUBG leaderboard

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
