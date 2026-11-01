
import { useEffect, useState } from "react";
import type { SquadId, TelemetryState } from "../types/telemetry";
import { assertNever } from "../types/telemetry";
import {
  DEFAULT_SQUAD_ID,
  SQUAD_DATA,
  SQUAD_IDS,
} from "../data/squads";
import { fetchSquadTelemetry } from "../services/telemetry";
import styles from "./PubgMatchTelemetry.module.css";

interface TelemetryPanelProps {
  squadId: SquadId;
  onRetry: () => void;
}

function TelemetryPanel({ squadId, onRetry }: TelemetryPanelProps) {
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    status: "LOADING",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadTelemetry() {
      try {
        const data = await fetchSquadTelemetry(squadId, {
          signal: controller.signal,
        });

        if (active && !controller.signal.aborted) {
          setTelemetry({ status: "SUCCESS", data });
        }
      } catch (error: unknown) {
        if (!active || controller.signal.aborted) return;

        // Hủy chủ động không được xem là lỗi kết nối.
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setTelemetry({
          status: "ERROR",
          error:
            error instanceof Error
              ? error.message
              : "Unknown telemetry error.",
        });
      }
    }

    void loadTelemetry();

    return () => {
      active = false;
      controller.abort();
    };
  }, [squadId]);

  function renderContent() {
    switch (telemetry.status) {
      case "IDLE":
        return <p>Radar is standing by.</p>;

      case "LOADING":
        return (
          <section
            className={styles.skeleton}
            aria-busy="true"
            aria-label="Loading telemetry"
          >
            <span className={styles.skeletonTitle} aria-hidden="true" />
            <span className={styles.skeletonLine} aria-hidden="true" />
            <span className={styles.skeletonLine} aria-hidden="true" />
            <span className={styles.skeletonShort} aria-hidden="true" />
            <p className={styles.loadingText}>
              Connecting to satellite telemetry...
            </p>
          </section>
        );

      case "SUCCESS": {
        const data = telemetry.data;

        return (
          <article className={styles.telemetryCard}>
            <h3>{data.name}</h3>
            <dl className={styles.stats}>
              <dt>Map</dt>
              <dd>{data.map}</dd>

              <dt>Phase</dt>
              <dd>{data.phase}</dd>

              <dt>Players Alive</dt>
              <dd>{data.alive}</dd>

              <dt>Kills</dt>
              <dd>{data.kills}</dd>

              <dt>WWCD Probability</dt>
              <dd>{data.wwcdProb}%</dd>

              <dt>Match Status</dt>
              <dd>{data.status}</dd>
            </dl>
          </article>
        );
      }

      case "ERROR":
        return (
          <section role="alert" className={styles.errorCard}>
            <h3>Satellite Connection Lost</h3>
            <p>{telemetry.error}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={onRetry}
            >
              Reconnect Satellite / Retry
            </button>
          </section>
        );

      default:
        return assertNever(telemetry);
    }
  }

  return (
    <section
      className={styles.panel}
      aria-labelledby="telemetry-heading"
    >
      <h2 id="telemetry-heading">Match Telemetry</h2>
      <output aria-live="polite" className={styles.srOnly}>
        {telemetry.status === "LOADING"
          ? "Loading telemetry"
          : telemetry.status === "SUCCESS"
            ? `${telemetry.data.name} telemetry loaded`
            : ""}
      </output>
      {renderContent()}
    </section>
  );
}

export default function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState<SquadId>(DEFAULT_SQUAD_ID);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>PVS LIVE RADAR</p>
        <h1>KRAFTON PUBG Vietnam Series</h1>
        <p>Live Match Telemetry Simulator</p>
      </header>

      <section aria-labelledby="squad-heading">
        <h2 id="squad-heading">Select Squad</h2>

        <nav className={styles.squadNav} aria-label="Squad selection">
          {SQUAD_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.squadButton}
              aria-pressed={squadId === id}
              onClick={() => setSquadId(id)}
            >
              {SQUAD_DATA[id].name}
            </button>
          ))}
        </nav>
      </section>

      {/* Đổi key tạo lượt tải mới và cleanup request cũ. */}
      <TelemetryPanel
        key={`${squadId}-${retryCount}`}
        squadId={squadId}
        onRetry={handleRetry}
      />
    </main>
  );
}
