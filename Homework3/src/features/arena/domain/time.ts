
/**
 * The server offset is server time minus client time,
 * measured in milliseconds.
 *
 * A positive offset means the server clock is ahead.
 */
export function getRemainingMs(
  targetEpochMs: number,
  serverOffsetMs = 0,
  nowEpochMs = Date.now(),
): number {
  if (
    !Number.isSafeInteger(targetEpochMs) ||
    targetEpochMs < 0
  ) {
    throw new RangeError(
      'targetEpochMs must be a non-negative safe integer.',
    );
  }

  if (!Number.isSafeInteger(serverOffsetMs)) {
    throw new RangeError(
      'serverOffsetMs must be a safe integer.',
    );
  }

  if (
    !Number.isSafeInteger(nowEpochMs) ||
    nowEpochMs < 0
  ) {
    throw new RangeError(
      'nowEpochMs must be a non-negative safe integer.',
    );
  }

  const adjustedNowMs = nowEpochMs + serverOffsetMs;
  const remainingMs = targetEpochMs - adjustedNowMs;

  return Math.max(0, remainingMs);
}
