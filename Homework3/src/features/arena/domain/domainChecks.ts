
import {
  DEMO_DATA_NOTICE,
  demoDropItems,
  demoSquads,
  formatPriceVnd,
  getSquadTotalPoints,
} from './demoData';

import {
  canClaimDrop,
  InvalidDropTransitionError,
  transitionDropPhase,
  validateDropItem,
} from './dropMachine';

import type { DropItem, DropPhase } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function expectInvalidTransition(
  phase: DropPhase,
  event: Parameters<typeof transitionDropPhase>[1],
): void {
  let rejected = false;

  try {
    transitionDropPhase(phase, event);
  } catch (error) {
    if (error instanceof InvalidDropTransitionError) {
      rejected = true;
    } else {
      throw error;
    }
  }

  assert(rejected, `Expected an invalid transition from ${phase}`);
}

export function runDomainChecks(): {
  check: string;
  result: 'PASS';
}[] {
  const results: { check: string; result: 'PASS' }[] = [];

  function check(name: string, callback: () => void): void {
    callback();
    results.push({ check: name, result: 'PASS' });
  }

  const item = demoDropItems[0];

  if (!item) {
    throw new Error('Missing demo drop item.');
  }

  const activeTime = item.dropEpochMs + 1000;

  check('Demo data is explicitly labeled', () => {
    assert(DEMO_DATA_NOTICE.includes('Demo data'), 'Missing demo label');
  });

  check('Drop item IDs are unique', () => {
    const ids = demoDropItems.map((drop) => drop.id);
    assert(new Set(ids).size === ids.length, 'Duplicate drop IDs');
  });

  check('Drop items satisfy validation rules', () => {
    demoDropItems.forEach(validateDropItem);
  });

  check('Invalid negative stock is rejected', () => {
    const invalidItem: DropItem = {
      ...item,
      remainingStock: -1,
    };

    let rejected = false;

    try {
      validateDropItem(invalidItem);
    } catch {
      rejected = true;
    }

    assert(rejected, 'Negative stock was accepted');
  });

  check('Invalid expiry is rejected', () => {
    const invalidItem: DropItem = {
      ...item,
      expiresEpochMs: item.dropEpochMs,
    };

    let rejected = false;

    try {
      validateDropItem(invalidItem);
    } catch {
      rejected = true;
    }

    assert(rejected, 'Invalid expiry was accepted');
  });

  check('WARMUP activates at the start deadline', () => {
    const result = transitionDropPhase('WARMUP', {
      type: 'ACTIVATE',
      nowEpochMs: item.dropEpochMs,
      item,
    });

    assert(result === 'AIRDROP_LIVE', 'Activation failed');
  });

  check('Activation before the deadline is rejected', () => {
    expectInvalidTransition('WARMUP', {
      type: 'ACTIVATE',
      nowEpochMs: item.dropEpochMs - 1,
      item,
    });
  });

  check('Activation at expiry is rejected', () => {
    expectInvalidTransition('WARMUP', {
      type: 'ACTIVATE',
      nowEpochMs: item.expiresEpochMs,
      item,
    });
  });

  check('Activation with zero stock is rejected', () => {
    expectInvalidTransition('WARMUP', {
      type: 'ACTIVATE',
      nowEpochMs: activeTime,
      item: { ...item, remainingStock: 0 },
    });
  });

  check('LIVE becomes LOOTED_OUT at zero stock', () => {
    const result = transitionDropPhase('AIRDROP_LIVE', {
      type: 'STOCK_DEPLETED',
      remainingStock: 0,
    });

    assert(result === 'LOOTED_OUT', 'Stock depletion failed');
  });

  check('Positive stock cannot trigger LOOTED_OUT', () => {
    expectInvalidTransition('AIRDROP_LIVE', {
      type: 'STOCK_DEPLETED',
      remainingStock: 1,
    });
  });

  check('WARMUP can expire after its deadline', () => {
    const result = transitionDropPhase('WARMUP', {
      type: 'EXPIRE',
      nowEpochMs: item.expiresEpochMs,
      expiresEpochMs: item.expiresEpochMs,
    });

    assert(result === 'EXPIRED', 'Warmup expiry failed');
  });

  check('LIVE can expire after its deadline', () => {
    const result = transitionDropPhase('AIRDROP_LIVE', {
      type: 'EXPIRE',
      nowEpochMs: item.expiresEpochMs,
      expiresEpochMs: item.expiresEpochMs,
    });

    assert(result === 'EXPIRED', 'Live expiry failed');
  });

  check('Premature expiry is rejected', () => {
    expectInvalidTransition('AIRDROP_LIVE', {
      type: 'EXPIRE',
      nowEpochMs: item.expiresEpochMs - 1,
      expiresEpochMs: item.expiresEpochMs,
    });
  });

  check('Terminal phases reject activation', () => {
    for (const phase of ['LOOTED_OUT', 'EXPIRED'] as const) {
      expectInvalidTransition(phase, {
        type: 'ACTIVATE',
        nowEpochMs: activeTime,
        item,
      });
    }
  });

  check('Terminal phases reject further expiry', () => {
    for (const phase of ['LOOTED_OUT', 'EXPIRED'] as const) {
      expectInvalidTransition(phase, {
        type: 'EXPIRE',
        nowEpochMs: item.expiresEpochMs,
        expiresEpochMs: item.expiresEpochMs,
      });
    }
  });

  check('Claim requires LIVE and positive stock', () => {
    assert(canClaimDrop('AIRDROP_LIVE', 1), 'Valid claim rejected');
    assert(!canClaimDrop('WARMUP', 1), 'Warmup claim accepted');
    assert(!canClaimDrop('LOOTED_OUT', 1), 'Sold-out claim accepted');
    assert(!canClaimDrop('EXPIRED', 1), 'Expired claim accepted');
    assert(!canClaimDrop('AIRDROP_LIVE', 0), 'Zero stock accepted');
    assert(!canClaimDrop('AIRDROP_LIVE', -1), 'Negative stock accepted');
  });

  check('Squad IDs are unique and points are valid', () => {
    const ids = demoSquads.map((squad) => squad.squadId);

    assert(new Set(ids).size === ids.length, 'Duplicate squad IDs');

    for (const squad of demoSquads) {
      assert(squad.squadName.trim().length > 0, 'Empty squad name');

      assert(
        [squad.wwcdCount, squad.placementPts, squad.killPts].every(
          (value) => Number.isSafeInteger(value) && value >= 0,
        ),
        'Invalid squad points',
      );

      assert(
        getSquadTotalPoints(squad) ===
          squad.placementPts + squad.killPts,
        'Incorrect total points',
      );
    }
  });

  check('Required squads are included', () => {
    const names = new Set(demoSquads.map((squad) => squad.squadName));

    for (const name of [
      'The Expendables',
      'Cerberus Esports',
      'Roy Esports',
      'AGG',
    ]) {
      assert(names.has(name), `Missing squad: ${name}`);
    }
  });

  check('VND price formatting works', () => {
    const formatted = formatPriceVnd(1500000);

    assert(
      formatted.includes('1.500.000'),
      `Unexpected VND formatting: ${formatted}`,
    );
  });

  return results;
}
