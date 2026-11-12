# Homework 2 — Task Decomposition

**Project:** 88-Key Polyphonic Piano & Concurrent FIFO Sequencer  
**Course:** UIT Web Application Development 2026 — Lab 03  
**Technology:** React 19, Vite, TypeScript, CSS Modules, Web Audio API  
**Environment:** Windows, VS Code, PowerShell, npm, Git

## Development Rules

- Complete one task at a time.
- Test each task before committing.
- Do not start the next task until the current task passes verification and is committed.
- Use Conventional Commits.
- Preserve existing Homework 1 and Lab 03 work.
- Document verified AI-generated failures in `AI_FAILURE_AUDIT.md`.
- Never fabricate test results, screenshots, errors, or commit hashes.
- Update the task status after successful verification.

## Task Overview

| ID | Task | Dependencies | Status |
|---|---|---|---|
| T01 | Repository Inspection & Task Planning | None | DONE |
| T02 | React 19 + Vite + TypeScript Setup | T01 | DONE |
| T03 | Mathematical MIDI Note Model & Contracts | T02 | DONE |
| T04 | Web Audio Synthesizer & 8-Voice FIFO | T03 | DONE |
| T05 | 88-Key Piano UI & Interactions | T04 | TODO |
| T06 | React.memo & Profiler Verification | T05 | TODO |
| T07 | FIFO Note Recording | T05 | TODO |
| T08 | Variable-Speed Replay & Cancellation | T07, T04 | TODO |
| T09 | Responsive Design & Accessibility | T05–T08 | TODO |
| T10 | Regression Testing, Documentation & Final Review | T01–T09 | TODO |

---

## T01 — Repository Inspection & Task Planning

**Status:** IN PROGRESS

**Objective:** Inspect the existing Git repository and establish a safe development plan for Homework 2.

**Files:**
- `project_rules.md` (existing)
- `TASK_DECOMPOSITION.md` (new)

**Acceptance Criteria:**
- [ ] Confirm repository root and Homework 2 location.
- [ ] Inspect existing files and Git status.
- [ ] Preserve Homework 1 and previous exercises.
- [ ] Create and review the complete task decomposition.
- [ ] Confirm dependencies and task order.
- [ ] Commit the task planning document.

**Tests:** PowerShell directory inspection, Git status and staged diff review.

**Commit:** `docs(piano): establish homework 2 task plan`

**Commit Hash:** Not recorded yet.

---

## T02 — React 19 + Vite + TypeScript Setup

**Status:** TODO

**Objective:** Initialize a working React 19 application without deleting the existing project rules.

**Files:**
- `package.json` (new)
- `package-lock.json` (new)
- `index.html` (new)
- `vite.config.ts` (new)
- `tsconfig.json` and related TypeScript configuration files (new)
- `src/main.tsx` (new)
- `src/App.tsx` (new)
- `src/index.css` or equivalent stylesheet (new)
- Other necessary Vite-generated configuration files
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] React 19 and React DOM 19 are installed.
- [ ] Vite and TypeScript are configured.
- [ ] Existing project rules are preserved.
- [ ] `npm run dev` starts successfully.
- [ ] The application renders in the browser.
- [ ] `npm run build` passes.
- [ ] No unrelated repository files are modified.

**Tests:** Dependency version inspection, development server, browser Console and production build.

**Commit:** `chore(piano): initialize React 19 Vite TypeScript project`

**Commit Hash:** Not recorded yet.

---

## T03 — Mathematical MIDI Note Model & Contracts

**Status:** TODO

**Objective:** Generate and validate all 88 piano notes mathematically.

**Planned Files:**
- `src/piano/noteModel.ts` (new)
- `src/piano/types.ts` (new)
- Suitable note-model test file (new)
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Generate MIDI notes 21–108.
- [ ] Produce exactly 88 notes.
- [ ] Identify 52 white and 36 black keys.
- [ ] Calculate frequencies using `440 * 2 ** ((midi - 69) / 12)`.
- [ ] Validate A0, A4 and C8.
- [ ] Define stable note identifiers and typed contracts.
- [ ] Reject invalid MIDI values.

**Tests:** Automated assertions for MIDI boundaries, frequency, note names, ordering and key counts.

**Commit:** `feat(piano): implement mathematical MIDI note model`

**Commit Hash:** Not recorded yet.

---

## T04 — Web Audio Synthesizer & 8-Voice FIFO

**Status:** TODO

**Objective:** Implement real audio synthesis with safe voice management.

**Planned Files:**
- `src/audio/PianoSynth.ts` (new)
- Related audio types or tests if required
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Initialize or resume AudioContext after a user gesture.
- [ ] Generate audible notes using oscillators.
- [ ] Support up to 8 simultaneous voices.
- [ ] Track active voices using an insertion-ordered Map.
- [ ] Steal the oldest active voice when a ninth voice starts.
- [ ] Apply a short gain release ramp to reduce clicks.
- [ ] Prevent double-stop errors.
- [ ] Release and disconnect audio nodes safely.
- [ ] Keep the internal active-voice state consistent.

**Tests:** Manual audio playback, chord testing, ninth-voice FIFO testing and cleanup checks.

**Commit:** `feat(audio): implement eight voice FIFO synthesizer`

**Commit Hash:** Not recorded yet.

---

## T05 — 88-Key Piano UI & Interactions

**Status:** TODO

**Objective:** Build a playable keyboard with accessible interaction controls.

**Planned Files:**
- `src/components/PianoKey.tsx` (new)
- `src/components/PianoKey.module.css` (new)
- `src/components/PianoKeyboard.tsx` (new)
- `src/components/PianoKeyboard.module.css` (new)
- `src/App.tsx` (updated)
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Render all 88 keys dynamically.
- [ ] Display correct white and black key positions.
- [ ] Play notes when interacting with keys.
- [ ] Support appropriate pointer interactions.
- [ ] Support native keyboard activation.
- [ ] Provide accessible button names.
- [ ] Prevent stuck notes after pointer cancellation, focus loss or release.
- [ ] Keep UI pressed states consistent with audio voices.

**Tests:** Manual pointer and keyboard testing, repeated notes, multiple keys, cancellation and browser Console inspection.

**Commit:** `feat(piano): build playable 88 key keyboard`

**Commit Hash:** Not recorded yet.

---

## T06 — React.memo & Profiler Verification

**Status:** TODO

**Objective:** Prevent unnecessary rendering of unaffected PianoKey components.

**Planned Files:**
- `src/components/PianoKey.tsx` (updated)
- `src/components/PianoKeyboard.tsx` (updated)
- Related state/callback implementation files
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Use `React.memo` for PianoKey.
- [ ] Provide stable callback references.
- [ ] Avoid unnecessary object-prop identity changes.
- [ ] Confirm unaffected keys do not re-render during a single-note update.
- [ ] Inspect actual behavior using React DevTools Profiler.
- [ ] Account for development StrictMode when reviewing results.

**Tests:** React DevTools Profiler with locally saved evidence.

**Commit:** `perf(piano): isolate key rendering with memoization`

**Commit Hash:** Not recorded yet.

---

## T07 — FIFO Note Recording

**Status:** TODO

**Objective:** Record note events in chronological order with accurate timing.

**Planned Files:**
- `src/recording/` recording logic (new)
- `src/components/` recording controls (new or updated)
- `src/App.tsx` (updated)
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Record `midi`, `freqHz`, `durationMs`, and `deltaMs`.
- [ ] Define event ordering and timing origin.
- [ ] Calculate note duration from note-on/note-off behavior.
- [ ] Preserve chronological recording order.
- [ ] Handle overlapping notes.
- [ ] Handle repeated notes.
- [ ] Define behavior for stolen or interrupted notes.
- [ ] Provide working recording controls.

**Tests:** Single note, chord, repeated-note and timing inspection.

**Commit:** `feat(recording): capture ordered piano note events`

**Commit Hash:** Not recorded yet.

---

## T08 — Variable-Speed Replay & Cancellation

**Status:** TODO

**Objective:** Replay recorded notes asynchronously and cancel playback safely.

**Planned Files:**
- `src/sequencer/` replay logic (new)
- `src/components/` playback controls (new or updated)
- `src/App.tsx` (updated)
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Replay recorded events chronologically.
- [ ] Support 0.5x, 1x and 2x playback speeds.
- [ ] Preserve relative note timing and durations.
- [ ] Handle overlapping recorded notes.
- [ ] Implement Stop Sequence.
- [ ] Cancel pending waits and scheduled playback correctly.
- [ ] Release replay audio voices on cancellation.
- [ ] Clean up timers, promises and audio resources on unmount.
- [ ] Define behavior when live playing overlaps with replay.
- [ ] Avoid orphaned audio after stopping.

**Tests:** All playback speeds, chord timing, rapid stopping, repeated playback and unmount cancellation.

**Commit:** `feat(sequencer): implement abortable variable speed replay`

**Commit Hash:** Not recorded yet.

---

## T09 — Responsive Design & Accessibility

**Status:** TODO

**Objective:** Make the piano usable on desktop and mobile while meeting accessibility expectations.

**Planned Files:**
- Relevant CSS Modules (updated)
- Relevant UI components (updated)
- `src/App.tsx` (updated if necessary)
- `TASK_DECOMPOSITION.md` (updated)

**Acceptance Criteria:**
- [ ] Usable at a 375px viewport.
- [ ] No unintended page-level horizontal overflow.
- [ ] Piano scrolling remains accessible when necessary.
- [ ] Native buttons support keyboard operation.
- [ ] Visible focus indicators.
- [ ] Meaningful accessible names.
- [ ] Adequate contrast.
- [ ] Appropriate semantic structure.
- [ ] Manual WCAG 2.2 AA-oriented checks.
- [ ] Target Lighthouse Accessibility score of 100.

**Tests:** 375px responsive inspection, keyboard-only navigation, focus checks, browser accessibility inspection and Lighthouse.

**Commit:** `fix(a11y): improve piano responsiveness and accessibility`

**Commit Hash:** Not recorded yet.

---

## T10 — Regression Testing, Documentation & Final Review

**Status:** TODO

**Objective:** Verify all required functionality and prepare the final submission.

**Planned Files:**
- `README.md` (new or updated)
- `AI_FAILURE_AUDIT.md` (updated by the student)
- `TASK_DECOMPOSITION.md` (updated)
- Relevant tests or bug-fix files if necessary

**Acceptance Criteria:**
- [ ] Verify 88 notes, 52 white keys and 36 black keys.
- [ ] Verify real Web Audio playback.
- [ ] Verify the eight-voice ceiling and FIFO stealing.
- [ ] Verify recording data and note durations.
- [ ] Verify all three replay speeds.
- [ ] Verify Stop Sequence and unmount cleanup.
- [ ] Verify React.memo through Profiler.
- [ ] Verify pointer and keyboard accessibility.
- [ ] Verify 375px responsiveness.
- [ ] Run available build, lint and test commands.
- [ ] Review the student's AI failure audit and real evidence.
- [ ] Prepare a 3–5 minute demonstration.
- [ ] Confirm each completed task has a real Git commit.

**Tests:** Final regression checklist, browser tests, terminal validation and evidence review.

**Commit:** `docs(piano): finalize regression evidence and documentation`

**Commit Hash:** Not recorded yet.

---

## AI Failure Audit Policy

The student must write `AI_FAILURE_AUDIT.md` personally in English.

Only verified AI-generated mistakes are eligible. Never fabricate failures or evidence to satisfy the rubric.

For each valid failure, document the original AI instruction, observed behavior, verified cause, correction, retest evidence and real commit reference.

## Task Completion Policy

A task can be marked `DONE` only after its acceptance criteria have been checked.

For tasks that modify files:

1. Run relevant tests.
2. Inspect Git status and diff.
3. Update task status.
4. Stage only task-related files.
5. Review the staged diff.
6. Create a Conventional Commit.
7. Verify the commit in Git history.

**Current next task after T01:** T02 — React 19 + Vite + TypeScript Setup.
