# Task Decomposition — SituationshipAnalyzer

## Project Information

- Course: UIT Web Application Development 2026
- Lab: Lab 03 — Bonus Exercise
- Stack: React 19, Vite, TypeScript
- Workflow: Contract-first, test-first verification, atomic Git commits
- Reference: Lab 03 slides 31–32

## Canonical Relationship Contract

RelationshipPhase:
- FRIENDS
- DATING_NO_LOVE
- OFFICIAL_LOVE
- GHOSTED_EXIT

The explicit TypeScript union from the lecture is preferred over the inconsistent names in the prose description.

Demo effort multipliers:
- EM: 0.1
- AI_DO: 50

These are illustrative weights, not scientific relationship measurements.

## T01 — Repository Setup

Status: DONE

Goal:
Establish a working React 19 + Vite + TypeScript application without modifying previous exercises.

Prerequisites:
- Existing LAB3 repository inspected.
- Correct BonusExercise directory selected.

Files:
- Vite-generated configuration files
- src/ starter files
- package.json
- package-lock.json
- project_rules.md
- TASK_DECOMPOSITION.md

Contract:
- Input: Local Node.js/npm environment
- Output: Working React application

PASS criteria:
- Development server launches.
- Starter UI renders.
- React 19 confirmed.
- Build passes.
- Lint passes.
- No unrelated project changes.
- Git commit succeeds.

Suggested commit:
chore(bonus): initialize React TypeScript application


## T02 — Relationship FSM Contract and Transition Tests

Status: DONE

Goal:
Implement a pure and deterministic finite state machine
for mutually exclusive relationship phases.

Prerequisites:
- T01 DONE.
- React 19, Vite, and TypeScript build successfully.
- Git repository is ready.

Files:
- src/domain/relationshipMachine.ts (new)
- src/domain/relationshipMachine.test.ts (new)
- package.json (modified)
- package-lock.json (modified)
- TASK_DECOMPOSITION.md (modified)

Input Contract:
- RelationshipPhase:
  FRIENDS | DATING_NO_LOVE | OFFICIAL_LOVE | GHOSTED_EXIT
- RelationshipEvent:
  START_DATING | RETURN_TO_FRIENDS |
  CONFIRM_RELATIONSHIP | GHOST_TIMEOUT |
  EXIT | RESET

Output Contract:
- transitionRelationship(phase, event): RelationshipPhase
- canTransition(phase, event): boolean
- getAvailableEvents(phase): RelationshipEvent[]

State Rules:
- Exactly one active relationship phase.
- Only documented transitions are allowed.
- Invalid transitions preserve the current phase.
- GHOSTED_EXIT can only transition via RESET.
- GHOST_TIMEOUT is a domain event.
- Timer lifecycle is deferred to T05.

Lecture Decision:
The TypeScript union from slides 31-32 is the
canonical naming contract. Inconsistent names
from the prose description are not mixed.

Acceptance Criteria:
- Four mutually exclusive phases.
- Six explicitly named events.
- Legal transitions validated.
- Illegal transitions rejected.
- All 24 phase/event combinations covered.
- Pure deterministic transition function.
- Vitest tests pass.
- Production build passes.
- ESLint passes.
- Existing application remains functional.
- No unrelated files modified.
- Git commit succeeds.

Edge Cases:
- Direct confirmation from FRIENDS.
- Timeout outside DATING_NO_LOVE.
- Invalid transitions from OFFICIAL_LOVE.
- Terminal phase behavior.
- Independent returned event arrays.
- Repeated deterministic transitions.

Verification:
- npm run test
- npm run build
- npm run lint
- npm run dev
- Browser Console inspection
- Git diff inspection

Suggested Commit:
feat(bonus): implement relationship FSM and transition tests


## T03 — Effort Log and Derived Score

Status: DONE

Goal:
Implement immutable signals with stable IDs and pure effort calculations.

Prerequisite: T02 DONE

Contract:
Actor = EM | AI_DO
Signal = stable ID, actor, steps, multiplier

Tests:
- Weighted totals
- Immutable updates
- Stable IDs
- Invalid numeric input

Suggested commit:
feat(bonus): implement effort tracking and derived scoring


## T04 — Accessible SituationshipAnalyzer UI

Status: IN PROGRESS

Goal:
Integrate the existing relationship FSM and effort model
into an accessible React 19 user interface.

Prerequisites:
- T01 DONE.
- T02 DONE.
- T03 DONE.
- Existing domain tests pass.

Files:
- src/components/SituationshipAnalyzer.tsx (new)
- src/components/SituationshipAnalyzer.module.css (new)
- src/App.tsx (modified)
- src/App.css (modified)
- src/index.css (modified)
- TASK_DECOMPOSITION.md (modified)

Input Contract:
- RelationshipPhase and RelationshipEvent from T02.
- EffortActor and EffortSignalInput from T03.
- User-selected actor and positive integer steps.

Output Contract:
- One visible relationship phase.
- Legal phase transition controls.
- Immutable effort history.
- Derived scores and red-flag feedback.
- Accessible status announcements.

Implementation Decisions:
- Only legal FSM events are shown.
- GHOST_TIMEOUT is reserved for T05.
- Demo multipliers are EM=0.1 and AI_DO=50.
- Red-flag thresholds are inherited from T03.
- Scores are derived during render.
- No redundant score state or useEffect.
- No backend or real message service.

Acceptance Criteria:
- SituationshipAnalyzer renders successfully.
- FSM transitions work correctly.
- Effort signals can be added and removed.
- Invalid step inputs are rejected.
- Scores update after log changes.
- Red-flag feedback updates correctly.
- Form labels are associated with inputs.
- Accessible status announcements exist.
- Keyboard interaction works.
- Visible focus is provided.
- Responsive layout works at 375px.
- Reduced-motion preference is supported.
- No browser Console errors.
- Existing T02/T03 tests pass.
- Production build passes.
- ESLint passes.
- Previous exercises remain unchanged.
- Git commit succeeds.

Edge Cases:
- Empty effort log.
- Zero, negative and fractional steps.
- Large invalid numerical inputs.
- Repeated add/remove operations.
- FSM terminal phase and reset.
- Keyboard-only interaction.
- Narrow mobile viewport.

Verification:
- npm run dev
- Manual FSM interaction checks
- Manual effort calculation checks
- Invalid input checks
- Keyboard and focus checks
- Chrome DevTools Accessibility inspection
- Responsive viewport at 375px
- Reduced-motion emulation
- npm run test
- npm run build
- npm run lint
- Git diff inspection

Suggested Commit:
feat(bonus): build accessible situationship analyzer UI



## T05 — Seen Không Rep Timer & StrictMode Cleanup

Status: IN PROGRESS

Goal:
Implement a five-second simulated message reply window
with reliable cancellation and stale timeout protection.

Prerequisites:
- T01 DONE
- T02 DONE
- T03 DONE
- T04 DONE

Files:
- src/domain/messageLifecycle.ts (new)
- src/domain/messageLifecycle.test.ts (new)
- src/domain/analyzerSession.ts (new)
- src/domain/analyzerSession.test.ts (new)
- src/components/SituationshipAnalyzer.tsx (modified)
- src/components/SituationshipAnalyzer.test.tsx (new)
- src/components/SituationshipAnalyzer.module.css (modified)
- package.json (modified by npm)
- package-lock.json (modified by npm)
- TASK_DECOMPOSITION.md (modified)

Input Contract:
- RelationshipPhase from T02
- MessageStatus:
  IDLE | WAITING | REPLIED | CANCELLED | TIMED_OUT
- SEND, REPLY, CANCEL, TIMEOUT actions
- Relationship phase events
- Actor switch to AI_DO

Output Contract:
- A five-second reply window begins on SEND.
- A valid reply stops the pending timeout.
- Timeout transitions the relationship to GHOSTED_EXIT.
- Cancellation prevents stale timeout transitions.

Implementation Decisions:
- Messages are local simulations only.
- Sending is available in DATING_NO_LOVE.
- EM is the simulated sender.
- A repeated SEND replaces the previous deadline.
- Effort changes do not restart the deadline.
- Switching to AI_DO cancels the pending window.
- Phase changes and manual exit cancel the window.
- React useEffect owns timer setup and cleanup.
- clearTimeout is used for browser timers.
- No AbortController or fake network API is needed.
- Message status is separate from relationship phase.
- Request IDs guard against stale timeout actions.

Acceptance Criteria:
- No timer starts on component mount.
- SEND starts a five-second deadline.
- Reply before deadline prevents ghosting.
- No reply triggers GHOSTED_EXIT after deadline.
- Manual cancellation stops the timeout.
- Phase changes stop the timeout.
- Switching to AI_DO stops the timeout.
- Manual exit stops the timeout.
- Repeated SEND replaces the previous deadline.
- Effort changes do not restart the timeout.
- Unmount clears pending timers.
- StrictMode does not leave duplicate timers.
- No stale callback changes a cancelled session.
- Keyboard and status announcements work.
- Layout remains usable at 375px.
- Existing T02-T04 behavior remains functional.
- All tests, build, and lint pass.
- Git commit succeeds.

Edge Cases:
- Rapid repeated sends
- Reply immediately before timeout
- Timeout with an outdated request ID
- Timeout before the deadline
- Phase changes during waiting
- Actor switching during waiting
- Unmount during waiting
- StrictMode effect cleanup
- Effort edits during waiting
- Sending outside DATING_NO_LOVE

Verification:
- npx vitest run src/domain/messageLifecycle.test.ts
- npx vitest run src/domain/analyzerSession.test.ts
- npx vitest run src/components/SituationshipAnalyzer.test.tsx
- npm run test
- npm run build
- npm run lint
- npm run dev
- Browser Console inspection
- Manual five-second timer scenarios
- Keyboard and 375px responsive checks
- Git diff inspection

Suggested Commit:
feat(bonus): implement ghosting timer and safe cleanup

## T06 — Regression and Accessibility

Status: TODO

Goal:
Verify all interactions, responsiveness, accessibility and lifecycle behavior.

Prerequisite: T05 DONE

Tests:
- FSM regression
- Effort calculations
- Timer cancellation
- 375px responsive layout
- Keyboard navigation
- Reduced motion
- Available build/lint/test scripts

Suggested commit:
test(bonus): verify analyzer behavior and accessibility

## T07 — Documentation and Final Review

Status: TODO

Goal:
Finalize documentation, review evidence and Git history, and prepare a short defense.

Prerequisite: T06 DONE

Tests:
- Documentation reviewed
- Task status verified
- AI failure evidence reviewed
- Git history reviewed
- Previous exercises preserved

Suggested commit:
docs(bonus): finalize documentation and review
