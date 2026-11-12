
import {
  demoDropItems,
} from './demoData';

import {
  canClaimDrop,
  transitionDropPhase,
} from './dropMachine';

import {
  resolveDropPhase,
} from './resolveDropPhase';

import {
  getScenarioItems,
  getScenarioOffset,
} from './scenarioData';

import type { DropItem, DropPhase } from './types';

interface IntegrationCheck {
  readonly check: string;
  readonly result: 'PASS';
}

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function getFirstItem(): DropItem {
  const item = demoDropItems[0];

  if (!item) {
    throw new Error('Missing demo fixture.');
  }

  return item;
}

function checkPhase(
  item: DropItem,
  initialStock: number,
  startRemainingMs: number,
  expiryRemainingMs: number,
  expected: DropPhase,
): void {
  const actual = resolveDropPhase(
    item,
    initialStock,
    startRemainingMs,
    expiryRemainingMs,
  );

  assert(
    actual === expected,
    `Expected ${expected}, received ${actual}`,
  );
}

export function runIntegrationChecks(): IntegrationCheck[] {
  const results: IntegrationCheck[] = [];
  const baseItem = getFirstItem();
  const initialStock = baseItem.remainingStock;

  function check(
    name: string,
    callback: () => void,
  ) {
    callback();
    results.push({ check: name, result: 'PASS' });
  }

  check('Before opening remains WARMUP', () => {
    checkPhase(
      baseItem,
      initialStock,
      60_000,
      120_000,
      'WARMUP',
    );
  });

  check('Opening with stock enters AIRDROP_LIVE', () => {
    checkPhase(
      baseItem,
      initialStock,
      0,
      60_000,
      'AIRDROP_LIVE',
    );
  });

  check('Zero stock after opening enters LOOTED_OUT', () => {
    checkPhase(
      { ...baseItem, remainingStock: 0 },
      initialStock,
      0,
      60_000,
      'LOOTED_OUT',
    );
  });

  check('Deadline expiration enters EXPIRED', () => {
    checkPhase(
      baseItem,
      initialStock,
      0,
      0,
      'EXPIRED',
    );
  });

  check('Expired takes precedence over depleted', () => {
    checkPhase(
      { ...baseItem, remainingStock: 0 },
      initialStock,
      0,
      0,
      'EXPIRED',
    );
  });

  check('Last-unit optimistic decrement exhausts stock', () => {
    const lastUnit = {
      ...baseItem,
      remainingStock: 1,
    };

    const optimistic = {
      ...lastUnit,
      remainingStock: 0,
    };

    checkPhase(
      optimistic,
      initialStock,
      0,
      60_000,
      'LOOTED_OUT',
    );

    assert(
      !canClaimDrop('LOOTED_OUT', 0),
      'Sold-out item must not be claimable',
    );
  });

  check('Last-unit rollback restores claimability', () => {
    const restored = {
      ...baseItem,
      remainingStock: 1,
    };

    checkPhase(
      restored,
      initialStock,
      0,
      60_000,
      'AIRDROP_LIVE',
    );

    assert(
      canClaimDrop('AIRDROP_LIVE', 1),
      'Restored item should be claimable',
    );
  });

  check('Sold-out scenario assigns zero inventory', () => {
    const items = getScenarioItems(
      'sold-out',
      demoDropItems,
    );

    assert(
      items.every((item) => item.remainingStock === 0),
      'Sold-out snapshot is incorrect',
    );
  });

  check('Last-unit scenario assigns one unit', () => {
    const items = getScenarioItems(
      'last-unit',
      demoDropItems,
    );

    assert(
      items.every((item) => item.remainingStock === 1),
      'Last-unit snapshot is incorrect',
    );
  });

  check('Live scenario restores demo inventory', () => {
    const items = getScenarioItems(
      'live',
      demoDropItems,
    );

    assert(
      items.every(
        (item, index) =>
          item.remainingStock ===
          demoDropItems[index]?.remainingStock,
      ),
      'Live inventory mismatch',
    );
  });

  check('Scenario snapshots do not mutate fixtures', () => {
    const before = JSON.stringify(demoDropItems);

    getScenarioItems('sold-out', demoDropItems);
    getScenarioItems('last-unit', demoDropItems);
    getScenarioItems('live', demoDropItems);

    assert(
      JSON.stringify(demoDropItems) === before,
      'Original fixture changed',
    );
  });

  check('Scenario offsets are deterministic', () => {
    const now = 1_000_000;

    const offset = getScenarioOffset(
      'live',
      baseItem,
      now,
    );

    assert(
      now + offset === baseItem.dropEpochMs + 60_000,
      'Live offset is incorrect',
    );

    const expired = getScenarioOffset(
      'expired',
      baseItem,
      now,
    );

    assert(
      now + expired === baseItem.expiresEpochMs + 1000,
      'Expired offset is incorrect',
    );
  });

  check('Terminal FSM phases reject reactivation', () => {
    let rejected = false;

    try {
      transitionDropPhase('LOOTED_OUT', {
        type: 'ACTIVATE',
        item: baseItem,
        nowEpochMs: baseItem.dropEpochMs,
      });
    } catch {
      rejected = true;
    }

    assert(rejected, 'Terminal phase allowed activation');
  });

  check('Inventory cannot become negative in snapshots', () => {
    for (const scenario of [
      'scheduled',
      'live',
      'last-unit',
      'sold-out',
      'expired',
    ] as const) {
      const items = getScenarioItems(
        scenario,
        demoDropItems,
      );

      assert(
        items.every(
          (item) =>
            Number.isSafeInteger(item.remainingStock) &&
            item.remainingStock >= 0,
        ),
        `Invalid stock in ${scenario}`,
      );
    }
  });

  return results;
}
