
# Production Studio Drum Kit

## Overview

Production Studio Drum Kit is a browser-based electronic
percussion instrument built with React 19, TypeScript,
Vite, CSS Modules, and the Web Audio API.

The application provides seven playable drum pads,
physical keyboard shortcuts, accessible native buttons,
a recent-hit history, and estimated visual intensity
feedback.

This project was developed for Web Application
Development — UIT 2026, Lab 03, Homework 1.

## Technology Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Web Audio API
- HTML5 semantic elements
- Git

## Features

### Seven Drum Pads

| Key | Instrument | Physical code |
|-----|------------|---------------|
| W | Kick Drum | KeyW |
| A | Snare Drum | KeyA |
| S | Closed Hi-Hat | KeyS |
| D | Open Hi-Hat | KeyD |
| J | Hand Clap | KeyJ |
| K | Tom Drum | KeyK |
| L | Crash Cymbal | KeyL |

The shortcuts use KeyboardEvent.code rather
than the deprecated keyCode property.

### Audio Engine

The audio engine synthesizes percussion sounds
using the Web Audio API.

It uses oscillator-based tones, filtered noise,
gain envelopes, and controlled playback durations.

Audio initialization is performed after a user
interaction, following browser autoplay restrictions.

The application manages AudioContext and audio
resources through explicit lifecycle cleanup.

The sounds are synthesized approximations rather
than recordings of physical instruments.

### Keyboard Interaction

The application implements:

- Global keydown and keyup handling
- Protection against repeated keydown events
- Physical-key mapping
- Input, textarea, select, and editable isolation
- IME composition protection
- Modifier-key filtering
- Focus-loss cleanup
- Removal of global listeners on unmount

### Accessible Drum Pads

Each pad uses a native button with:

- An accessible name
- A visible keyboard shortcut
- aria-pressed state
- Keyboard focus indication
- Pointer interaction
- Enter and Space activation

### Hit History

The interface displays the eight most recent hits.

Each history entry has a stable identifier and
shows the instrument name and keyboard shortcut.

A polite live region provides grouped announcements
to reduce excessive screen-reader notifications.

### Visual Intensity Meter

The meter displays a predefined estimated activity
value for each instrument.

It returns to zero after a short period of inactivity.

This visualization does not measure calibrated
sound-pressure levels or physical dB SPL.

### Responsive Interface

The layout adapts to desktop, tablet, and mobile
viewports, including a width of 375 CSS pixels.

The interface includes reduced-motion support,
visible focus indicators, and semantic HTML.

## Getting Started

### Prerequisites

Install Node.js and npm.

A modern browser with Web Audio API support
is required.

### Installation

Open a terminal in the Homework1 directory.

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the local URL displayed by Vite.

### Production Build

```powershell
npm run build
```

### Lint

```powershell
npm run lint
```

### TypeScript Validation

```powershell
npx tsc -p tsconfig.app.json --noEmit
```

## How to Play

1. Open the application in a browser.
2. Click any drum pad to activate audio.
3. Use W, A, S, D, J, K, and L to play drums.
4. Release a key to reset its pressed state.
5. Use Tab and Shift+Tab to navigate the pads.
6. Use Enter or Space on a focused pad.
7. Observe Hit History and Visual Intensity.

## Project Structure

```text
src/
  App.tsx
  index.css
  drum/
    drum.types.ts
    drum.config.ts
    DrumKit.tsx
    DrumPad.tsx
    DrumFeedback.tsx
    DrumKit.module.css
    audio/
      drumAudio.ts
    hooks/
      useDrumKeyboard.ts
```

### Main Responsibilities

- drum.types.ts: TypeScript contracts
- drum.config.ts: Pad configuration and key mappings
- drumAudio.ts: Sound generation and audio cleanup
- useDrumKeyboard.ts: Physical keyboard handling
- DrumPad.tsx: Semantic drum button
- DrumKit.tsx: State and component coordination
- DrumFeedback.tsx: History and intensity feedback
- DrumKit.module.css: Responsive component styling

## Testing Strategy

The project uses manual browser validation together
with TypeScript, build, lint, and accessibility checks.

### Functional Checks

- Seven distinct drum sounds
- Mouse and keyboard interaction
- keydown and keyup behavior
- No repeated hits from held shortcut keys
- Input and IME isolation
- Modifier-key filtering
- Focus-loss recovery
- Audio lifecycle cleanup
- Recent-hit history capped at eight entries
- Visual meter updates and reset

### Accessibility Checks

- Keyboard-only navigation
- Native button semantics
- Accessible names
- aria-pressed values
- Screen-reader live region
- Meter semantics
- Visible focus indicators
- Color contrast
- Reduced-motion support
- Responsive layout
- Lighthouse Accessibility audit

Lighthouse results must be recorded from actual
browser measurements.

A Lighthouse score of 100 does not independently
prove complete WCAG 2.2 AA conformance.

## Known Design Limitations

- Audio uses synthesized sounds rather than samples.
- The intensity meter displays estimated values.
- Hit history is held in memory and is not persisted.
- Audio requires browser support and a user gesture.
- Results may vary across browsers and audio devices.
- Accessibility requires both automated and manual
  verification.

## Development Workflow

The project follows a Contract-First workflow.

Tasks are documented in TASK_DECOMPOSITION.md.

Each completed task is verified and committed
separately using Conventional Commits.

Verified AI-originated failures, when present,
are documented by the student in AI_FAILURE_AUDIT.md.

## Scope

This homework implements the seven-pad drum kit.

It does not implement the 88-key piano, PUBG Arena,
backend services, user authentication, or music export.
```
