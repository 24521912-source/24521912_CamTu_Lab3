# 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

## Project Information

- Course: Web Application Development — UIT 2026
- Lab: Lab 03
- Assignment: Homework 2
- Stack: React 19, TypeScript, Vite, CSS Modules, Web Audio API
- Environment: Windows, VS Code, PowerShell, npm, Git

## Overview

A browser-based 88-key piano with polyphonic Web Audio
synthesis, FIFO voice stealing, note recording, and
variable-speed sequence replay.

## Features

### 1. Mathematical 88-Key Piano

- MIDI range: 21–108 (A0–C8)
- 52 white keys and 36 black keys
- Algorithmically generated note data
- Equal-tempered pitch calculation:
  440 * 2 ** ((midi - 69) / 12)

### 2. Web Audio Synthesizer

- OscillatorNode and GainNode
- Up to eight active voices
- FIFO voice stealing using an insertion-ordered Map
- Short gain release envelope to reduce clicks
- Audio resource cleanup

### 3. Piano Interactions

- Mouse and touch input
- Native keyboard-accessible buttons
- Visible pressed and focus states
- Stop All Notes control
- Horizontally scrollable piano keyboard

### 4. FIFO Note Recording

Each completed note event contains:

- midi
- freqHz
- durationMs
- deltaMs

Events are recorded in note-on order.

### 5. Sequence Replay

- Playback speeds: 0.5x, 1x, 2x
- Overlapping note durations
- Stop Sequence cancellation
- Abortable asynchronous waits
- Replay voice cleanup

### 6. Performance and Accessibility

- React.memo for PianoKey
- Stable event callbacks
- React DevTools Profiler verification workflow
- Responsive layout, including 375px viewport
- Keyboard accessibility
- WCAG 2.2 AA-oriented manual checks
- Lighthouse Accessibility evaluation

## Getting Started

### Requirements

- Node.js compatible with the installed Vite version
- npm
- A modern browser with Web Audio API support

### Install

```powershell
npm install
```

### Run Development Server

```powershell
npm run dev
```

Open the localhost URL printed by Vite.

### Build

```powershell
npm run build
```

### Lint

```powershell
npm run lint
```

## Automated Tests

Run each test file:

```powershell
node --test .\src\tests\noteModel.test.mjs
node --test .\src\tests\noteRecorder.test.mjs
node --test .\src\tests\noteSequencer.test.mjs
```

Or run all matching tests:

```powershell
node --test .\src\tests\*.test.mjs
```

## Manual Testing

Verify:

1. All 88 notes and key classification.
2. Audible notes and eight-voice FIFO stealing.
3. Pointer, keyboard, and Stop All interactions.
4. Recording order, note duration, and delta timing.
5. Replay at 0.5x, 1x, and 2x.
6. Stop Sequence and unmount cancellation.
7. React.memo behavior using React DevTools Profiler.
8. Responsive behavior at 375px.
9. Keyboard accessibility and Lighthouse results.

## Project Structure

```text
src/
  audio/
    PianoSynth.ts
  components/
    PianoKey.tsx
    PianoKeyboard.tsx
    ReplayControls.tsx
  piano/
    noteModel.ts
    types.ts
  recording/
    NoteRecorder.ts
  sequencer/
    NoteSequencer.ts
  tests/
    noteModel.test.mjs
    noteRecorder.test.mjs
    noteSequencer.test.mjs
```

Additional component styles and testing utilities
are stored alongside their related source files.

## Engineering Notes

FIFO voice stealing and FIFO recording are different:

- Voice stealing removes the oldest active audio voice.
- Recording preserves the chronological order of note-on events.

Cancelling a JavaScript delay does not automatically stop
an existing Web Audio oscillator.

Replay cancellation must therefore cancel pending waits
and explicitly release replay-owned audio voices.

## Verification and Evidence

Actual test results, Lighthouse scores, Profiler evidence,
and Git commit references must be taken from local runs.

See TASK_DECOMPOSITION.md for task status and
AI_FAILURE_AUDIT.md for verified AI-generated failures.

## Scope

This is a client-side application.

No backend, database, authentication, or routing is required.
