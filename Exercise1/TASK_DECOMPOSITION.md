
# TASK DECOMPOSITION
## Lab 03 — Exercise 1: Semantic Engineer & Pro-Gamer Profile Card

**Course:** Web Application Development — UIT  
**Technology:** React 19 + TypeScript + Vite + CSS Modules  
**Environment:** Windows, VS Code, PowerShell, npm, Git  
**Development method:** Contract-First + Atomic Task Development

---

## 1. Project Objective

Build a responsive, accessible profile card for a developer or
professional gamer using React 19.

The application must demonstrate:

- Pure functional React components.
- TypeScript interfaces and typed props.
- ES6 default parameter values.
- Semantic HTML without div soup.
- Reusable SkillBadge components.
- Stable React keys.
- Object.entries() for statistics.
- CSS Modules and CSS Custom Properties.
- Responsive layout at 375px.
- Secure HTTPS avatar with fallback initials.
- Accessibility inspection using Chrome DevTools.
- Independent verification and atomic Git commits.

The implementation must stay within Exercise 1 scope.

Do not add APIs, databases, authentication, state machines,
third-party UI libraries, or unrelated features.

---

## 2. Mandatory Development Rules

1. Implement exactly one task at a time.
2. Follow project-rules.md.
3. Define TypeScript contracts before implementing components.
4. The AI provides complete code and instructions in chat.
5. The student manually creates, edits, runs, and commits.
6. Never execute commands or modify the repository automatically.
7. Verify each implementation before committing.
8. Do not proceed to the next task before the current task is
   verified and committed.
9. Do not claim PASS without actual verification.
10. Avoid unnecessary dependencies or architecture complexity.
11. Use Conventional Commits.
12. Preserve the two required Exercise 1 commits exactly.

For an existing Git repository, a documentation task must
also be committed after verification.

For a project without Git, defer the P01 documentation commit
until A01 initializes the repository.

---

## 3. Planned Project Structure

lab03-exercise1-profile-card/
|-- project-rules.md
|-- TASK_DECOMPOSITION.md
|-- package.json
|-- index.html
|-- src/
|   |-- main.tsx
|   |-- App.tsx
|   |-- index.css
|   |-- components/
|   |   |-- DeveloperCard.tsx
|   |   |-- DeveloperCard.module.css
|   |   |-- SkillBadge.tsx
|   |   |-- SkillBadge.module.css
|   |-- types/
|       |-- profile.ts

Additional Vite-generated configuration files are allowed.

---

## 4. Task Breakdown

### P01 — Create Exercise 1 Task Decomposition

**Status:** NOT STARTED

**Goal:**
Create a clear implementation plan before writing React code.

**Files:**
- TASK_DECOMPOSITION.md

**Prerequisites:**
- Read project-rules.md.
- Understand Exercise 1 requirements.

**Work:**
- Identify all mandatory requirements.
- Define the project structure.
- Divide development into atomic tasks.
- Specify dependencies, verification, and commit milestones.
- Preserve the instructor's required feature and styling commits.

**Acceptance Criteria:**
- Every Exercise 1 requirement is covered.
- Tasks are ordered by dependency.
- Every task identifies affected files.
- Every task includes verification and commit policy.
- No implementation code is written.

**Verification:**
- Review the entire Markdown document.
- Confirm both instructor-required commit messages are present.
- Confirm no unnecessary features have been introduced.
- Confirm the file is saved at the project root.

**Commit:**
docs(ex1): add task decomposition

Only commit now if a Git repository already exists.
Otherwise, include the document in A01's initial commit.

---

### A01 — Initialize React 19 + TypeScript + Vite

**Status:** NOT STARTED

**Goal:**
Prepare a working React 19 development environment.

**Files:**
- package.json
- index.html
- src/main.tsx
- src/App.tsx
- src/index.css
- Vite and TypeScript configuration files
- .gitignore
- project-rules.md
- TASK_DECOMPOSITION.md

**Prerequisites:**
- P01 completed.
- Node.js, npm, VS Code, and Git available.

**Work:**
- Initialize a Vite project with React and TypeScript.
- Verify the installed React version is 19.
- Install dependencies.
- Keep a minimal working starter application.
- Use createRoot and StrictMode.
- Check Git repository initialization.
- Preserve project-rules.md and TASK_DECOMPOSITION.md.
- Avoid additional UI libraries.

**Acceptance Criteria:**
- npm dependencies install successfully.
- React 19 is installed.
- Development server starts successfully.
- Starter application renders.
- TypeScript build succeeds.
- Git repository exists.
- Documentation files are preserved.

**Verification:**
- npm list react react-dom
- npm run dev
- npm run build
- npm run lint
- git status
- git diff --check

Run lint only if the project has the corresponding script.

**Commit:**
chore(ex1): initialize React 19 TypeScript Vite project

If P01 was not previously committed, include its
documentation in this initial commit.

---

### A02 — Define TypeScript Component Contracts

**Status:** NOT STARTED

**Goal:**
Define component input contracts before implementation.

**Files:**
- src/types/profile.ts

**Prerequisites:**
- A01 completed and committed.

**Work:**
- Define a Skill type containing:
  - Stable ID.
  - Display name.
  - Skill level or tier.
- Define SkillBadgeProps.
- Define DeveloperCardProps containing:
  - Name.
  - Role.
  - Avatar URL.
  - Statistics.
  - Skill list.
- Decide which props can use default parameter values.
- Define a clear statistics data structure.
- Specify avatar fallback behavior.
- Specify stable keys for lists and Fragment groups.

**Acceptance Criteria:**
- TypeScript types describe the required data.
- No unnecessary fields or complex abstractions.
- No use of any/unsafe typing without justification.
- Props support the planned UI.
- No component UI is implemented in this task.

**Verification:**
- Review types and exported interfaces.
- npm run build
- git diff --check
- Confirm contracts cover all required props.

**Commit:**
chore(ex1): define profile component contracts

---

### B01 — Implement Semantic DeveloperCard and SkillBadge

**Status:** NOT STARTED

**Goal:**
Create both required React components and render a working
semantic profile card.

This is the main functionality milestone.

**Files:**
- src/components/DeveloperCard.tsx
- src/components/SkillBadge.tsx
- src/App.tsx
- src/types/profile.ts (only if a justified correction is needed)

**Prerequisites:**
- A02 completed and committed.

**Work:**
- Create pure functional DeveloperCard.
- Create reusable pure functional SkillBadge.
- Pass profile information through typed props.
- Use ES6 default parameter values when appropriate.
- Render a semantic article.
- Use header, hgroup, headings, dl, dt, dd, ul, and li.
- Use React Fragment where appropriate.
- Use Object.entries() to render statistics.
- Use stable statistics keys for Fragment groups.
- Use skill.id as the React key.
- Display name, role, statistics, skills, and avatar.
- Use an HTTPS avatar URL.
- Declare explicit avatar width and height.
- Implement initials fallback on image load failure.
- Prevent repeated broken-image rendering.
- Connect aria-labelledby to the card heading.
- Use suitable alt text.
- Keep App.tsx as the page entry that renders the card.
- Do not use div elements inside DeveloperCard.

Do not implement the final responsive CSS Modules styling
in this task. That belongs to C01.

**Acceptance Criteria:**
- Both components render successfully.
- No div tags exist inside DeveloperCard.tsx.
- Profile content is passed through props.
- Statistics render through Object.entries().
- Statistics are represented by description-list elements.
- Skills render through SkillBadge with stable IDs.
- Avatar works and falls back to initials when broken.
- Semantic heading and aria-labelledby are correct.
- No unnecessary effects or hooks.
- No React key warnings.
- TypeScript build succeeds.

**Verification:**
- npm run dev
- npm run build
- npm run lint (if configured)
- Inspect browser console.
- Inspect Elements tab in Chrome DevTools.
- Inspect the article, heading, dl, and ul structure.
- Test avatar failure by changing its URL to
  an invalid HTTPS URL temporarily.
- Restore the valid avatar URL before committing.
- Search DeveloperCard.tsx for "<div".
- Search source files for insecure media URLs.
- Review git diff and git diff --check.

PowerShell audit commands:

Select-String -Path "src/components/DeveloperCard.tsx" -Pattern '<div'

Select-String -Path "src/**/*.tsx" -Pattern 'http://'

Expected:
- Zero matches for prohibited div tags.
- Zero insecure media URLs in authored JSX/TSX.

**Required Commit:**
feat(ex1): implement semantic DeveloperCard and SkillBadge

This commit message must remain exactly as specified.

---

### C01 — Implement Responsive CSS Modules

**Status:** NOT STARTED

**Goal:**
Apply clean, responsive styling without changing the
semantic structure or component behavior.

**Files:**
- src/components/DeveloperCard.module.css
- src/components/SkillBadge.module.css
- src/components/DeveloperCard.tsx
- src/components/SkillBadge.tsx
- src/index.css
- src/App.tsx (only if required for page layout)

**Prerequisites:**
- B01 completed and committed.

**Work:**
- Create CSS Modules for the two components.
- Import module classes into components.
- Use CSS Custom Properties for shared design values.
- Implement mobile-first layout.
- Support viewport width of 375px.
- Add suitable spacing, typography, and visual hierarchy.
- Style the avatar and fallback initials consistently.
- Style statistics and skill badges.
- Prevent text and skill lists from causing overflow.
- Preserve semantic HTML and accessibility.
- Avoid inline styles and unnecessary global selectors.
- Avoid Bootstrap, Tailwind, and other UI frameworks.

**Acceptance Criteria:**
- CSS Modules work correctly.
- Card has a clean professional layout.
- Layout works at 375px with no horizontal scrolling.
- Desktop layout remains readable.
- No unintended overflow.
- Avatar dimensions remain explicit.
- Text is readable and contrast is sufficient.
- No functional regressions from B01.
- TypeScript build succeeds.

**Verification:**
- npm run dev
- npm run build
- npm run lint (if configured)
- Open Chrome DevTools Device Toolbar.
- Test 375px viewport.
- Check document horizontal overflow.
- Test a wider desktop viewport.
- Inspect CSS classes and computed styles.
- Confirm no broken avatar or clipped skill labels.
- Review git diff and git diff --check.

**Required Commit:**
style(ex1): add responsive 375px CSS module

This commit message must remain exactly as specified.

---

### V01 — Final Accessibility and Submission Verification

**Status:** NOT STARTED

**Goal:**
Verify Exercise 1 is ready for submission and oral defense.

**Files:**
- No file modifications required for verification.
- Existing source files only if a real defect is discovered.
- AI_FAILURE_AUDIT.md only if actual AI-generated
  failures need to be documented.

**Prerequisites:**
- C01 completed and committed.

**Work:**
- Inspect semantic DOM structure.
- Inspect Chrome DevTools Accessibility Tree.
- Confirm article has an accessible name.
- Confirm heading hierarchy is correct.
- Check statistics and skill list semantics.
- Confirm image alt text and initials fallback.
- Check HTTPS-only media.
- Check layout at 375px.
- Check desktop readability.
- Run build and lint where available.
- Check browser console.
- Review Git history.
- Prepare to explain implementation decisions.

**Acceptance Criteria:**
- All mandatory Exercise 1 requirements pass.
- No prohibited div tags in DeveloperCard.
- No React warnings or TypeScript build errors.
- Accessibility structure is understandable.
- No horizontal scrolling at 375px.
- Broken avatar fallback is functional.
- The two mandatory commits exist in Git history.
- Student can explain props, keys, Fragment,
  Object.entries(), semantic HTML, and CSS Modules.

**Verification:**
- npm run build
- npm run lint (if configured)
- git status
- git log --oneline
- Chrome DevTools Elements
- Chrome DevTools Accessibility Tree
- Chrome DevTools Device Toolbar
- Manual valid/invalid avatar tests

**Commit:**
No new commit if verification makes no changes.

If a real defect is found:
- Fix the issue.
- Repeat relevant checks.
- Review the diff.
- Create a separate descriptive fix commit.
- Do not amend or replace required commits merely
  to hide previous work.

---

## 5. Task Dependency Order

P01 — Task decomposition
 |
 v
A01 — Initialize React 19 project
 |
 v
A02 — Define TypeScript contracts
 |
 v
B01 — Implement DeveloperCard and SkillBadge
 |
 v
C01 — Add CSS Modules and responsive styling
 |
 v
V01 — Final verification and submission audit

Only one task is active at a time.

---

## 6. Mandatory Commit Milestones

Required instructor commits:

1. feat(ex1): implement semantic DeveloperCard and SkillBadge
2. style(ex1): add responsive 375px CSS module

Additional planned commits when files are changed:

- docs(ex1): add task decomposition
- chore(ex1): initialize React 19 TypeScript Vite project
- chore(ex1): define profile component contracts

Do not create empty commits.

If Git is first initialized during A01, the P01 document
is included in A01's initial commit rather than creating
an artificial standalone commit.

V01 does not require a commit if no changes are made.

---

## 7. Final Verification Checklist

### React and TypeScript
- [ ] React 19 installed.
- [ ] TypeScript contracts defined.
- [ ] Functional components only.
- [ ] Typed props and suitable default parameters.
- [ ] No legacy React APIs.
- [ ] Build succeeds.

### Semantic HTML
- [ ] DeveloperCard uses article.
- [ ] Header and heading structure is correct.
- [ ] No div inside DeveloperCard.
- [ ] Statistics use dl, dt, dd.
- [ ] Skills use ul and li.
- [ ] Object.entries() used for statistics.
- [ ] Stable keys used.
- [ ] Fragment used appropriately.

### Avatar
- [ ] HTTPS URL.
- [ ] Explicit width and height.
- [ ] Meaningful alt text.
- [ ] Initials fallback works.

### Styling
- [ ] CSS Modules used.
- [ ] CSS Custom Properties used.
- [ ] 375px responsive layout passes.
- [ ] No horizontal scrolling.
- [ ] Readable colors and typography.

### Accessibility
- [ ] aria-labelledby matches card heading ID.
- [ ] Accessibility Tree inspected.
- [ ] Heading hierarchy verified.
- [ ] Statistics and skills readable.
- [ ] Content remains understandable without color.

### Git
- [ ] Feature commit exists.
- [ ] Styling commit exists.
- [ ] No unrelated changes included.
- [ ] git diff --check passes before each commit.
- [ ] Working tree is clean after final verification.

---

## 8. Progress Tracker

| Task | Status | Commit |
|------|--------|--------|
| P01 | NOT STARTED | Pending or deferred to A01 |
| A01 | NOT STARTED | Pending |
| A02 | NOT STARTED | Pending |
| B01 | NOT STARTED | Pending |
| C01 | NOT STARTED | Pending |
| V01 | NOT STARTED | Not required unless changed |

Allowed statuses:
- NOT STARTED
- IN PROGRESS
- BLOCKED
- VERIFIED
- COMMITTED
- COMPLETE (verification-only tasks)

For tasks requiring a commit, only COMMITTED counts
as fully completed.

Update statuses when actual work has been verified.
Do not change a status to COMMITTED before checking Git.

---

## 9. Working Agreement

For every task, the AI must:

1. State the current task ID.
2. Explain the objective briefly.
3. Identify the exact affected file paths.
4. Provide complete code in chat.
5. Provide PowerShell commands for the student.
6. Describe verification and expected results.
7. Explain relevant errors if they occur.
8. Provide Git commit instructions.
9. Stop until the student confirms completion.

For debugging:
- Diagnose the actual reported problem.
- Provide a complete corrected file when appropriate.
- Retest the current task.
- Do not skip ahead.

The student performs all edits, terminal commands,
browser inspections, and Git commits manually.

---

## 10. Completion Definition

Exercise 1 is complete only when:

1. All required components are implemented.
2. Contracts and semantic structure are correct.
3. Avatar, statistics, and skill list work.
4. Styling is responsive at 375px.
5. Accessibility checks pass.
6. Build and relevant checks pass.
7. Both instructor-required commits are present.
8. Student can explain and modify the code.

