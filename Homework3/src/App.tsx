
import { useState } from 'react';

import {
  DEMO_DATA_NOTICE,
  demoDropItems,
  demoSquads,
} from './features/arena/domain/demoData';

import {
  getScenarioItems,
  getScenarioOffset,
} from './features/arena/domain/scenarioData';

import type {
  DemoScenario,
} from './features/arena/domain/scenarioData';

import type {
  DropPhase,
} from './features/arena/domain/types';

import type {
  MockClaimOutcome,
} from './features/arena/services/mockClaimService';

import {
  DropCard,
} from './features/arena/components/DropCard';

import {
  Leaderboard,
} from './features/arena/components/Leaderboard';

import {
  useDemoClaims,
} from './features/arena/hooks/useDemoClaims';

import styles from './features/arena/Arena.module.css';

interface ScenarioState {
  readonly scenario: DemoScenario;
  readonly serverOffsetMs: number;
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
    const referenceItem = demoDropItems[0];

    if (!referenceItem) {
      return;
    }

    const nextItems = getScenarioItems(
      scenario,
      demoDropItems,
    );

    // Cancel pending requests and replace the inventory snapshot.
    reset(nextItems);

    setScenarioState({
      scenario,
      serverOffsetMs: getScenarioOffset(
        scenario,
        referenceItem,
      ),
    });
  }

  function handleClaim(
    itemId: string,
    phase: DropPhase,
  ) {
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
            Explore a simulated PUBG Vietnam
            Championship airdrop experience featuring
            PVS Grand Finals VIP tickets and G-Coin
            crates. All inventory, prices, countdowns,
            and claims are local demo data.
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
                Test optimistic inventory updates,
                mock claim outcomes, and rollback
                behavior.
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
                <option value="last-unit">
                  Last Unit — inventory boundary test
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
              The selected claim result is captured when
              the request begins. Changing a demo scenario
              cancels pending requests and replaces the
              inventory snapshot. No external API is called.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {items.map((item) => {
              const initialItem = demoDropItems.find(
                (entry) => entry.id === item.id,
              );

              return (
                <DropCard
                  key={`${item.id}-${scenarioState.scenario}`}
                  item={item}
                  initialStock={
                    initialItem?.remainingStock ?? 0
                  }
                  serverOffsetMs={
                    scenarioState.serverOffsetMs
                  }
                  claimStatus={getStatus(item.id)}
                  onClaim={handleClaim}
                />
              );
            })}
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
