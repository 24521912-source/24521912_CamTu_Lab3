
# AI Failure Audit — Homework 3

## AI-01 — ESLint prefer-const

**Task:** T05 — Optimistic Claim and Rollback
**File** 	src/features/arena/services/mockClaimService.ts
**Location** 	Line 65:9 

**Incorrect AI-Generated Code:** let timerId: ReturnType<typeof setTimeout>;

**Observed Error:** 	src/features/arena/services/mockClaimService.ts
65:9 error 'timerId' is never reassigned.
Use 'const' instead prefer-const

1 problem (1 error, 0 warnings)

**Evidence:**  FAIL — 1 error, 0 warnings
**My Correction** const timerId = setTimeout(complete, delayMs);


