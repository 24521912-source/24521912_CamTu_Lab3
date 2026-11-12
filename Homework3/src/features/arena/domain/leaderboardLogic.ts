
import { getSquadTotalPoints } from './demoData';
import type { PubgSquad } from './types';

export type SquadSortKey =
  | 'total'
  | 'wwcd'
  | 'placement'
  | 'kills';

export interface LeaderboardFilters {
  readonly search: string;
  readonly minimumWwcd: number;
  readonly sortBy: SquadSortKey;
}

export const DEFAULT_LEADERBOARD_FILTERS: LeaderboardFilters = {
  search: '',
  minimumWwcd: 0,
  sortBy: 'total',
};

export function getSquadMetric(
  squad: PubgSquad,
  key: SquadSortKey,
): number {
  switch (key) {
    case 'total':
      return getSquadTotalPoints(squad);
    case 'wwcd':
      return squad.wwcdCount;
    case 'placement':
      return squad.placementPts;
    case 'kills':
      return squad.killPts;
  }
}

export function compareSquads(
  first: PubgSquad,
  second: PubgSquad,
  sortBy: SquadSortKey,
): number {
  const priorities: readonly SquadSortKey[] = [
    sortBy,
    'total',
    'wwcd',
    'placement',
    'kills',
  ];

  const visited = new Set<SquadSortKey>();

  for (const key of priorities) {
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const difference =
      getSquadMetric(second, key) -
      getSquadMetric(first, key);

    if (difference !== 0) {
      return difference;
    }
  }

  const nameComparison = first.squadName.localeCompare(
    second.squadName,
    'en',
  );

  if (nameComparison !== 0) {
    return nameComparison;
  }

  return first.squadId.localeCompare(second.squadId, 'en');
}

export function getVisibleSquads(
  squads: readonly PubgSquad[],
  filters: LeaderboardFilters,
): PubgSquad[] {
  const normalizedSearch = filters.search
    .trim()
    .toLocaleLowerCase('en');

  const filtered = squads.filter((squad) => {
    const matchesSearch = squad.squadName
      .toLocaleLowerCase('en')
      .includes(normalizedSearch);

    const matchesWwcd =
      squad.wwcdCount >= filters.minimumWwcd;

    return matchesSearch && matchesWwcd;
  });

  return filtered.sort((first, second) =>
    compareSquads(first, second, filters.sortBy),
  );
}
