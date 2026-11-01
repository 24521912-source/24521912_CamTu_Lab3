# TASK_DECOMPOSITION.md

# Lab 03 — Exercise 2: Interactive Scientist & Pioneer Directory

## 1. Project Overview

**Course:** UIT Web Application Development 2026  
**Lab:** Lab 03 — Production React 19  
**Exercise:** Exercise 2 — Interactive Scientist & Pioneer Directory

### Project Goal

Build a responsive, accessible Scientist Directory that allows users to search, filter, sort, delete, and reset scientist records.

The application must demonstrate correct React 19 state management, immutable updates, controlled inputs, derived state, stable list keys, and modern JavaScript array methods.

### Technology Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Semantic HTML5
- Modern CSS
- npm
- Git
- React DevTools Profiler

### Development Environment

- Windows
- Visual Studio Code
- PowerShell
- Manual code editing and verification

---

## 2. Working Agreement

This project follows **Contract-First Development** and an **Atomic AI Workflow**.

### 2.1 Human Responsibilities

The student is responsible for:

1. Creating and editing files manually in VS Code.
2. Copying and reviewing AI-generated code.
3. Running commands manually in PowerShell.
4. Testing each completed task.
5. Reviewing errors and fixing issues with AI assistance.
6. Creating Git commits after successful verification.
7. Writing `AI_FAILURE_AUDIT.md` independently.
8. Confirming task completion before proceeding.

### 2.2 AI Responsibilities

The AI assistant must:

1. Work on exactly one task at a time.
2. Explain the objective before implementation.
3. Provide complete code for each file that needs to be created or modified.
4. Always specify the exact file path.
5. Never execute commands or change files on the student's computer.
6. Provide verification instructions and expected results.
7. Diagnose screenshots and logs when errors occur.
8. Provide corrected code and retesting instructions.
9. Suggest a Conventional Commit after verification succeeds.
10. Stop after each task and wait for the student's confirmation.

The AI must not implement future tasks prematurely.

### 2.3 Definition of Done

A task is complete only when:

- Its acceptance criteria are satisfied.
- The student has completed the required verification.
- No known blocking errors remain.
- Modified files have been reviewed.
- An appropriate Conventional Commit has been created.
- The student explicitly confirms completion.

Documentation-only tasks must also be reviewed and committed.

---

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display a directory of scientists and pioneers. |
| FR-02 | Each record contains `id`, `name`, `age`, and `iq`. |
| FR-03 | Use stable IDs as React list keys. |
| FR-04 | Search scientists by name, case-insensitively. |
| FR-05 | Filter scientists by minimum IQ. |
| FR-06 | Read numeric IQ input using `valueAsNumber`. |
| FR-07 | Sort scientists by IQ or age using `.toSorted()`. |
| FR-08 | Delete an individual scientist. |
| FR-09 | Reset the directory to its original dataset. |
| FR-10 | Keep React state updates immutable. |
| FR-11 | Calculate `visiblePeople` as derived state during rendering. |
| FR-12 | Use controlled inputs and accessible labels. |
| FR-13 | Announce the result count with a live status output. |
| FR-14 | Support responsive layout at 375px viewport width. |
| FR-15 | Inspect render behavior using React DevTools Profiler. |

---

## 4. Technical Contracts

The contracts must be agreed upon before implementing components.

### 4.1 Scientist Data Contract

Each scientist must have:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique, stable record identifier |
| `name` | `string` | Scientist's display name |
| `age` | `number` | Scientist's age |
| `iq` | `number` | Scientist's IQ |

Rules:

- Each ID must be unique.
- IDs must remain stable during search and sorting.
- Never use array indexes as React keys.
- The initial dataset must be preserved for Reset.
- Each state update must produce a new array when records change.

### 4.2 Search Contract

- Search by `name`.
- Ignore capitalization.
- Allow partial matching.
- Ignore leading and trailing spaces in the search query.
- An empty search query matches all records.
- Search must not mutate the original dataset.

### 4.3 Minimum IQ Contract

- Use a controlled numeric input.
- Read the value using `valueAsNumber`.
- Use `Number.isNaN()` to handle an empty numeric input.
- An empty IQ input disables the minimum IQ filter.
- A valid minimum IQ includes scientists with `iq >= minimumIQ`.
- Filtering must not modify the source array.

### 4.4 Sorting Contract

- Use `.toSorted()`, not mutating `.sort()`.
- Support sorting by IQ and age.
- Initial sorting direction: descending.
- Sorting must not mutate the state array.
- Equal primary values must have deterministic ordering, using a stable secondary comparison where needed.
- The selected sorting option must be reflected in the interface.

### 4.5 State Management Contract

Source state:

- `people`
- `searchQuery`
- `minimumIQ`
- `sortBy`

Derived value:

- `visiblePeople`

`visiblePeople` must be calculated during render from the source state.

Do not store `visiblePeople` in `useState`.

Do not use `useEffect` for search, filtering, or sorting.

### 4.6 Delete and Reset Contract

Delete:

- Identify records using stable IDs.
- Remove only the selected record.
- Use immutable array updates.
- Do not affect the saved initial dataset.

Reset:

- Restore the original list of scientists.
- The default contract is to restore records, not automatically clear search, IQ filter, or sorting controls.
- Reset must remain safe when the directory is already at its initial state.

### 4.7 Accessibility Contract

- Inputs have visible labels.
- Labels are connected through `htmlFor` and React `useId()`.
- Buttons have meaningful accessible names.
- Result count uses `<output role="status" aria-live="polite">`.
- Keyboard users can access interactive controls.
- Focus indicators must remain visible.
- Layout supports narrow screens without horizontal overflow.

---

## 5. Task Decomposition

Tasks must be completed in the defined order.

## PHASE P — Planning & Contract-First

### P01 — Create Task Decomposition

**Objective:** Establish a complete, verifiable implementation plan.

**Files:**
- `TASK_DECOMPOSITION.md`

**Prerequisites:**
- Exercise 2 requirements are understood.
- Project rules are available.

**Acceptance Criteria:**
- Requirements are mapped to implementation tasks.
- Each task defines scope, dependencies, verification, and commit.
- Required feature commits remain separate.
- AI audit and final verification are included.
- No implementation code is written.

**Verification:**
- Review task coverage against slides 18–19.
- Confirm all three mandatory commit messages are present.
- Check that the plan respects the Atomic AI Workflow.

**Planned Commit:**
`docs(ex2): add task decomposition and implementation plan`

---

### P02 — Review Component and State Contracts

**Objective:** Finalize the TypeScript and state-management design before implementation.

**Files:**
- `TASK_DECOMPOSITION.md` (contract section, only if revisions are necessary)

**Prerequisites:**
- P01 completed and committed.

**Acceptance Criteria:**
- Scientist data fields and types are confirmed.
- State ownership is clearly described.
- Search, IQ filtering, and sorting contracts are unambiguous.
- Delete and Reset behavior is confirmed.
- Derived state is distinguished from source state.
- No React implementation is written.

**Verification:**
- Review example state transitions manually.
- Check that `visiblePeople` is derived rather than stored.
- Confirm no filter/sort `useEffect` is planned.

**Planned Commit:**
`docs(ex2): refine scientist data and state contracts`

Commit only if documentation changes.

---

## PHASE A — Project Setup & Data Normalization

### A01 — Initialize React 19 + TypeScript + Vite

**Objective:** Prepare the application environment.

**Files:**
- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/main.tsx`
- `src/App.tsx`
- `.gitignore`

**Prerequisites:**
- P02 completed.
- Node.js, npm, and Git are available.

**Acceptance Criteria:**
- React 19 and TypeScript are configured.
- Vite development server starts successfully.
- The application displays a working starter page.
- TypeScript and production builds succeed.
- Git repository is correctly initialized or verified.
- Existing project files are preserved when already initialized.

**Verification:**
- Run `npm install` if necessary.
- Run `npm run dev`.
- Run `npm run build`.
- Inspect browser console.
- Run `git status`.

**Planned Commit:**
`chore(ex2): initialize React TypeScript Vite project`

---

### A02 — Normalize Scientist Dataset with Stable IDs

**Objective:** Define the scientist schema and normalize initial records.

**Files:**
- `src/types/scientist.ts`
- `src/data/smartPeople.ts`
- `src/App.tsx`

**Prerequisites:**
- A01 completed and committed.
- Scientist contract approved.

**Acceptance Criteria:**
- Every scientist has `id`, `name`, `age`, and `iq`.
- Data is correctly typed.
- IDs are unique and stable.
- Original data is available for future Reset.
- Dataset is displayed in a minimal directory.
- React list rendering uses `key={person.id}`.
- No search, filter, sorting, delete, or reset features are implemented yet.

**Verification:**
- Check each record's required fields.
- Confirm IDs are unique.
- Verify the initial list renders.
- Check for missing-key warnings.
- Run `npm run build`.

**Planned Commit — Mandatory Feature Commit 1:**

`feat(ex2): normalize smartPeople schema with stable IDs`

---

## PHASE B — Search, Filtering & Sorting

### B01 — Implement Controlled Name Search

**Objective:** Add a case-insensitive name search.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- A02 completed and committed.

**Acceptance Criteria:**
- Search input is controlled by React state.
- Search matches names regardless of capitalization.
- Partial search works.
- Whitespace around the query is ignored.
- Empty search shows all records.
- Search results are derived during render.
- No `useEffect` or duplicate result state is introduced.
- Input is connected to an accessible label using `useId()`.

**Verification:**
- Search using lowercase and uppercase text.
- Test a partial name.
- Test leading/trailing spaces.
- Clear the search input.
- Check accessibility and browser console.

**Planned Commit:**
`feat(ex2): add controlled scientist name search`

---

### B02 — Implement Minimum IQ Filter

**Objective:** Add numeric minimum IQ filtering.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- B01 completed and committed.

**Acceptance Criteria:**
- IQ input is controlled.
- Numeric values are read using `valueAsNumber`.
- Empty input is handled with `Number.isNaN()`.
- Valid values filter records inclusively.
- Search and IQ filtering work together.
- Filtering uses derived state.
- Input is correctly labeled using `useId()`.

**Verification:**
- Test empty IQ input.
- Test an IQ equal to a record's IQ.
- Test minimum IQ higher than all records.
- Test search and IQ filter together.
- Check React state behavior.
- Run `npm run build`.

**Planned Commit:**
`feat(ex2): add controlled minimum IQ filter`

---

### B03 — Implement Non-Mutating Sorting

**Objective:** Add sorting by IQ or age.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- B02 completed and committed.

**Acceptance Criteria:**
- Sorting supports IQ and age.
- Sorting uses `.toSorted()`.
- Default direction is descending.
- Equal values have deterministic ordering.
- Search, IQ filtering, and sorting compose correctly.
- The source state array remains unchanged.
- Sorting is derived during rendering.
- No filter/sort `useEffect` is used.

**Verification:**
- Verify IQ descending order.
- Verify age descending order.
- Switch between sorting modes.
- Confirm search/filter results remain correct.
- Verify original array ordering is unchanged.
- Run `npm run build`.

**Planned Commit:**
`feat(ex2): add search, IQ filter & toSorted`

**Important:** This is mandatory feature commit 2. The message is preserved exactly as required by the exercise, although earlier commits independently introduce search and IQ filtering.

---

## PHASE C — Delete, Reset & Live Status

### C01 — Implement Delete by Stable ID

**Objective:** Allow users to remove individual scientists.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- B03 completed and committed.

**Acceptance Criteria:**
- Each scientist has a Delete button.
- Each button identifies the correct scientist.
- Deleting removes exactly one matching record.
- State is updated immutably.
- Search/filter/sort remain functional.
- Deleting the last record does not crash the application.
- Buttons have clear accessible names.

**Verification:**
- Delete the first visible scientist.
- Delete a scientist from filtered results.
- Confirm other records remain unchanged.
- Delete all records and inspect empty state.
- Run `npm run build`.

**Planned Commit:**
`feat(ex2): delete scientists by stable ID`

---

### C02 — Implement Reset to Original Dataset

**Objective:** Restore the original scientist records.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- C01 completed and committed.

**Acceptance Criteria:**
- Reset restores all original records.
- Original record IDs and values are preserved.
- Reset works after one or multiple deletions.
- Reset works after deleting every record.
- Search, IQ, and sort controls remain unchanged.
- Reset does not mutate initial data.

**Verification:**
- Delete one record and Reset.
- Delete several records and Reset.
- Delete all records and Reset.
- Repeat Reset multiple times.
- Verify that search/filter controls retain their values.

**Planned Commit:**
`feat(ex2): restore original scientist dataset on reset`

---

### C03 — Implement Live Result Status

**Objective:** Make result counts accessible and provide clear empty states.

**Files:**
- `src/App.tsx`
- `src/App.module.css` (if needed)

**Prerequisites:**
- C02 completed and committed.

**Acceptance Criteria:**
- Visible result count reflects `visiblePeople.length`.
- Count updates after search, filtering, deletion, and Reset.
- Status uses `<output role="status" aria-live="polite">`.
- Zero results display a useful empty-state message.
- Status does not create unnecessary source state.
- No unnecessary effects are introduced.

**Verification:**
- Check result count on initial render.
- Search until zero matches remain.
- Change IQ filtering.
- Delete records.
- Reset records.
- Inspect output semantics using browser DevTools.

**Planned Commit — Mandatory Feature Commit 3:**

`feat(ex2): add delete/reset & live status`

**Important:** This is mandatory feature commit 3. Its message remains unchanged even though Delete and Reset are developed as smaller tasks beforehand.

---

## PHASE D — Responsive Design & Accessibility

### D01 — Refine Responsive CSS Modules

**Objective:** Make the directory usable on desktop and mobile.

**Files:**
- `src/App.module.css`
- `src/index.css`
- `src/App.tsx` (only if necessary)

**Prerequisites:**
- C03 completed and committed.

**Acceptance Criteria:**
- Layout uses CSS Modules for component styles.
- Mobile-first layout is supported.
- Controls remain usable at 375px width.
- Long names do not break the layout.
- No unintended horizontal scrolling occurs.
- Buttons and inputs remain readable.
- Desktop layout uses available space effectively.

**Verification:**
- Test viewport width at 375px.
- Test at a wider desktop viewport.
- Inspect overflow and wrapping.
- Test long names.
- Check CSS Module class usage.

**Planned Commit:**
`style(ex2): improve responsive scientist directory layout`

---

### D02 — Verify Accessibility and Keyboard Interaction

**Objective:** Ensure meaningful accessibility across directory interactions.

**Files:**
- `src/App.tsx` (only if fixes are required)
- `src/App.module.css` (only if fixes are required)

**Prerequisites:**
- D01 completed and committed.

**Acceptance Criteria:**
- Interactive controls have accessible names.
- Inputs have properly associated labels.
- Keyboard navigation works.
- Focus indicators remain visible.
- Live status uses correct semantics.
- No obvious contrast or layout issues remain.
- Native HTML semantics are preferred.

**Verification:**
- Navigate using Tab and Shift+Tab.
- Activate controls with the keyboard.
- Check accessibility tree using browser DevTools.
- Inspect live status semantics.
- Review contrast and focus behavior.

**Planned Commit:**
`fix(ex2): resolve accessibility and keyboard issues`

Commit only if files are modified. Otherwise record PASS in the final verification summary.

---

## PHASE V — Performance, Quality & Submission

### V01 — Verify Derived State and Immutable Updates

**Objective:** Confirm the implementation follows React state-management requirements.

**Files:**
- Existing source files (review only; modify if defects are found)

**Prerequisites:**
- D02 completed.

**Acceptance Criteria:**
- `visiblePeople` is calculated during render.
- `visiblePeople` is not stored in `useState`.
- No filtering/sorting happens inside `useEffect`.
- `.toSorted()` is used for sorting.
- Delete creates a new array.
- Stable IDs are used for React list keys.
- No accidental state mutation is detected.
- Combined search/filter/sort/delete/reset behavior is correct.

**Verification:**
- Review source code.
- Test combinations of search, IQ filtering, and sorting.
- Check delete/reset behavior.
- Run production build.

**Planned Commit:**
`fix(ex2): enforce immutable derived state behavior`

Commit only if fixes are necessary.

---

### V02 — React DevTools Profiler Review

**Objective:** Inspect component rendering and identify unnecessary render work.

**Files:**
- Existing React source files (if optimization is justified)
- `VERIFICATION_REPORT.md` (record observations)

**Prerequisites:**
- V01 completed.

**Acceptance Criteria:**
- React DevTools Profiler is used.
- Search, IQ input, sorting, deletion, and Reset are profiled.
- Student can explain why the component renders.
- Avoidable redundant state or effects are absent.
- No optimization is introduced without a concrete reason.
- Profiler observations are documented.

**Verification:**
- Record profiling sessions.
- Change each interactive input.
- Review component commits/renders.
- Explain expected and potentially unnecessary renders.
- Compare before/after measurements if optimization is performed.

**Planned Commit:**
`docs(ex2): document React profiler findings`

If an actual code optimization is required, implement and verify it separately before committing the corresponding change.

---

### V03 — Final Functional, Responsive & Build Verification

**Objective:** Complete the final acceptance checks before submission.

**Files:**
- `VERIFICATION_REPORT.md`
- Existing project files (only when a fix is needed)

**Prerequisites:**
- V02 completed and committed.

**Acceptance Criteria:**
- All functional requirements pass.
- Search/filter/sort combinations work.
- Delete and Reset work in edge cases.
- Result status updates accurately.
- Keyboard interaction passes.
- 375px layout passes.
- Build succeeds.
- Browser console has no unresolved application errors.
- Required commits exist.
- Git working tree is clean after final commit.

**Verification:**
- Execute final manual test matrix.
- Run `npm run build`.
- Run `git log --oneline`.
- Run `git status`.
- Capture requested submission screenshots.
- Complete the verification report.

**Planned Commit:**
`docs(ex2): finalize verification and submission checklist`

---

## 6. AI Failure Audit Protocol

**File:** `AI_FAILURE_AUDIT.md`

This file must be authored by the student, not generated as completed entries by AI.

### 6.1 When an Error Occurs

1. Record the task in progress.
2. Preserve the relevant prompt and original AI-generated code.
3. Capture the actual error message or behavior.
4. Send the error details to AI for diagnosis.
5. Apply and verify the correction manually.
6. Determine whether the issue was genuinely caused by AI.
7. Write the audit entry independently if applicable.

### 6.2 AI Must Ask the Student

After the student fixes an issue, the AI must prompt them to consider:

- What exact prompt produced the problematic output?
- Which AI-generated code caused the issue?
- What failed and how did the failure appear?
- What screenshot, log, or test result proves it?
- What was the root cause?
- Why was the original AI response insufficient?
- What code or configuration did you change?
- How did you retest the corrected implementation?
- Which Git commit contains the correction?

The AI may explain these questions but must not fabricate evidence or write a completed audit entry.

### 6.3 Audit Integrity Rules

- Never invent AI failures.
- Do not classify ordinary typing mistakes as AI failures automatically.
- Do not manufacture screenshots or logs.
- Do not record unverified fixes as successful.
- Keep failed and successful outcomes distinguishable.
- Use real Git commit references.
- Preserve the student's own analysis and wording.

If no genuine AI failure occurred, explicitly state this rather than fabricating entries.

---

## 7. Mandatory Feature Commit Checkpoints

The three required commit messages must appear exactly in Git history:

| Checkpoint | Task | Required Commit |
|---|---|---|
| 1 | A02 | `feat(ex2): normalize smartPeople schema with stable IDs` |
| 2 | B03 | `feat(ex2): add search, IQ filter & toSorted` |
| 3 | C03 | `feat(ex2): add delete/reset & live status` |

These commits must not be squashed or replaced.

Earlier atomic commits may implement individual subfeatures, while the mandatory checkpoints verify the completed feature groups.

All commits must correspond to actual changes.

---

## 8. Final Acceptance Test Matrix

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| T01 | Load application | Original directory displays |
| T02 | Inspect scientist records | All required fields exist |
| T03 | Inspect list keys | Stable IDs are used |
| T04 | Search with lowercase query | Case-insensitive matches appear |
| T05 | Search with uppercase query | Same matching results |
| T06 | Search with surrounding whitespace | Search still works |
| T07 | Clear search | All eligible records return |
| T08 | Enter minimum IQ | Only qualifying records remain |
| T09 | Clear IQ input | IQ filter is disabled |
| T10 | Search and IQ filter together | Both conditions apply |
| T11 | Sort by IQ | Descending IQ order |
| T12 | Sort by age | Descending age order |
| T13 | Sort records with equal primary values | Deterministic order |
| T14 | Switch sorting repeatedly | Original state remains unchanged |
| T15 | Delete a scientist | Only selected record disappears |
| T16 | Delete scientist from filtered list | Correct stable ID is deleted |
| T17 | Delete all scientists | No crash; empty state appears |
| T18 | Reset after deletion | Original records return |
| T19 | Reset while filters are active | Records restore; controls persist |
| T20 | Inspect result output | Count is accurate and live |
| T21 | Inspect source state | No duplicate visible results state |
| T22 | Inspect effect usage | No filtering/sorting effects |
| T23 | Inspect sort implementation | Uses `.toSorted()` |
| T24 | Navigate using keyboard | Interactive controls remain usable |
| T25 | Inspect narrow viewport at 375px | No horizontal overflow |
| T26 | Use React DevTools Profiler | Render behavior can be explained |
| T27 | Run production build | Build succeeds |
| T28 | Review required Git commits | All three checkpoint commits exist |
| T29 | Inspect audit file | Entries are student-authored and evidence-based |
| T30 | Check Git status after final commit | Working tree is clean |

---

## 9. Execution Order

P01 → P02 → A01 → A02 → B01 → B02 → B03 → C01 → C02 → C03 → D01 → D02 → V01 → V02 → V03

**Total: 15 tasks across 5 phases.**

### Progress Tracking

- [ ] P01 — Create Task Decomposition
- [ ] P02 — Review Component and State Contracts
- [ ] A01 — Initialize React 19 + TypeScript + Vite
- [ ] A02 — Normalize Scientist Dataset with Stable IDs
- [ ] B01 — Implement Controlled Name Search
- [ ] B02 — Implement Minimum IQ Filter
- [ ] B03 — Implement Non-Mutating Sorting
- [ ] C01 — Implement Delete by Stable ID
- [ ] C02 — Implement Reset to Original Dataset
- [ ] C03 — Implement Live Result Status
- [ ] D01 — Refine Responsive CSS Modules
- [ ] D02 — Verify Accessibility and Keyboard Interaction
- [ ] V01 — Verify Derived State and Immutable Updates
- [ ] V02 — React DevTools Profiler Review
- [ ] V03 — Final Functional, Responsive & Build Verification

---

## 10. Task Execution Template

For each future task, the AI assistant should respond in this order:

1. **Current Task:** ID and title.
2. **Goal:** What will be completed.
3. **Prerequisites:** What must already exist.
4. **Files:** Exact paths to create or modify.
5. **Implementation:** Complete code for each affected file.
6. **Explanation:** Short description of the essential concepts.
7. **Verification:** Manual commands and test steps.
8. **Expected Result:** Observable success conditions.
9. **Troubleshooting:** Guidance when verification fails.
10. **AI Audit Reminder:** Ask whether a genuine AI failure occurred after fixing an issue.
11. **Commit:** Exact Conventional Commit message once verified.
12. **Stop:** Wait for explicit student confirmation.

No automatic progression to the next task.

---

## 11. Submission Readiness

The exercise is ready for submission only when:

- All 15 tasks have been completed or explicitly verified as not requiring modifications.
- All required functional requirements are satisfied.
- The React implementation respects the agreed contracts.
- The 375px layout is verified.
- React DevTools profiling has been performed.
- Mandatory Git commits are present.
- The AI failure audit accurately reflects real events.
- The final verification report is complete.
- No unresolved errors remain.
- Git working tree is clean.

**Final rule:** The student controls implementation, verification, documentation, and commits. AI provides guidance, code suggestions, debugging assistance, and review only.