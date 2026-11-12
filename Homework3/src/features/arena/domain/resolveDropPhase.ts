
import {
  transitionDropPhase,
  validateDropItem,
} from './dropMachine';

import type { DropItem, DropPhase } from './types';

export function resolveDropPhase(
  item: DropItem,
  initialStock: number,
  startRemainingMs: number,
  expiryRemainingMs: number,
): DropPhase {
  validateDropItem(item);

  if (
    !Number.isSafeInteger(initialStock) ||
    initialStock <= 0
  ) {
    throw new RangeError(
      'The demo requires a positive initial stock.',
    );
  }

  for (const remaining of [
    startRemainingMs,
    expiryRemainingMs,
  ]) {
    if (
      !Number.isSafeInteger(remaining) ||
      remaining < 0
    ) {
      throw new RangeError(
        'Remaining time must be a non-negative integer.',
      );
    }
  }

  // Expiration takes precedence over stock status.
  if (expiryRemainingMs === 0) {
    return transitionDropPhase('WARMUP', {
      type: 'EXPIRE',
      nowEpochMs: item.expiresEpochMs,
      expiresEpochMs: item.expiresEpochMs,
    });
  }

  if (startRemainingMs > 0) {
    return 'WARMUP';
  }

  // Reconstruct activation from the original demo inventory.
  // The current stock may already be zero.
  const livePhase = transitionDropPhase('WARMUP', {
    type: 'ACTIVATE',
    nowEpochMs: item.dropEpochMs,
    item: {
      ...item,
      remainingStock: initialStock,
    },
  });

  if (item.remainingStock === 0) {
    return transitionDropPhase(livePhase, {
      type: 'STOCK_DEPLETED',
      remainingStock: 0,
    });
  }

  return livePhase;
}
