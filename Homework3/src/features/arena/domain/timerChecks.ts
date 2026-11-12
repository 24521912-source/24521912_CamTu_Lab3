
import { getRemainingMs } from './time';

export interface TimerCheckResult {
  readonly check: string;
  readonly result: 'PASS';
}

function assertEqual(
  actual: number,
  expected: number,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(
      `${message}: expected ${expected}, received ${actual}`,
    );
  }
}

function assertThrows(
  callback: () => void,
  message: string,
): void {
  let rejected = false;

  try {
    callback();
  } catch (error) {
    if (error instanceof RangeError) {
      rejected = true;
    } else {
      throw error;
    }
  }

  if (!rejected) {
    throw new Error(`${message}: expected RangeError`);
  }
}

export function runTimerChecks(): TimerCheckResult[] {
  const results: TimerCheckResult[] = [];

  const check = (
    name: string,
    callback: () => void,
  ): void => {
    callback();

    results.push({
      check: name,
      result: 'PASS',
    });
  };

  const now = 1_000_000;
  const deadline = now + 10_000;

  check('Future deadline returns 10 seconds', () => {
    assertEqual(
      getRemainingMs(deadline, 0, now),
      10_000,
      'Future deadline',
    );
  });

  check('Exact deadline returns zero', () => {
    assertEqual(
      getRemainingMs(deadline, 0, deadline),
      0,
      'Exact deadline',
    );
  });

  check('Past deadline returns zero', () => {
    assertEqual(
      getRemainingMs(deadline, 0, deadline + 5000),
      0,
      'Past deadline',
    );
  });

  check('Positive offset reduces remaining time', () => {
    assertEqual(
      getRemainingMs(deadline, 2000, now),
      8000,
      'Positive server offset',
    );
  });

  check('Negative offset increases remaining time', () => {
    assertEqual(
      getRemainingMs(deadline, -2000, now),
      12_000,
      'Negative server offset',
    );
  });

  check('Positive offset can pass the deadline', () => {
    assertEqual(
      getRemainingMs(deadline, 15_000, now),
      0,
      'Expired adjusted clock',
    );
  });

  check('Subsecond precision is preserved', () => {
    assertEqual(
      getRemainingMs(now + 1250, 0, now),
      1250,
      'Millisecond precision',
    );
  });

  check('Delayed callback does not cause drift', () => {
    const actualNow = now + 7500;

    assertEqual(
      getRemainingMs(deadline, 0, actualNow),
      2500,
      'Delayed callback',
    );
  });

  check('Changing the target changes remaining time', () => {
    const original = getRemainingMs(deadline, 0, now);
    const updated = getRemainingMs(deadline + 5000, 0, now);

    assertEqual(updated - original, 5000, 'Changed target');
  });

  check('Changing server offset changes remaining time', () => {
    const original = getRemainingMs(deadline, 0, now);
    const updated = getRemainingMs(deadline, 3000, now);

    assertEqual(original - updated, 3000, 'Changed offset');
  });

  check('Negative target is rejected', () => {
    assertThrows(
      () => getRemainingMs(-1, 0, now),
      'Negative target',
    );
  });

  check('NaN target is rejected', () => {
    assertThrows(
      () => getRemainingMs(Number.NaN, 0, now),
      'NaN target',
    );
  });

  check('Infinite target is rejected', () => {
    assertThrows(
      () => getRemainingMs(Infinity, 0, now),
      'Infinite target',
    );
  });

  check('Fractional target is rejected', () => {
    assertThrows(
      () => getRemainingMs(1000.5, 0, now),
      'Fractional target',
    );
  });

  check('Unsafe target integer is rejected', () => {
    assertThrows(
      () => getRemainingMs(Number.MAX_SAFE_INTEGER + 1, 0, now),
      'Unsafe target',
    );
  });

  check('Invalid server offset is rejected', () => {
    assertThrows(
      () => getRemainingMs(deadline, Infinity, now),
      'Invalid offset',
    );
  });

  check('Fractional server offset is rejected', () => {
    assertThrows(
      () => getRemainingMs(deadline, 0.5, now),
      'Fractional offset',
    );
  });

  check('Negative current time is rejected', () => {
    assertThrows(
      () => getRemainingMs(deadline, 0, -1),
      'Negative current time',
    );
  });

  check('Unsafe current time is rejected', () => {
    assertThrows(
      () =>
        getRemainingMs(
          deadline,
          0,
          Number.MAX_SAFE_INTEGER + 1,
        ),
      'Unsafe current time',
    );
  });

  check('Default server offset is zero', () => {
    const target = Date.now() + 60_000;

    const remaining = getRemainingMs(target);

    if (remaining < 0 || remaining > 60_000) {
      throw new Error(
        `Default offset produced invalid value: ${remaining}`,
      );
    }
  });

  return results;
}
