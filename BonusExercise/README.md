
# SituationshipAnalyzer — Hẹn Hò Nhưng Không Yêu

UIT Web Application Development 2026  
Lab 03 — Bonus Exercise

## 1. Project Overview

SituationshipAnalyzer is an interactive React application
that demonstrates:

- Finite State Machine (FSM) modeling
- Immutable state updates
- Derived data and effort scoring
- React state management
- Timer lifecycle management
- useEffect cleanup
- React StrictMode behavior
- Keyboard accessibility
- Responsive user interface

The project simulates relationship state changes and
a five-second "Seen Không Rep" messaging scenario.

This application is an educational demo. Its effort
multipliers and red-flag rules are not scientific
measures of real relationships.

## 2. Technology Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Vitest
- React Testing Library
- jsdom
- ESLint
- npm

## 3. Requirements

- Node.js: [FILL VERIFIED VERSION]
- npm: [FILL VERIFIED VERSION]
- A modern web browser
- Windows PowerShell or another compatible terminal

## 4. Installation

Open a terminal in the BonusExercise directory.

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local address displayed by Vite.

## 5. Available Commands

```bash
npm run dev
npm run test
npm run build
npm run lint
npm run preview
```

`npm run preview` should be used after building.

## 6. Relationship State Machine

Relationship phases:

- FRIENDS
- DATING_NO_LOVE
- OFFICIAL_LOVE
- GHOSTED_EXIT

Supported events:

- START_DATING
- RETURN_TO_FRIENDS
- CONFIRM_RELATIONSHIP
- GHOST_TIMEOUT
- EXIT
- RESET

Only valid transitions are allowed.

GHOST_TIMEOUT is triggered by a valid expired
message window, not by a manual UI button.

The exact transition rules are implemented in:

src/domain/relationshipMachine.ts

## 7. Immutable Effort Log

Supported actors:

- EM
- AI_DO

Each effort signal contains:

- id
- actor
- steps
- multiplier

Default demo multipliers:

- EM: 0.1
- AI_DO: 50

Scores are calculated from the effort log.

The application does not keep redundant React state
for derived scores.

The red-flag rule uses the thresholds implemented in
src/domain/effortModel.ts.

## 8. Seen Không Rep — Five-Second Timer

The message lifecycle states are:

- IDLE
- WAITING
- REPLIED
- CANCELLED
- TIMED_OUT

A send action starts a five-second reply window.

A valid reply cancels the timeout.

A valid expired timeout triggers the GHOST_TIMEOUT
relationship event.

The timeout is cancelled when:

- A reply is received
- Waiting is cancelled manually
- The relationship phase changes
- The actor switches to AI_DO
- The component unmounts

A repeated send replaces the previous request.

Request IDs prevent stale timeout callbacks from
changing a newer message session.

The timer is managed with React useEffect and
clearTimeout cleanup.

No real messaging service or backend is used.

## 9. Accessibility

The interface includes:

- Semantic HTML
- Associated form labels
- Keyboard-operable controls
- Visible focus indicators
- Accessible validation feedback
- A polite live status region
- Reduced-motion support
- Responsive layout

Accessibility was assessed through manual checks
and Lighthouse.

See T06_VERIFICATION.md for actual results,
limitations, and evidence.

## 10. Testing

Run all tests:

```bash
npm run test
```

Check the production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Tests cover:

- Relationship FSM
- Effort log and scoring
- Message lifecycle
- Session integration
- Five-second timer
- Reply and cancellation
- Resend behavior
- Stale timeout protection
- Unmount cleanup
- React StrictMode

Final verified results:

- Tests: [FILL ACTUAL RESULT]
- Build: [FILL ACTUAL RESULT]
- Lint: [FILL ACTUAL RESULT]

## 11. Verification Evidence

Detailed verification is documented in:

T06_VERIFICATION.md

Evidence includes, where captured:

- Automated tests
- Build and lint
- FSM and effort regression
- Timer lifecycle
- Accessibility checks
- Responsive viewport checks
- Lighthouse audit

Lighthouse results:

- Performance: [FILL ACTUAL SCORE]
- Accessibility: [FILL ACTUAL SCORE]
- Best Practices: [FILL ACTUAL SCORE]
- SEO: [FILL ACTUAL SCORE]

If a metric was not measured, document that
explicitly instead of estimating it.

## 12. Project Structure

src/
  components/
    SituationshipAnalyzer.tsx
    SituationshipAnalyzer.module.css
    SituationshipAnalyzer.test.tsx
  domain/
    relationshipMachine.ts
    relationshipMachine.test.ts
    effortModel.ts
    effortModel.test.ts
    messageLifecycle.ts
    messageLifecycle.test.ts
    analyzerSession.ts
    analyzerSession.test.ts
  App.tsx
  App.css
  index.css
  main.tsx

Additional documentation:

- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md
- T06_VERIFICATION.md

## 13. AI-Assisted Development

AI was used as a coding and mentoring assistant.

The student independently:

- Implemented the project locally
- Ran commands and tests
- Verified the application behavior
- Reviewed generated code
- Corrected observed problems
- Maintained Git commits
- Documented AI failures

Actual AI-generated failures and their corrections
are recorded in AI_FAILURE_AUDIT.md.

## 14. Limitations

- No backend or database
- No real messaging service
- Message replies are simulated
- Relationship and effort states are local to the app
- Effort multipliers are illustrative only
- No scientific interpretation of relationship quality

## 15. Submission

Submitted by: [FILL STUDENT INFORMATION IF REQUIRED]

Course: Web Application Development — UIT 2026

Exercise: Lab 03 — Bonus Exercise

Repository/branch: [FILL IF REQUIRED]

Final commit: [RECORD ACTUAL COMMIT AFTER COMMITTING]
