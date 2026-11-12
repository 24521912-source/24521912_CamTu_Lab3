# TASK DECOMPOSITION — Production Studio Drum Kit

## Project Overview
Build a playable and accessible seven-pad drum kit using React 19, TypeScript, Vite, and CSS Modules.

## Workflow Rules
- Follow Contract-First development.
- Complete and verify one task at a time.
- Update task status before committing.
- Use Conventional Commits.
- Never intentionally create AI failures.
- Keep all changes inside Homework1 unless explicitly required.

## Task Status
- TODO
- IN PROGRESS
- BLOCKED
- DONE

## T01 — Project Setup and Planning
Status: DONE
Dependencies: None
Files: TASK_DECOMPOSITION.md, existing Vite configuration
Goal: Establish the project structure and implementation plan.
Acceptance Criteria:
- React 19 and TypeScript are configured.
- Vite development server runs.
- Production build passes.
- Project rules and task decomposition exist.
Tests:
- npm ls react react-dom vite typescript --depth=0
- npm run build
- npm run dev
Commit: chore(drum): initialize project and task plan

## T02 — Drum Contracts and Key Mapping
Status: DONE
Dependencies: T01
Files: src/drum/drum.types.ts, src/drum/drum.config.ts
Goal: Define seven drum IDs, keyboard codes, pad metadata, and shared types.
Acceptance Criteria:
- Exactly seven uniquely identified pads.
- KeyW, KeyA, KeyS, KeyD, KeyJ, KeyK, KeyL are mapped once each.
- No deprecated keyCode.
- TypeScript and build checks pass.
Tests:
- Inspect mapping and verify unique codes.
- npm run build
Commit: feat(drum): define pad contracts and key mappings

## T03 — Audio Engine
Status: DONE
Dependencies: T02
Files: src/drum/audio/drumAudio.ts
Goal: Create real playable sounds using Web Audio API.
Acceptance Criteria:
- Seven pads can trigger audible percussion sounds.
- Audio starts after user interaction.
- Rapid triggers are supported.
- Audio resources are cleaned up appropriately.
Tests:
- npm run build
- Browser audio playback and Console checks
Commit: feat(audio): implement drum sound engine

## T04 — Semantic Drum Pads
Status: TODO
Dependencies: T02, T03
Files: src/drum/DrumKit.tsx, src/drum/DrumPad.tsx, src/App.tsx
Goal: Render seven clickable accessible drum pads.
Acceptance Criteria:
- Seven native buttons are displayed.
- Mouse and native keyboard activation work.
- Buttons have accessible names and visible shortcuts.
- Pressed visual state and aria-pressed are consistent.
Tests:
- Click every pad.
- Tab, Shift+Tab, Enter, Space.
- Browser Console and npm run build.
Commit: feat(drum): implement accessible drum pads

## T05 — Global Keyboard Controls
Status: TODO
Dependencies: T04
Files: src/drum/DrumKit.tsx, keyboard hook or utility if needed
Goal: Support seven physical shortcuts with correct lifecycle.
Acceptance Criteria:
- keydown and keyup are handled.
- event.repeat does not cause repeated hits.
- Inputs, textareas, selects, contenteditable and IME are protected.
- Browser modifier shortcuts are preserved.
- Focus loss does not leave pads stuck.
- No double activation from focused buttons.
Tests:
- W A S D J K L input and release.
- Hold keys, switch focus, use UniKey.
- Test modifier keys and editable elements.
- npm run build
Commit: feat(keyboard): add safe drum keyboard controls

## T06 — Hit History and Visual Meter
Status: TODO
Dependencies: T05
Files: src/drum/DrumKit.tsx, supporting components or styles
Goal: Provide accessible non-audio feedback.
Acceptance Criteria:
- Hit history is visible and bounded.
- Accessible live announcements are meaningful.
- Visual intensity meter responds to hits.
- Estimated intensity is not presented as physical dB SPL.
Tests:
- Trigger multiple pads and inspect history.
- Check screen-reader status semantics.
- Confirm visible meter feedback.
- npm run build
Commit: feat(drum): add hit history and intensity feedback

## T07 — Responsive Design and Accessibility
Status: TODO
Dependencies: T06
Files: src/drum/*.module.css, src/App.tsx, relevant styles
Goal: Polish the interface and aim for WCAG 2.2 AA.
Acceptance Criteria:
- Responsive layout works at 375px.
- No unintended horizontal scrolling.
- Visible keyboard focus and sufficient color contrast.
- prefers-reduced-motion is respected.
- Native buttons remain accessible.
Tests:
- Chrome DevTools responsive viewport at 375px.
- Keyboard-only navigation.
- Lighthouse Accessibility measurement.
- npm run build
Commit: style(drum): improve responsive and accessible UI

## T08 — Regression Testing and Documentation
Status: TODO
Dependencies: T07
Files: README.md, TASK_DECOMPOSITION.md, relevant test files if introduced
Goal: Verify the complete implementation and document real results.
Acceptance Criteria:
- All seven sounds and shortcuts work.
- Mouse, keyboard, IME isolation and focus behavior pass.
- History, meter, responsive UI and cleanup are checked.
- Available build/lint checks pass.
- Lighthouse score is recorded honestly.
- AI_FAILURE_AUDIT.md contains only verified AI-originated failures, written by the student.
Tests:
- npm run build
- npm run lint (if configured)
- Browser regression checklist
- Lighthouse Accessibility
- git status -sb
Commit: docs(drum): document validation and completion