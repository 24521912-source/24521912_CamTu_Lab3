
import { useId, useMemo, useState } from 'react';

import { getSquadTotalPoints } from '../domain/demoData';

import {
  DEFAULT_LEADERBOARD_FILTERS,
  getVisibleSquads,
} from '../domain/leaderboardLogic';

import type {
  LeaderboardFilters,
  SquadSortKey,
} from '../domain/leaderboardLogic';

import type { PubgSquad } from '../domain/types';

import styles from './Leaderboard.module.css';

interface LeaderboardProps {
  readonly squads: readonly PubgSquad[];
}

const sortOptions: readonly {
  readonly value: SquadSortKey;
  readonly label: string;
}[] = [
  { value: 'total', label: 'Total points' },
  { value: 'wwcd', label: 'WWCD' },
  { value: 'placement', label: 'Placement points' },
  { value: 'kills', label: 'Kill points' },
];

export function Leaderboard({ squads }: LeaderboardProps) {
  const [filters, setFilters] = useState<LeaderboardFilters>(
    DEFAULT_LEADERBOARD_FILTERS,
  );

  const searchId = useId();
  const wwcdId = useId();
  const sortId = useId();
  const summaryId = useId();

  const visibleSquads = useMemo(
    () => getVisibleSquads(squads, filters),
    [squads, filters],
  );

  function updateFilters(
    update: Partial<LeaderboardFilters>,
  ) {
    setFilters((previous) => ({
      ...previous,
      ...update,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_LEADERBOARD_FILTERS);
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.minimumWwcd !== 0 ||
    filters.sortBy !== 'total';

  return (
    <section
      className={styles.leaderboard}
      aria-labelledby="leaderboard-heading"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            PUBG VIETNAM CHAMPIONSHIP
          </p>

          <h2
            id="leaderboard-heading"
            className={styles.heading}
          >
            Squad Leaderboard
          </h2>

          <p className={styles.description}>
            Explore simulated squad statistics.
            Filter by team name or minimum WWCD,
            and sort by match performance.
          </p>
        </div>

        <span className={styles.demoBadge}>
          DEMO STANDINGS
        </span>
      </header>

      <div
        className={styles.controls}
        role="group"
        aria-label="Leaderboard filters and sorting"
      >
        <div className={styles.field}>
          <label htmlFor={searchId}>
            Search squad
          </label>

          <input
            id={searchId}
            type="search"
            className={styles.control}
            placeholder="Enter squad name"
            value={filters.search}
            onChange={(event) =>
              updateFilters({
                search: event.target.value,
              })
            }
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={wwcdId}>
            Minimum WWCD
          </label>

          <select
            id={wwcdId}
            className={styles.control}
            value={filters.minimumWwcd}
            onChange={(event) =>
              updateFilters({
                minimumWwcd: Number(event.target.value),
              })
            }
          >
            <option value={0}>All teams</option>
            <option value={1}>At least 1</option>
            <option value={2}>At least 2</option>
            <option value={3}>At least 3</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={sortId}>
            Sort by
          </label>

          <select
            id={sortId}
            className={styles.control}
            value={filters.sortBy}
            onChange={(event) =>
              updateFilters({
                sortBy: event.target.value as SquadSortKey,
              })
            }
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.resetButton}
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          Reset filters
        </button>
      </div>

      <p
        id={summaryId}
        className={styles.summary}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {visibleSquads.length} of {squads.length}
        {' '}demo squads. Sorted by{' '}
        {sortOptions.find(
          (option) => option.value === filters.sortBy,
        )?.label.toLowerCase()}
        {' '}in descending order.
      </p>

      {visibleSquads.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No squads found</h3>
          <p>
            No demo squads match the selected filters.
            Try another name or minimum WWCD.
          </p>

          <button
            type="button"
            className={styles.emptyResetButton}
            onClick={resetFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
  className={styles.tableScroll}
  role="region"
  aria-label="Scrollable PUBG squad standings"
  aria-describedby={summaryId}
  tabIndex={0}
>
    <p className={styles.scrollHint}>
  On smaller screens, scroll the standings table
  horizontally to view all score columns.
</p>
          <table
            className={styles.table}
            aria-describedby={summaryId}
          >
            <caption className={styles.tableCaption}>
              Simulated PUBG Vietnam squad standings.
              Total equals placement points plus kill
              points. This is not a live or official ranking.
            </caption>

            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Squad</th>
                <th scope="col">
                  <abbr title="Winner Winner Chicken Dinner">
                    WWCD
                  </abbr>
                </th>
                <th scope="col">Placement</th>
                <th scope="col">Kills</th>
                <th scope="col">Total</th>
              </tr>
            </thead>

            <tbody>
              {visibleSquads.map((squad, index) => (
                <tr key={squad.squadId}>
                  <td className={styles.rank}>
                    {index + 1}
                  </td>

                  <th
                    scope="row"
                    className={styles.squadName}
                  >
                    {squad.squadName}
                  </th>

                  <td>{squad.wwcdCount}</td>
                  <td>{squad.placementPts}</td>
                  <td>{squad.killPts}</td>

                  <td className={styles.total}>
                    {getSquadTotalPoints(squad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.footnote}>
        Demo data only. WWCD represents match wins.
        The ranking and tie-breakers are educational
        examples and do not represent official PVS rules.
      </p>
    </section>
  );
}
