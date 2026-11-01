
# Task Decomposition — Lab 03 Exercise 3

## Project
- Course: Web Application Development — UIT
- Exercise: KRAFTON PUBG Vietnam Series Live Telemetry
- Stack: React 19, TypeScript, Vite, CSS Modules
- Approach: Contract-First, Atomic Tasks, Manual Verification
- Status: In Progress

## Working Rules
- Complete tasks in dependency order.
- Verify changes before committing.
- Use Conventional Commits.
- Do not change Exercise 1 or Exercise 2.
- Record verified AI-generated failures personally in AI_FAILURE_AUDIT.md.
- Keep the two required Exercise 3 feature commits separate.

## Phase P — Preparation

### P01 — Inspect Existing Project
- Objective: Inspect repository structure and Git status.
- Files: None.
- Dependencies: None.
- Acceptance criteria:
  - Identify repository root.
  - Identify existing exercise folders.
  - Check Git status and recent commits.
  - Locate existing Vite package.json files.
- Verification: PowerShell inspection commands.
- Commit: None (read-only task).

### P02 — Create Task Decomposition
- Objective: Define implementation order, dependencies, acceptance criteria and verification.
- Files: TASK_DECOMPOSITION.md (new).
- Dependencies: P01.
- Acceptance criteria:
  - Every task has an ID and objective.
  - Dependencies, files and verification are documented.
  - Both required feature commits are planned.
- Verification: Review document and Git diff.
- Commit: docs(ex3): add task decomposition plan

### P03 — Prepare Exercise 3 Workspace
- Objective: Prepare the Exercise 3 workspace using the existing repository layout.
- Files: Exercise 3 project files, only as needed.
- Dependencies: P02.
- Acceptance criteria:
  - React 19 + TypeScript + Vite environment is available.
  - Existing exercises are unchanged.
  - Required npm scripts work.
- Verification: npm run build; npm run lint (if available).
- Commit: chore(ex3): prepare exercise workspace

## Phase A — Contracts and Data

### A01 — Define Telemetry Contracts
- Objective: Define typed squad IDs, telemetry records and four mutually exclusive UI states.
- Files: src/types/telemetry.ts (new).
- Dependencies: P03.
- Acceptance criteria:
  - SquadId supports ces, te and ge.
  - Telemetry payload is strictly typed.
  - IDLE, LOADING, SUCCESS and ERROR are represented by a discriminated union.
  - SUCCESS includes telemetry data; ERROR includes an error message.
- Verification: TypeScript build; inspect contracts.
- Commit: feat(ex3): define telemetry contracts

### A02 — Create Sample Squad Data
- Objective: Define exact sample data for all three squads.
- Files: src/data/squads.ts (new).
- Dependencies: A01.
- Acceptance criteria:
  - CES: Erangel, Phase 6, 4 alive, 14 kills, 68%, In Safe Zone.
  - TE: Miramar, Phase 7, 4 alive, 18 kills, 82%, Holding High Ground.
  - GE: Taego, Phase 5, 3 alive, 9 kills, 41%, Rotating Blue Zone.
  - Default squad is TE.
- Verification: TypeScript build; compare data with requirements.
- Commit: feat(ex3): add sample PUBG squad data

## Phase B — Async Telemetry and State Machine

### B01 — Implement Abortable Telemetry Simulator
- Objective: Simulate asynchronous telemetry with 35% packet loss.
- Files: src/services/telemetry.ts (new).
- Dependencies: A02.
- Acceptance criteria:
  - Accept squadId and AbortSignal.
  - Return requested squad telemetry after a simulated delay.
  - Randomly reject approximately 35% of non-aborted requests.
  - Abort promptly and clean up timers/listeners.
  - AbortError is distinguishable from simulated failure.
- Verification: TypeScript build; manual async and abort checks.
- Commit: Deferred to B02 feature milestone.

### B02 — Implement 4-State Telemetry Component
- Objective: Connect squad switching, async requests and cleanup.
- Files:
  - src/components/PubgMatchTelemetry.tsx
  - Existing Exercise 3 application entry, as required.
- Dependencies: B01.
- Acceptance criteria:
  - IDLE, LOADING, SUCCESS and ERROR are mutually exclusive.
  - Default selected squad is TE.
  - useEffect starts requests using AbortController.
  - Cleanup aborts old requests.
  - Rapid switching cannot show stale results.
  - AbortError does not display an error banner.
- Verification:
  - npm run build
  - npm run lint (if available)
  - Manual CES/TE/GE switching.
  - Rapid switching and browser Console checks.
- Commit: feat(ex3): implement PUBG VN 4-state telemetry & AbortController

## Phase C — User Interface

### C01 — Add Skeleton and Error Retry
- Objective: Implement state-specific accessible UI.
- Files:
  - src/components/PubgMatchTelemetry.tsx
  - src/components/PubgMatchTelemetry.module.css
- Dependencies: B02.
- Acceptance criteria:
  - LOADING shows a 220px Blue-Zone skeleton with aria-busy.
  - SUCCESS displays telemetry data.
  - ERROR displays a section with role="alert".
  - Retry starts a new request for the selected squad.
  - No window.alert.
  - Reduced-motion preferences are respected.
- Verification:
  - npm run build
  - npm run lint (if available)
  - Test loading, success, failure and repeated retry.
  - Inspect skeleton geometry using DevTools.
- Commit: feat(ex3): add skeleton UI & retry alert

### C02 — Responsive Styling and Accessibility
- Objective: Polish layout, semantic HTML, focus and responsive behavior.
- Files:
  - src/components/PubgMatchTelemetry.module.css
  - Existing Exercise 3 styles, only if needed.
- Dependencies: C01.
- Acceptance criteria:
  - Layout works from 375px.
  - No horizontal overflow.
  - Keyboard navigation works.
  - Selected squad is clearly identified.
  - Focus indicators and contrast are sufficient.
  - Semantic headings and telemetry labels are used.
- Verification:
  - Chrome responsive mode at 375px, tablet and desktop.
  - Tab, Shift+Tab, Enter and Space.
  - Browser Console and Elements inspection.
- Commit: style(ex3): polish responsive telemetry UI

## Phase V — Verification

### V01 — Async Cleanup and Race Verification
- Objective: Verify cancellation, state correctness and race safety.
- Files: None unless a verified issue requires changes.
- Dependencies: C02.
- Acceptance criteria:
  - CES to TE to GE switching never displays stale data.
  - Active requests are canceled on squad change/unmount.
  - No false AbortError banner.
  - Retry works for the same squad.
  - StrictMode behavior is understood.
  - No remaining timers or abort listeners after cleanup.
- Verification:
  - Manual rapid switching.
  - React DevTools Profiler where useful.
  - Console inspection and controlled diagnostic tests.
- Commit: None if no changes are needed.

### V02 — Final Build and Submission Review
- Objective: Verify the complete exercise and Git evidence.
- Files:
  - TASK_DECOMPOSITION.md (update status if needed).
  - AI_FAILURE_AUDIT.md (written by student when applicable).
- Dependencies: V01.
- Acceptance criteria:
  - Build and lint pass.
  - All functional requirements verified.
  - Accessibility and responsive checks completed.
  - Both mandatory feature commits are present.
  - Earlier exercises remain unchanged.
  - Actual AI failures are documented without fabrication.
- Verification:
  - npm run build
  - npm run lint (if available)
  - git status
  - git log --oneline
  - Final manual checklist.
- Commit: docs(ex3): finalize verification checklist

## Required Feature Commit Milestones

1. feat(ex3): implement PUBG VN 4-state telemetry & AbortController
2. feat(ex3): add skeleton UI & retry alert

## AI Failure Audit

For every actual bug:
1. Save the error or unexpected behavior.
2. Identify whether AI-generated code or advice caused it.
3. Determine the verified root cause.
4. Apply a minimal correction.
5. Retest.
6. Personally document qualifying AI failures.
7. Include the real commit hash when available.

Do not invent failures or test results.
