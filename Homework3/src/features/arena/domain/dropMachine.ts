
import type { DropEvent, DropItem, DropPhase } from './types';

export class InvalidDropTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDropTransitionError';
  }
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function isValidEpoch(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

export function validateDropItem(item: DropItem): void {
  if (!item.id.trim()) {
    throw new Error('Drop item must have a non-empty ID.');
  }

  if (!item.title.trim()) {
    throw new Error('Drop item must have a non-empty title.');
  }

  if (!isNonNegativeInteger(item.priceVnd)) {
    throw new Error('Drop price must be a non-negative integer.');
  }

  if (!isNonNegativeInteger(item.remainingStock)) {
    throw new Error('Remaining stock must be a non-negative integer.');
  }

  if (
    !isValidEpoch(item.dropEpochMs) ||
    !isValidEpoch(item.expiresEpochMs) ||
    item.expiresEpochMs <= item.dropEpochMs
  ) {
    throw new Error('Drop expiry must be later than its start time.');
  }
}

export function transitionDropPhase(
  currentPhase: DropPhase,
  event: DropEvent,
): DropPhase {
  if (event.type === 'ACTIVATE') {
    if (currentPhase !== 'WARMUP') {
      throw new InvalidDropTransitionError(
        `Cannot activate a drop from ${currentPhase}.`,
      );
    }

    validateDropItem(event.item);

    if (!isValidEpoch(event.nowEpochMs)) {
      throw new InvalidDropTransitionError('Invalid activation time.');
    }

    if (
      event.nowEpochMs < event.item.dropEpochMs ||
      event.nowEpochMs >= event.item.expiresEpochMs
    ) {
      throw new InvalidDropTransitionError(
        'The current time is outside the activation window.',
      );
    }

    if (event.item.remainingStock === 0) {
      throw new InvalidDropTransitionError(
        'Cannot activate a drop with zero stock.',
      );
    }

    return 'AIRDROP_LIVE';
  }

  if (event.type === 'STOCK_DEPLETED') {
    if (currentPhase !== 'AIRDROP_LIVE') {
      throw new InvalidDropTransitionError(
        `Cannot deplete stock from ${currentPhase}.`,
      );
    }

    if (event.remainingStock !== 0) {
      throw new InvalidDropTransitionError(
        'Stock depletion requires exactly zero remaining units.',
      );
    }

    return 'LOOTED_OUT';
  }

  if (event.type === 'EXPIRE') {
    if (
      currentPhase !== 'WARMUP' &&
      currentPhase !== 'AIRDROP_LIVE'
    ) {
      throw new InvalidDropTransitionError(
        `Cannot expire a drop from ${currentPhase}.`,
      );
    }

    if (
      !isValidEpoch(event.nowEpochMs) ||
      !isValidEpoch(event.expiresEpochMs)
    ) {
      throw new InvalidDropTransitionError('Invalid expiry timestamp.');
    }

    if (event.nowEpochMs < event.expiresEpochMs) {
      throw new InvalidDropTransitionError(
        'Cannot expire a drop before its deadline.',
      );
    }

    return 'EXPIRED';
  }

  const unreachable: never = event;
  throw new InvalidDropTransitionError(
    `Unsupported drop event: ${String(unreachable)}`,
  );
}

export function canClaimDrop(
  phase: DropPhase,
  remainingStock: number,
): boolean {
  return (
    phase === 'AIRDROP_LIVE' &&
    isNonNegativeInteger(remainingStock) &&
    remainingStock > 0
  );
}
