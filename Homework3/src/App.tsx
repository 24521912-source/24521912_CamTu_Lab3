
import { useState } from 'react';

import {
  DEMO_DATA_NOTICE,
  demoDropItems,
  demoSquads,
} from './features/arena/domain/demoData';

import {
  Leaderboard,
} from './features/arena/components/Leaderboard';

import type {
  DropItem,
  DropPhase,
} from './features/arena/domain/types';

import type {
  MockClaimOutcome,
} from './features/arena/services/mockClaimService';

import {
  DropCard,
} from './features/arena/components/DropCard';

import {
  useDemoClaims,
} from './features/arena/hooks/useDemoClaims';

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
      return referenceItem.dropEpochMs + 60_000 - now;

    case 'expired':
      return referenceItem.expiresEpochMs + 1000 - now;
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

  const [mockOutcome, setMockOutcome] =
    useState<MockClaimOutcome>('success');

  const {
    items,
    claim,
    reset,
    getStatus,
  } = useDemoClaims(demoDropItems);

  function handleScenarioChange(
    scenario: DemoScenario,
  ) {
    // Cancel outstanding mock requests and restore demo data.
    reset();

    setScenarioState({
      scenario,
      serverOffsetMs: getScenarioOffset(scenario),
    });
  }

  function handleClaim(
    itemId: string,
    phase: DropPhase,
  ) {
    // Each request captures the selected outcome at click time.
    void claim(itemId, phase, mockOutcome);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div
          className={`${styles.container} ${styles.headerInner}`}
        >
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
            Explore a simulated PUBG Vietnam Championship
            airdrop experience featuring PVS Grand Finals
            VIP tickets and G-Coin crates. All inventory,
            prices, countdowns, and claims are local demo
            data.
          </p>
        </section>

        <aside className={styles.notice}>
          <strong>Demo disclaimer: </strong>
          {DEMO_DATA_NOTICE}
          {' '}
          This is an educational interface.
          No real ticket, reward, payment, or purchase
          is provided.
        </aside>

        <section
          className={styles.section}
          aria-labelledby="drops-heading"
        >
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>
                LIMITED DROP SIMULATION
              </p>

              <h2
                id="drops-heading"
                className={styles.sectionTitle}
              >
                Featured Airdrops
              </h2>

              <p className={styles.sectionDescription}>
                Test optimistic inventory changes, mock
                claim outcomes, and rollback behavior.
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

            <div className={styles.scenarioField}>
              <label
                htmlFor="mock-outcome"
                className={styles.scenarioLabel}
              >
                Next mock claim result
              </label>

              <select
                id="mock-outcome"
                className={styles.scenarioSelect}
                value={mockOutcome}
                onChange={(event) => {
                  setMockOutcome(
                    event.target.value as MockClaimOutcome,
                  );
                }}
                aria-describedby="scenario-help"
              >
                <option value="success">
                  Success — confirm simulated claim
                </option>
                <option value="conflict">
                  409 Conflict — rollback
                </option>
                <option value="error">
                  503 Service Error — rollback
                </option>
              </select>
            </div>

            <p
              id="scenario-help"
              className={styles.scenarioHelp}
            >
              All actions are deterministic simulations.
              A claim uses the selected mock result at
              click time. Switching the demo scenario
              cancels pending requests and resets
              inventory. No external API is called.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {items.map((item) => (
              <DropCard
                key={`${item.id}-${scenarioState.scenario}`}
                item={getPreviewItem(
                  item,
                  scenarioState.scenario,
                )}
                serverOffsetMs={
                  scenarioState.serverOffsetMs
                }
                claimStatus={getStatus(item.id)}
                onClaim={handleClaim}
              />
            ))}
          </div>
                </section>

        <Leaderboard squads={demoSquads} />
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            Educational PUBG-inspired demo for UIT
            Web Application Development 2026.
            All claims are simulated. No ticket
            reservation, payment, or server-side
            inventory update takes place.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
