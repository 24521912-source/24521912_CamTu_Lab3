
import {
  demoSquads,
  getSquadTotalPoints,
} from './demoData';

import {
  compareSquads,
  getSquadMetric,
  getVisibleSquads,
} from './leaderboardLogic';

import type {
  LeaderboardFilters,
  SquadSortKey,
} from './leaderboardLogic';

import type { PubgSquad } from './types';

interface CheckResult {
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

function filters(
  overrides: Partial<LeaderboardFilters> = {},
): LeaderboardFilters {
  return {
    search: '',
    minimumWwcd: 0,
    sortBy: 'total',
    ...overrides,
  };
}

function names(
  squads: readonly PubgSquad[],
): string[] {
  return squads.map((squad) => squad.squadName);
}

function assertNames(
  actual: readonly PubgSquad[],
  expected: readonly string[],
): void {
  assert(
    JSON.stringify(names(actual)) ===
      JSON.stringify(expected),
    `Unexpected order: ${names(actual).join(', ')}`,
  );
}

export function runLeaderboardChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  function check(
    name: string,
    callback: () => void,
  ): void {
    callback();
    results.push({ check: name, result: 'PASS' });
  }

  const originalOrder = names(demoSquads);

  check('All four demo squads are visible', () => {
    const result = getVisibleSquads(
      demoSquads,
      filters(),
    );

    assert(result.length === 4, 'Expected four squads');
  });

  check('Total points are calculated correctly', () => {
    for (const squad of demoSquads) {
      assert(
        getSquadTotalPoints(squad) ===
          squad.placementPts + squad.killPts,
        'Incorrect squad total',
      );
    }
  });

  check('Default total sorting is deterministic', () => {
    const result = getVisibleSquads(
      demoSquads,
      filters(),
    );

    assertNames(result, [
      'The Expendables',
      'Cerberus Esports',
      'Roy Esports',
      'AGG',
    ]);
  });

  check('WWCD sorting works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ sortBy: 'wwcd' }),
      ),
      [
        'The Expendables',
        'Cerberus Esports',
        'Roy Esports',
        'AGG',
      ],
    );
  });

  check('Placement points sorting works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ sortBy: 'placement' }),
      ),
      [
        'Cerberus Esports',
        'The Expendables',
        'Roy Esports',
        'AGG',
      ],
    );
  });

  check('Kill points sorting works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ sortBy: 'kills' }),
      ),
      [
        'The Expendables',
        'Cerberus Esports',
        'Roy Esports',
        'AGG',
      ],
    );
  });

  check('Search is case insensitive', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ search: 'cerBERus' }),
      ),
      ['Cerberus Esports'],
    );
  });

  check('Search trims whitespace', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ search: '  roy  ' }),
      ),
      ['Roy Esports'],
    );
  });

  check('Partial name matching works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ search: 'esports' }),
      ),
      ['Cerberus Esports', 'Roy Esports'],
    );
  });

  check('Minimum WWCD filter works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({ minimumWwcd: 3 }),
      ),
      ['The Expendables'],
    );
  });

  check('Combined filtering works', () => {
    assertNames(
      getVisibleSquads(
        demoSquads,
        filters({
          search: 'esports',
          minimumWwcd: 2,
        }),
      ),
      ['Cerberus Esports', 'Roy Esports'],
    );
  });

  check('No matches returns an empty array', () => {
    const result = getVisibleSquads(
      demoSquads,
      filters({ search: 'unknown-squad' }),
    );

    assert(result.length === 0, 'Expected empty results');
  });

  check('Empty input is handled', () => {
    const result = getVisibleSquads([], filters());

    assert(result.length === 0, 'Expected no squads');
  });

  check('Original demo array is not mutated', () => {
    getVisibleSquads(
      demoSquads,
      filters({ sortBy: 'placement' }),
    );

    assert(
      JSON.stringify(names(demoSquads)) ===
        JSON.stringify(originalOrder),
      'Original array was mutated',
    );
  });

  check('Primary metric wins over total score', () => {
    const custom: PubgSquad[] = [
      {
        squadId: 'alpha',
        squadName: 'Alpha',
        wwcdCount: 1,
        placementPts: 10,
        killPts: 10,
      },
      {
        squadId: 'beta',
        squadName: 'Beta',
        wwcdCount: 2,
        placementPts: 0,
        killPts: 0,
      },
    ];

    assertNames(
      getVisibleSquads(
        custom,
        filters({ sortBy: 'wwcd' }),
      ),
      ['Beta', 'Alpha'],
    );
  });

  check('Total score breaks equal WWCD ties', () => {
    const custom: PubgSquad[] = [
      {
        squadId: 'a',
        squadName: 'Alpha',
        wwcdCount: 2,
        placementPts: 10,
        killPts: 10,
      },
      {
        squadId: 'b',
        squadName: 'Beta',
        wwcdCount: 2,
        placementPts: 20,
        killPts: 10,
      },
    ];

    assertNames(
      getVisibleSquads(
        custom,
        filters({ sortBy: 'wwcd' }),
      ),
      ['Beta', 'Alpha'],
    );
  });

  check('Name breaks identical score ties', () => {
    const custom: PubgSquad[] = [
      {
        squadId: 'zulu',
        squadName: 'Zulu',
        wwcdCount: 1,
        placementPts: 10,
        killPts: 10,
      },
      {
        squadId: 'alpha',
        squadName: 'Alpha',
        wwcdCount: 1,
        placementPts: 10,
        killPts: 10,
      },
    ];

    assertNames(
      getVisibleSquads(custom, filters()),
      ['Alpha', 'Zulu'],
    );
  });

  check('Squad ID breaks identical-name ties', () => {
    const first: PubgSquad = {
      squadId: 'b-id',
      squadName: 'Same Squad',
      wwcdCount: 1,
      placementPts: 10,
      killPts: 10,
    };

    const second: PubgSquad = {
      ...first,
      squadId: 'a-id',
    };

    assert(
      compareSquads(second, first, 'total') < 0,
      'Squad ID tie-break failed',
    );
  });

  check('Every sort metric returns correct values', () => {
    const squad = demoSquads[0];

    if (!squad) {
      throw new Error('Missing demo squad');
    }

    const keys: readonly SquadSortKey[] = [
      'total',
      'wwcd',
      'placement',
      'kills',
    ];

    const expected = [
      100,
      3,
      42,
      58,
    ];

    keys.forEach((key, index) => {
      assert(
        getSquadMetric(squad, key) === expected[index],
        `Incorrect metric: ${key}`,
      );
    });
  });

  check('Filtering does not change squad objects', () => {
    const before = JSON.stringify(demoSquads);

    getVisibleSquads(
      demoSquads,
      filters({
        search: 'esports',
        sortBy: 'kills',
      }),
    );

    assert(
      JSON.stringify(demoSquads) === before,
      'Demo squad data changed',
    );
  });

  return results;
}
