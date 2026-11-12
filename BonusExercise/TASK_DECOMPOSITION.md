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

Status: IN PROGRESS

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

## T02 — Relationship FSM

Status: TODO

Goal:
Define exclusive relationship states, events, legal transitions, and pure transition logic.

Prerequisite: T01 DONE

Contract:
FRIENDS | DATING_NO_LOVE | OFFICIAL_LOVE | GHOSTED_EXIT

Tests:
- Legal transitions
- Illegal transitions
- Single active relationship phase

Suggested commit:
feat(bonus): implement relationship state machine

## T03 — Effort Log and Derived Score

Status: TODO

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

## T04 — Accessible Analyzer UI

Status: TODO

Goal:
Build the SituationshipAnalyzer interface with semantic controls and accessible feedback.

Prerequisite: T03 DONE

Tests:
- Form labels
- Keyboard controls
- Status announcements
- Correct phase display

Suggested commit:
feat(bonus): build accessible analyzer interface

## T05 — Seen Không Rep Timer

Status: TODO

Goal:
Implement the explicit five-second message timeout and safe cancellation.

Prerequisite: T04 DONE

Tests:
- Send starts timeout
- Reply cancels timeout
- Phase change cancels timeout
- Actor switch cancels timeout
- Exit cancels timeout
- Unmount cleanup
- StrictMode behavior

Suggested commit:
feat(bonus): implement ghosting timer lifecycle

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
