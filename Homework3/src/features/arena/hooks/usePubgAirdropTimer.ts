
import { useEffect, useState } from 'react';

import { getRemainingMs } from '../domain/time';

const TICK_INTERVAL_MS = 250;

/**
 * Returns the remaining time until an absolute deadline.
 *
 * targetEpochMs:
 *   Unix epoch timestamp in milliseconds.
 *
 * serverOffsetMs:
 *   Server time minus client time, in milliseconds.
 *
 * The returned value is always non-negative.
 */
export function usePubgAirdropTimer(
  targetEpochMs: number,
  serverOffsetMs = 0,
): number {
  const [snapshot, setSnapshot] = useState(() => ({
    targetEpochMs,
    serverOffsetMs,
    remainingMs: getRemainingMs(
      targetEpochMs,
      serverOffsetMs,
    ),
  }));

  useEffect(() => {
    let active = true;

    const synchronize = () => {
      if (!active) {
        return;
      }

      const remainingMs = getRemainingMs(
        targetEpochMs,
        serverOffsetMs,
      );

      setSnapshot((previous) => {
        if (
          previous.targetEpochMs === targetEpochMs &&
          previous.serverOffsetMs === serverOffsetMs &&
          previous.remainingMs === remainingMs
        ) {
          return previous;
        }

        return {
          targetEpochMs,
          serverOffsetMs,
          remainingMs,
        };
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        synchronize();
      }
    };

    // Synchronize after effect setup without a synchronous
    // state update inside the effect body.
    const initialTimeoutId = window.setTimeout(
      synchronize,
      0,
    );

    const intervalId = window.setInterval(
      synchronize,
      TICK_INTERVAL_MS,
    );

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      active = false;

      window.clearTimeout(initialTimeoutId);
      window.clearInterval(intervalId);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [targetEpochMs, serverOffsetMs]);

  // A changed deadline or offset must not display the
  // previous configuration's remaining time.
  if (
    snapshot.targetEpochMs !== targetEpochMs ||
    snapshot.serverOffsetMs !== serverOffsetMs
  ) {
    return getRemainingMs(targetEpochMs, serverOffsetMs);
  }

  return snapshot.remainingMs;
}
