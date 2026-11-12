
import { useId } from 'react';

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

import type {
  ClaimUiStatus,
} from '../hooks/useDemoClaims';

import {
  usePubgAirdropTimer,
} from '../hooks/usePubgAirdropTimer';

import styles from './DropCard.module.css';

interface DropCardProps {
  readonly item: DropItem;
  readonly serverOffsetMs: number;
  readonly claimStatus: ClaimUiStatus;
  readonly onClaim: (
    itemId: string,
    phase: DropPhase,
  ) => void;
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
  claimStatus,
  onClaim,
}: DropCardProps) {
  const headingId = useId();
  const descriptionId = useId();
  const statusId = useId();

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

  const isPending = claimStatus.kind === 'pending';

  const canClaim =
    canClaimDrop(phase, item.remainingStock) &&
    !isPending;

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

  const buttonLabel = isPending
    ? 'Processing demo claim...'
    : phase === 'WARMUP'
      ? 'Not open yet'
      : phase === 'LOOTED_OUT'
        ? 'Sold out'
        : phase === 'EXPIRED'
          ? 'Drop expired'
          : 'Simulate claim';

  return (
    <article
      className={styles.card}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-phase={phase}
      data-item-id={item.id}
      data-claim-status={claimStatus.kind}
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
            <strong
              className={styles.stock}
              data-testid={`stock-${item.id}`}
            >
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
            'Claims are disabled until the demo drop opens.'}

          {phase === 'AIRDROP_LIVE' &&
            'Simulated claims are available. No transaction will occur.'}

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
          aria-busy={isPending}
          onClick={() => onClaim(item.id, phase)}
        >
          {buttonLabel}
        </button>

        <p
          className={styles.feedback}
          role={
            claimStatus.kind === 'conflict' ||
            claimStatus.kind === 'error'
              ? 'alert'
              : 'status'
          }
          aria-atomic="true"
          data-result={claimStatus.kind}
        >
          {claimStatus.message}
        </p>
      </div>
    </article>
  );
}
