
export const EFFORT_ACTORS = ['EM', 'AI_DO'] as const;

export type EffortActor =
  (typeof EFFORT_ACTORS)[number];

export const DEFAULT_MULTIPLIERS = {
  EM: 0.1,
  AI_DO: 50,
} as const satisfies Record<EffortActor, number>;

// Illustrative thresholds, not relationship science.
export const RED_FLAG_MIN_EM_STEPS = 5;
export const RED_FLAG_STEP_RATIO = 5;

export interface EffortSignalInput {
  readonly actor: EffortActor;
  readonly steps: number;
  readonly multiplier: number;
}

export interface EffortSignal extends EffortSignalInput {
  readonly id: string;
}

export type EffortLog = readonly EffortSignal[];

export interface ActorEffortSummary {
  readonly totalSteps: number;
  readonly totalImpact: number;
  readonly signalCount: number;
}

export interface EffortSummary {
  readonly EM: ActorEffortSummary;
  readonly AI_DO: ActorEffortSummary;
  readonly redFlag: boolean;
}

export function createDefaultSignalInput(
  actor: EffortActor,
  steps: number,
): EffortSignalInput {
  if (!EFFORT_ACTORS.includes(actor)) {
    throw new RangeError('Invalid effort actor');
  }

  return {
    actor,
    steps,
    multiplier: DEFAULT_MULTIPLIERS[actor],
  };
}

export function validateSignalInput(
  input: EffortSignalInput,
): void {
  if (!EFFORT_ACTORS.includes(input.actor)) {
    throw new RangeError('Invalid effort actor');
  }

  if (
    !Number.isSafeInteger(input.steps) ||
    input.steps <= 0
  ) {
    throw new RangeError(
      'Steps must be a positive safe integer',
    );
  }

  if (
    !Number.isFinite(input.multiplier) ||
    input.multiplier < 0
  ) {
    throw new RangeError(
      'Multiplier must be finite and nonnegative',
    );
  }

  if (!Number.isFinite(input.steps * input.multiplier)) {
    throw new RangeError('Signal impact must be finite');
  }
}

export function calculateSignalImpact(
  input: EffortSignalInput,
): number {
  validateSignalInput(input);

  return input.steps * input.multiplier;
}

export function createEffortSignal(
  input: EffortSignalInput,
  idFactory: () => string = () => crypto.randomUUID(),
): EffortSignal {
  validateSignalInput(input);

  const id = idFactory();

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new RangeError('Signal ID must be nonempty');
  }

  return {
    id,
    actor: input.actor,
    steps: input.steps,
    multiplier: input.multiplier,
  };
}

export function appendEffortSignal(
  log: EffortLog,
  signal: EffortSignal,
): EffortLog {
  validateSignalInput(signal);

  if (signal.id.trim().length === 0) {
    throw new RangeError('Signal ID must be nonempty');
  }

  if (log.some((item) => item.id === signal.id)) {
    throw new RangeError('Duplicate signal ID');
  }

  return [
    ...log,
    {
      id: signal.id,
      actor: signal.actor,
      steps: signal.steps,
      multiplier: signal.multiplier,
    },
  ];
}

export function removeEffortSignal(
  log: EffortLog,
  id: string,
): EffortLog {
  if (!log.some((signal) => signal.id === id)) {
    return log;
  }

  return log.filter((signal) => signal.id !== id);
}

export function summarizeEffort(
  log: EffortLog,
): EffortSummary {
  let emSteps = 0;
  let emImpact = 0;
  let emCount = 0;

  let aiDoSteps = 0;
  let aiDoImpact = 0;
  let aiDoCount = 0;

  for (const signal of log) {
    const impact = calculateSignalImpact(signal);

    if (signal.actor === 'EM') {
      emSteps += signal.steps;
      emImpact += impact;
      emCount += 1;
    } else {
      aiDoSteps += signal.steps;
      aiDoImpact += impact;
      aiDoCount += 1;
    }

    if (
      !Number.isSafeInteger(emSteps) ||
      !Number.isSafeInteger(aiDoSteps) ||
      !Number.isFinite(emImpact) ||
      !Number.isFinite(aiDoImpact)
    ) {
      throw new RangeError('Effort totals are too large');
    }
  }

  const redFlag =
    emSteps >= RED_FLAG_MIN_EM_STEPS &&
    emSteps / Math.max(aiDoSteps, 1) >=
      RED_FLAG_STEP_RATIO;

  return {
    EM: {
      totalSteps: emSteps,
      totalImpact: emImpact,
      signalCount: emCount,
    },
    AI_DO: {
      totalSteps: aiDoSteps,
      totalImpact: aiDoImpact,
      signalCount: aiDoCount,
    },
    redFlag,
  };
}
