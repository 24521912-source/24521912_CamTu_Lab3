
# KRAFTON x PUBG Vietnam Championship & Airdrop Arena

UIT Web Application Development 2026  
Lab 03 — Homework 3

## 1. Project Overview

This project is an educational React application that simulates a PUBG Vietnam Championship airdrop arena.

The application combines absolute-time countdowns, an explicit drop state machine, optimistic inventory updates, deterministic mock claim responses, and a filterable PUBG squad leaderboard.

All inventory values, prices, team scores, claim responses, and event times are simulated.

This application is not an official PUBG or KRAFTON service. It does not sell tickets, issue rewards, process payments, or contact a real purchase API.

## 2. Technology Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- React functional components and hooks
- Native HTML controls
- Git

The application does not require a backend service or database.

## 3. Main Features

### 3.1 Anti-Drift Countdown

The countdown uses an absolute deadline instead of decrementing a counter.

```typescript
Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs))
```

- `targetEpochMs` is the target Unix timestamp in milliseconds.
- `serverOffsetMs` is server time minus client time, measured in milliseconds.
- Positive server offset means that the simulated server clock is ahead.
- Remaining time is clamped to zero.
- The countdown recalculates when the browser tab becomes visible.
- Timer intervals and event listeners are cleaned up.

The current project uses simulated time offsets for demonstration rather than synchronizing with a real server.

### 3.2 Drop Finite State Machine

The application models four drop phases:

| Phase | Meaning |
|---|---|
| WARMUP | The drop has not opened |
| AIRDROP_LIVE | The drop is open and inventory is available |
| LOOTED_OUT | Simulated inventory has been depleted |
| EXPIRED | The simulated claim window has ended |

Drop phase transitions are validated by domain functions.

The integrated interface reconstructs a phase from the current demo snapshot, using the domain FSM transition rules.

A snapshot reconstruction is not a real backend event history.

### 3.3 Demo Tickets and Crates

The application includes:

- PVS Grand Finals VIP Ticket
- G-Coin Crate

Each item has a stable ID, title, VND price, simulated inventory, opening timestamp, and expiration timestamp.

Prices are formatted using `Intl.NumberFormat('vi-VN')`.

The inventory and prices are not verified commercial data.

### 3.4 Optimistic Mock Claims

The application uses a deterministic local mock service.

Supported mock outcomes:

| Outcome | Expected behavior |
|---|---|
| Success | Keep the optimistic stock decrement and show a demo confirmation |
| 409 Conflict | Restore the decremented unit and show a conflict message |
| 503 Service Error | Restore the decremented unit and show an error message |

The claim controller:

- Updates displayed inventory optimistically.
- Uses a synchronous per-item in-flight guard.
- Prevents duplicate pending claims for the same item.
- Allows independent claims for different items.
- Uses immutable React state updates.
- Supports request cancellation with AbortController.
- Ignores stale results after scenario reset.
- Prevents stale requests from updating state after unmount.

No real network request or payment transaction occurs.

### 3.5 PUBG Squad Leaderboard

The demo leaderboard includes:

- The Expendables
- Cerberus Esports
- Roy Esports
- AGG

It supports:

- Squad name search
- Minimum WWCD filtering
- Sorting by total points
- Sorting by WWCD
- Sorting by placement points
- Sorting by kill points
- Deterministic tie breakers
- Empty-state handling
- Resetting filters

Demo total points are calculated as:

```typescript
placementPts + killPts
```

WWCD is displayed separately.

The sorting and tie-breaking rules are educational implementation choices, not official PUBG tournament regulations.

### 3.6 Accessibility and Responsive Design

The interface is designed around WCAG 2.2 AA-oriented practices, including:

- Semantic HTML
- Labeled form controls
- Keyboard-operable interactions
- Visible focus indicators
- Text-based status messages
- Accessible claim error feedback
- Reduced-motion support
- Responsive layouts
- A separately scrollable leaderboard table on narrow screens

Automated Lighthouse results do not by themselves establish complete WCAG conformance.

## 4. Installation and Local Development

### Requirements

- Node.js
- npm
- A modern web browser

### Install Dependencies

Open a terminal in the Homework3 directory:

```powershell
npm install
```

### Start Development Server

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

### Preview Production Build

```powershell
npm run preview
```

Use the URL printed by Vite.

## 5. Demo Instructions

### Scenario 1 — Airdrop Phases

Use the Demo scenario selector to inspect:

- Scheduled
- Airdrop Live
- Last Unit
- Sold Out
- Expired

These scenarios simulate time and inventory conditions without a backend.

### Scenario 2 — Successful Claim

1. Choose Airdrop Live.
2. Select the Success mock outcome.
3. Click Simulate claim on an available item.
4. Observe the immediate inventory decrement.
5. Observe the confirmed simulated result.

### Scenario 3 — 409 Conflict Rollback

1. Reset to Airdrop Live.
2. Choose 409 Conflict.
3. Start a claim.
4. Observe the optimistic decrement.
5. Observe inventory restoration after the mock response.

### Scenario 4 — Final Inventory Unit

1. Choose Last Unit.
2. Choose Success or 409 Conflict.
3. Start a claim.
4. Verify the transition to Sold Out when inventory reaches zero.
5. For 409, verify the rollback restores inventory and claimability.

### Scenario 5 — Duplicate Claim Protection

1. Choose Airdrop Live.
2. Start a claim.
3. Attempt repeated activation before the mock response completes.
4. Verify only one pending request is accepted for that item.

### Scenario 6 — Leaderboard

1. Search for a squad name.
2. Apply the minimum WWCD filter.
3. Sort by placement or kill points.
4. Inspect the resulting order.
5. Clear the filters.

## 6. Testing Strategy

The project includes deterministic checks for:

- Domain contracts and FSM transitions
- Absolute-time countdown calculations
- Leaderboard filtering and sorting
- Scenario snapshots and integration behavior

These checks can be imported and executed through the browser Console while the Vite development server is running.

Manual verification covers:

- Claim success and rollback
- Double-claim protection
- Concurrent claims across different items
- Scenario cancellation
- Background-tab countdown behavior
- Keyboard navigation
- Narrow-screen layout
- Accessible status messages
- Browser Console errors

Build and lint checks are performed using the npm scripts provided by the project.

Verification evidence and measured Lighthouse results should be recorded from actual local test runs.

## 7. Project Structure

Important source locations:

- `src/App.tsx` — arena composition and demo controls
- `src/features/arena/domain/` — contracts, demo data, FSM, sorting, and deterministic checks
- `src/features/arena/hooks/` — countdown and claim hooks
- `src/features/arena/services/` — deterministic mock claim service
- `src/features/arena/components/` — accessible airdrop cards and leaderboard
- `src/features/arena/Arena.module.css` — arena layout styles

Project documentation:

- `README.md`
- `TASK_DECOMPOSITION.md`
- `AI_FAILURE_AUDIT.md`
- `project_rules.md`

## 8. Engineering Workflow

The implementation was organized into atomic development tasks documented in TASK_DECOMPOSITION.md.

Each completed task required local verification, a task status update, and a Git commit.

AI-generated code and instructions were reviewed through compilation, linting, manual tests, and deterministic checks.

Confirmed AI-generated failures are documented separately in AI_FAILURE_AUDIT.md using personally recorded evidence.

The Git history is the authoritative record of completed commits.

## 9. Known Limitations

- No real backend or authenticated user accounts.
- No real ticket purchases, G-Coin deliveries, or payment processing.
- No verified live PUBG tournament results.
- No authoritative real-time stock synchronization.
- Mock claim results are selected explicitly for repeatable testing.
- Demo time offsets do not provide real server clock synchronization.
- The countdown uses the browser clock and a simulated offset.
- The domain checks do not replace full browser end-to-end or real-backend concurrency testing.
- Accessibility testing is limited to the tools, browsers, and manual checks actually performed.

## 10. Academic Purpose

This application is a coursework demonstration for UIT Web Application Development 2026.

KRAFTON and PUBG names are used to describe the assignment theme. This project is not presented as an official KRAFTON or PUBG product.
