
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_MULTIPLIERS,
  EFFORT_ACTORS,
  RED_FLAG_MIN_EM_STEPS,
  RED_FLAG_STEP_RATIO,
  appendEffortSignal,
  calculateSignalImpact,
  createDefaultSignalInput,
  createEffortSignal,
  removeEffortSignal,
  summarizeEffort,
  validateSignalInput,
  type EffortSignal,
} from './effortModel';

function makeSignal(
  id: string,
  actor: 'EM' | 'AI_DO',
  steps: number,
  multiplier: number = DEFAULT_MULTIPLIERS[actor],
): EffortSignal {
  return {
    id,
    actor,
    steps,
    multiplier,
  };
}

describe('Effort model contract', () => {
  it('defines exactly two actors', () => {
    expect(EFFORT_ACTORS).toEqual(['EM', 'AI_DO']);
  });

  it('uses slide 32 demo multipliers', () => {
    expect(DEFAULT_MULTIPLIERS.EM).toBe(0.1);
    expect(DEFAULT_MULTIPLIERS.AI_DO).toBe(50);
  });

  it('documents the demo red-flag thresholds', () => {
    expect(RED_FLAG_MIN_EM_STEPS).toBe(5);
    expect(RED_FLAG_STEP_RATIO).toBe(5);
  });

  it('creates default input for each actor', () => {
    expect(createDefaultSignalInput('EM', 10)).toEqual({
      actor: 'EM',
      steps: 10,
      multiplier: 0.1,
    });

    expect(createDefaultSignalInput('AI_DO', 2)).toEqual({
      actor: 'AI_DO',
      steps: 2,
      multiplier: 50,
    });
  });
});

describe('Signal creation and validation', () => {
  it('creates a signal with a stable supplied ID', () => {
    const signal = createEffortSignal(
      createDefaultSignalInput('EM', 10),
      () => 'signal-001',
    );

    expect(signal).toEqual({
      id: 'signal-001',
      actor: 'EM',
      steps: 10,
      multiplier: 0.1,
    });

    expect(signal.id).toBe('signal-001');
  });

  it('calculates EM impact', () => {
    expect(
      calculateSignalImpact(
        createDefaultSignalInput('EM', 100),
      ),
    ).toBe(10);
  });

  it('calculates AI_DO impact', () => {
    expect(
      calculateSignalImpact(
        createDefaultSignalInput('AI_DO', 1),
      ),
    ).toBe(50);
  });

  it.each([0, -1, 1.5, NaN, Infinity, -Infinity])(
    'rejects invalid steps: %s',
    (steps) => {
      expect(() =>
        validateSignalInput({
          actor: 'EM',
          steps,
          multiplier: 0.1,
        }),
      ).toThrow(RangeError);
    },
  );

  

  it.each([-1, NaN, Infinity, -Infinity])(
    'rejects invalid multiplier: %s',
    (multiplier) => {
      expect(() =>
        validateSignalInput({
          actor: 'EM',
          steps: 1,
          multiplier,
        }),
      ).toThrow(RangeError);
    },
  );

  it('accepts a zero multiplier', () => {
    expect(
      calculateSignalImpact({
        actor: 'EM',
        steps: 3,
        multiplier: 0,
      }),
    ).toBe(0);
  });

  it('rejects overflowing signal impact', () => {
    expect(() =>
      calculateSignalImpact({
        actor: 'EM',
        steps: 2,
        multiplier: Number.MAX_VALUE,
      }),
    ).toThrow(RangeError);
  });

  it('rejects an empty generated ID', () => {
    expect(() =>
      createEffortSignal(
        createDefaultSignalInput('EM', 1),
        () => '   ',
      ),
    ).toThrow(RangeError);
  });

  it('rejects an invalid actor at runtime', () => {
    expect(() =>
      validateSignalInput({
        actor: 'UNKNOWN' as 'EM',
        steps: 1,
        multiplier: 1,
      }),
    ).toThrow(RangeError);
  });
});

describe('Immutable effort log', () => {
  it('appends without mutating the previous log', () => {
    const original = [makeSignal('a', 'EM', 2)];
    const snapshot = structuredClone(original);

    const next = appendEffortSignal(
      original,
      makeSignal('b', 'AI_DO', 1),
    );

    expect(original).toEqual(snapshot);
    expect(original).toHaveLength(1);
    expect(next).toHaveLength(2);
    expect(next).not.toBe(original);
    expect(next.map((signal) => signal.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('copies the appended signal data', () => {
    const signal = makeSignal('a', 'EM', 2);
    const next = appendEffortSignal([], signal);

    expect(next[0]).toEqual(signal);
    expect(next[0]).not.toBe(signal);
  });

  it('preserves stable IDs when removing a signal', () => {
    const original = [
      makeSignal('a', 'EM', 1),
      makeSignal('b', 'AI_DO', 2),
      makeSignal('c', 'EM', 3),
    ];

    const next = removeEffortSignal(original, 'b');

    expect(next.map((signal) => signal.id)).toEqual([
      'a',
      'c',
    ]);

    expect(original).toHaveLength(3);
  });

  it('returns the same log when ID does not exist', () => {
    const original = [makeSignal('a', 'EM', 1)];

    const next = removeEffortSignal(original, 'missing');

    expect(next).toBe(original);
  });

  it('rejects duplicate IDs', () => {
    const original = [makeSignal('a', 'EM', 1)];

    expect(() =>
      appendEffortSignal(
        original,
        makeSignal('a', 'AI_DO', 1),
      ),
    ).toThrow('Duplicate signal ID');
  });

  it('rejects empty IDs on append', () => {
    expect(() =>
      appendEffortSignal(
        [],
        makeSignal(' ', 'EM', 1),
      ),
    ).toThrow(RangeError);
  });

  it('rejects invalid signals on append', () => {
    expect(() =>
      appendEffortSignal(
        [],
        makeSignal('a', 'EM', -2),
      ),
    ).toThrow(RangeError);
  });
});

describe('Derived effort summary', () => {
  it('returns zero totals and no red flag for empty log', () => {
    expect(summarizeEffort([])).toEqual({
      EM: {
        totalSteps: 0,
        totalImpact: 0,
        signalCount: 0,
      },
      AI_DO: {
        totalSteps: 0,
        totalImpact: 0,
        signalCount: 0,
      },
      redFlag: false,
    });
  });

  it('calculates slide 32 example correctly', () => {
    const log = [
      makeSignal('em-1', 'EM', 100),
      makeSignal('ai-1', 'AI_DO', 1),
    ];

    const summary = summarizeEffort(log);

    expect(summary.EM.totalSteps).toBe(100);
    expect(summary.EM.totalImpact).toBe(10);
    expect(summary.AI_DO.totalSteps).toBe(1);
    expect(summary.AI_DO.totalImpact).toBe(50);
    expect(summary.redFlag).toBe(true);
  });

  it('aggregates multiple signals per actor', () => {
    const log = [
      makeSignal('em-1', 'EM', 2),
      makeSignal('ai-1', 'AI_DO', 1),
      makeSignal('em-2', 'EM', 3),
      makeSignal('ai-2', 'AI_DO', 2),
    ];

    const summary = summarizeEffort(log);

    expect(summary.EM.totalSteps).toBe(5);
    expect(summary.EM.totalImpact).toBeCloseTo(0.5);
    expect(summary.EM.signalCount).toBe(2);

    expect(summary.AI_DO.totalSteps).toBe(3);
    expect(summary.AI_DO.totalImpact).toBe(150);
    expect(summary.AI_DO.signalCount).toBe(2);
    expect(summary.redFlag).toBe(false);
  });

  it('keeps each recorded multiplier', () => {
    const log = [
      makeSignal('a', 'EM', 2, 0.25),
      makeSignal('b', 'EM', 2, 0.5),
    ];

    expect(summarizeEffort(log).EM.totalImpact).toBe(1.5);
  });

  it('raises red flag for repeated one-sided effort', () => {
    const log = [makeSignal('a', 'EM', 5)];

    expect(summarizeEffort(log).redFlag).toBe(true);
  });

  it('does not raise red flag below minimum steps', () => {
    const log = [makeSignal('a', 'EM', 4)];

    expect(summarizeEffort(log).redFlag).toBe(false);
  });

  it('raises red flag at the exact ratio boundary', () => {
    const log = [
      makeSignal('a', 'EM', 10),
      makeSignal('b', 'AI_DO', 2),
    ];

    expect(summarizeEffort(log).redFlag).toBe(true);
  });

  it('does not raise red flag below ratio boundary', () => {
    const log = [
      makeSignal('a', 'EM', 9),
      makeSignal('b', 'AI_DO', 2),
    ];

    expect(summarizeEffort(log).redFlag).toBe(false);
  });

  it('updates derived results after removal', () => {
    const original = [
      makeSignal('a', 'EM', 100),
      makeSignal('b', 'AI_DO', 1),
    ];

    const before = summarizeEffort(original);
    const updated = removeEffortSignal(original, 'a');
    const after = summarizeEffort(updated);

    expect(before.redFlag).toBe(true);
    expect(after.redFlag).toBe(false);
    expect(after.EM.totalSteps).toBe(0);
    expect(original).toHaveLength(2);
  });

  it('rejects overflow in accumulated steps', () => {
    const log = [
      makeSignal('a', 'EM', Number.MAX_SAFE_INTEGER, 0),
      makeSignal('b', 'EM', 1, 0),
    ];

    expect(() => summarizeEffort(log)).toThrow(RangeError);
  });

  it('rejects overflow in accumulated impact', () => {
    const log = [
      makeSignal('a', 'EM', 1, Number.MAX_VALUE),
      makeSignal('b', 'EM', 1, Number.MAX_VALUE),
    ];

    expect(() => summarizeEffort(log)).toThrow(RangeError);
  });

  it('does not mutate inputs while summarizing', () => {
    const log = [makeSignal('a', 'EM', 10)];
    const snapshot = structuredClone(log);

    const first = summarizeEffort(log);
    const second = summarizeEffort(log);

    expect(log).toEqual(snapshot);
    expect(first).toEqual(second);
  });
});
