
import { useState } from 'react';

import {
  DEMO_DATA_NOTICE,
  demoDropItems,
} from './features/arena/domain/demoData';

import type {
  DropItem,
} from './features/arena/domain/types';

import {
  DropCard,
} from './features/arena/components/DropCard';

import styles from './features/arena/Arena.module.css';

type DemoScenario =
  | 'scheduled'
  | 'live'
  | 'sold-out'
  | 'expired';

interface ScenarioState {
  readonly scenario: DemoScenario;
  readonly serverOffsetMs: number;
}

function getScenarioOffset(
  scenario: DemoScenario,
): number {
  const referenceItem = demoDropItems[0];

  if (!referenceItem) {
    return 0;
  }

  const now = Date.now();

  switch (scenario) {
    case 'scheduled':
      return 0;

    case 'live':
    case 'sold-out':
      return (
        referenceItem.dropEpochMs +
        60_000 -
        now
      );

    case 'expired':
      return (
        referenceItem.expiresEpochMs +
        1000 -
        now
      );
  }
}

function getPreviewItem(
  item: DropItem,
  scenario: DemoScenario,
): DropItem {
  if (scenario === 'sold-out') {
    return {
      ...item,
      remainingStock: 0,
    };
  }

  return item;
}

function App() {
  const [scenarioState, setScenarioState] =
    useState<ScenarioState>({
      scenario: 'scheduled',
      serverOffsetMs: 0,
    });

  function handleScenarioChange(
    value: DemoScenario,
  ) {
    setScenarioState({
      scenario: value,
      serverOffsetMs: getScenarioOffset(value),
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <div className={styles.brand}>
            <span className={styles.brandTop}>
              KRAFTON × PUBG
            </span>
            <span className={styles.brandBottom}>
              VIETNAM CHAMPIONSHIP
            </span>
          </div>

          <span className={styles.demoBadge}>
            NON-COMMERCIAL DEMO
          </span>
        </div>
      </header>

      <main className={styles.container}>
        <section
          className={styles.hero}
          aria-labelledby="arena-heading"
        >
          <p className={styles.eyebrow}>
            PUBG VIETNAM EXPERIENCE
          </p>

          <h1
            id="arena-heading"
            className={styles.heading}
          >
            AIRDROP
            <br />
            <span className={styles.headingAccent}>
              ARENA
            </span>
          </h1>

          <p className={styles.heroDescription}>
            Explore a simulated PUBG Vietnam
            Championship airdrop experience featuring
            PVS Grand Finals VIP tickets and G-Coin
            crates. All inventory, prices, countdowns,
            and interactions are for local demonstration.
          </p>
        </section>

        <aside className={styles.notice}>
          <strong>Demo disclaimer: </strong>
          {DEMO_DATA_NOTICE}
          {' '}
          This is an educational interface and is not an
          official ticket store or payment service.
        </aside>

        <section
          className={styles.section}
          aria-labelledby="drops-heading"
        >
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>
                LIMITED DROP PREVIEW
              </p>
              <h2
                id="drops-heading"
                className={styles.sectionTitle}
              >
                Featured Airdrops
              </h2>
              <p className={styles.sectionDescription}>
                View simulated stock, VND prices,
                countdowns, and drop availability.
              </p>
            </div>
          </div>

          <div className={styles.scenarioPanel}>
            <div className={styles.scenarioField}>
              <label
                htmlFor="demo-scenario"
                className={styles.scenarioLabel}
              >
                Demo scenario
              </label>

              <select
                id="demo-scenario"
                className={styles.scenarioSelect}
                value={scenarioState.scenario}
                onChange={(event) => {
                  handleScenarioChange(
                    event.target.value as DemoScenario,
                  );
                }}
                aria-describedby="scenario-help"
              >
                <option value="scheduled">
                  Scheduled — actual demo clock
                </option>
                <option value="live">
                  Airdrop Live — simulated clock
                </option>
                <option value="sold-out">
                  Sold Out — simulated stock
                </option>
                <option value="expired">
                  Expired — simulated clock
                </option>
              </select>
            </div>

            <p
              id="scenario-help"
              className={styles.scenarioHelp}
            >
              Test controls only. Changing a scenario
              adjusts the local preview clock or displayed
              demo stock. It does not change any actual
              inventory or contact a server.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {demoDropItems.map((item) => (
              <DropCard
  key={`${item.id}-${scenarioState.scenario}`}
                item={getPreviewItem(
                  item,
                  scenarioState.scenario,
                )}
                serverOffsetMs={
                  scenarioState.serverOffsetMs
                }
              />
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            Educational PUBG-inspired demo for UIT
            Web Application Development 2026.
            No real purchase, ticket reservation,
            or inventory claim is performed.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
