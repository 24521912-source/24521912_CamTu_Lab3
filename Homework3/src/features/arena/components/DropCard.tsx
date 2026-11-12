
import { useId, useState } from 'react';

import {
  formatPriceVnd,
} from '../domain/demoData';

import {
  canClaimDrop,
} from '../domain/dropMachine';

import type {
  DropItem,
  DropPhase,
} from '../domain/types';

import {
  usePubgAirdropTimer,
} from '../hooks/usePubgAirdropTimer';

import styles from './DropCard.module.css';

interface DropCardProps {
  readonly item: DropItem;
  readonly serverOffsetMs: number;
}

const phaseLabels: Record<DropPhase, string> = {
  WARMUP: 'Coming Soon',
  AIRDROP_LIVE: 'Airdrop Live',
  LOOTED_OUT: 'Sold Out',
  EXPIRED: 'Expired',
};

function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

function getDisplayPhase(
  startRemainingMs: number,
  expiryRemainingMs: number,
  remainingStock: number,
): DropPhase {
  if (startRemainingMs > 0) {
    return 'WARMUP';
  }

  if (expiryRemainingMs === 0) {
    return 'EXPIRED';
  }

  if (remainingStock === 0) {
    return 'LOOTED_OUT';
  }

  return 'AIRDROP_LIVE';
}

export function DropCard({
  item,
  serverOffsetMs,
}: DropCardProps) {
  const headingId = useId();
  const descriptionId = useId();
  const statusId = useId();

  const [message, setMessage] = useState('');

  const startRemainingMs = usePubgAirdropTimer(
    item.dropEpochMs,
    serverOffsetMs,
  );

  const expiryRemainingMs = usePubgAirdropTimer(
    item.expiresEpochMs,
    serverOffsetMs,
  );

  const phase = getDisplayPhase(
    startRemainingMs,
    expiryRemainingMs,
    item.remainingStock,
  );

  const canClaim = canClaimDrop(
    phase,
    item.remainingStock,
  );

  function handlePreviewClaim() {
    if (!canClaim) {
      return;
    }

    setMessage(
      'This is a UI preview only. No claim or purchase was made. Claim simulation is implemented in Task 05.',
    );
  }

  const countdownLabel =
    phase === 'WARMUP'
      ? 'Opens in'
      : phase === 'AIRDROP_LIVE'
        ? 'Closes in'
        : 'Drop status';

  const countdownValue =
    phase === 'WARMUP'
      ? formatRemainingTime(startRemainingMs)
      : phase === 'AIRDROP_LIVE'
        ? formatRemainingTime(expiryRemainingMs)
        : phaseLabels[phase];

  const buttonLabel =
    phase === 'WARMUP'
      ? 'Not open yet'
      : phase === 'LOOTED_OUT'
        ? 'Sold out'
        : phase === 'EXPIRED'
          ? 'Drop expired'
          : 'Preview claim';

  return (
    <article
      className={styles.card}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-phase={phase}
      data-item-id={item.id}
    >
      <div className={styles.visual} aria-hidden="true">
        <span className={styles.visualSymbol}>
          {item.kind === 'VIP_TICKET' ? 'VIP' : 'G'}
        </span>
        <span className={styles.visualCaption}>
          {item.kind === 'VIP_TICKET'
            ? 'GRAND FINALS'
            : 'REWARD CRATE'}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <span className={styles.category}>
            {item.kind === 'VIP_TICKET'
              ? 'EVENT TICKET'
              : 'GAME REWARD'}
          </span>

          <span
            className={styles.phase}
            data-phase={phase}
          >
            {phaseLabels[phase]}
          </span>
        </div>

        <h3 id={headingId} className={styles.title}>
          {item.title}
        </h3>

        <p id={descriptionId} className={styles.description}>
          {item.description}
        </p>

        <div className={styles.details}>
          <div>
            <span className={styles.detailLabel}>
              Demo price
            </span>
            <strong className={styles.price}>
              {formatPriceVnd(item.priceVnd)}
            </strong>
          </div>

          <div>
            <span className={styles.detailLabel}>
              Demo inventory
            </span>
            <strong className={styles.stock}>
              {item.remainingStock} available
            </strong>
          </div>
        </div>

        <div className={styles.timer}>
          <span className={styles.detailLabel}>
            {countdownLabel}
          </span>
          <output
            className={styles.timeValue}
            aria-live="off"
            aria-label={`${countdownLabel}: ${countdownValue}`}
          >
            {countdownValue}
          </output>
        </div>

        <p className={styles.availability} id={statusId}>
          {phase === 'WARMUP' &&
            'Claim preview becomes available when the demo drop opens.'}

          {phase === 'AIRDROP_LIVE' &&
            'Demo preview is available. No real transaction will occur.'}

          {phase === 'LOOTED_OUT' &&
            'The simulated inventory has been depleted.'}

          {phase === 'EXPIRED' &&
            'The simulated claim window has ended.'}
        </p>

        <button
          type="button"
          className={styles.claimButton}
          disabled={!canClaim}
          aria-describedby={statusId}
          onClick={handlePreviewClaim}
        >
          {buttonLabel}
        </button>

        <p
          className={styles.feedback}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {message}
        </p>
      </div>
    </article>
  );
}
