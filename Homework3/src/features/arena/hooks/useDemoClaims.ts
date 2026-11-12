
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { canClaimDrop } from '../domain/dropMachine';

import type {
  DropItem,
  DropPhase,
} from '../domain/types';

import {
  mockClaimService,
  MockClaimAbortedError,
} from '../services/mockClaimService';

import type {
  MockClaimOutcome,
} from '../services/mockClaimService';

export type ClaimStatusKind =
  | 'idle'
  | 'pending'
  | 'success'
  | 'conflict'
  | 'error';

export interface ClaimUiStatus {
  readonly kind: ClaimStatusKind;
  readonly message: string;
}

interface ClaimState {
  readonly items: readonly DropItem[];
  readonly statuses: Readonly<Record<string, ClaimUiStatus>>;
}

const INITIAL_STATUS: ClaimUiStatus = {
  kind: 'idle',
  message: '',
};

function createInitialState(
  items: readonly DropItem[],
): ClaimState {
  return {
    items: items.map((item) => ({ ...item })),
    statuses: {},
  };
}

function updateItemStock(
  items: readonly DropItem[],
  itemId: string,
  delta: number,
): readonly DropItem[] {
  return items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    const nextStock = item.remainingStock + delta;

    if (
      !Number.isSafeInteger(nextStock) ||
      nextStock < 0
    ) {
      throw new Error('Inventory invariant violated.');
    }

    return {
      ...item,
      remainingStock: nextStock,
    };
  });
}

export function useDemoClaims(
  initialItems: readonly DropItem[],
) {
  const [state, setState] = useState<ClaimState>(
    () => createInitialState(initialItems),
  );

  // Synchronous source of truth for rapid, repeated clicks.
  const stateRef = useRef<ClaimState>(state);

  // One in-flight request per product ID.
  const pendingRef = useRef(
    new Map<string, AbortController>(),
  );

  const generationRef = useRef(0);
  const requestCounterRef = useRef(0);
  const mountedRef = useRef(true);

  const applyState = useCallback(
    (updater: (previous: ClaimState) => ClaimState) => {
      const next = updater(stateRef.current);
      stateRef.current = next;

      if (mountedRef.current) {
        setState(next);
      }
    },
    [],
  );

  const cancelPending = useCallback(() => {
    generationRef.current += 1;

    const pending = pendingRef.current;
    pendingRef.current = new Map();

    for (const controller of pending.values()) {
      controller.abort();
    }
  }, []);

  const reset = useCallback(() => {
    cancelPending();

    applyState(() => createInitialState(initialItems));
  }, [applyState, cancelPending, initialItems]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancelPending();
    };
  }, [cancelPending]);

  const claim = useCallback(
    async (
      itemId: string,
      phase: DropPhase,
      outcome: MockClaimOutcome,
    ): Promise<void> => {
      if (!mountedRef.current) {
        return;
      }

      // Ref guard runs synchronously before any state render.
      if (pendingRef.current.has(itemId)) {
        return;
      }

      const item = stateRef.current.items.find(
        (entry) => entry.id === itemId,
      );

      if (
        !item ||
        !canClaimDrop(phase, item.remainingStock)
      ) {
        return;
      }

      const controller = new AbortController();
      const generation = generationRef.current;

      requestCounterRef.current += 1;
      const requestId = requestCounterRef.current;

      pendingRef.current.set(itemId, controller);

      // Optimistic inventory decrement.
      applyState((previous) => ({
        items: updateItemStock(
          previous.items,
          itemId,
          -1,
        ),
        statuses: {
          ...previous.statuses,
          [itemId]: {
            kind: 'pending',
            message: 'Simulated claim pending...',
          },
        },
      }));

      try {
        const result = await mockClaimService({
          itemId,
          requestId,
          outcome,
          signal: controller.signal,
        });

        // Ignore results from cancelled or older requests.
        if (
          !mountedRef.current ||
          generationRef.current !== generation ||
          pendingRef.current.get(itemId) !== controller
        ) {
          return;
        }

        if (result.ok) {
          applyState((previous) => ({
            ...previous,
            statuses: {
              ...previous.statuses,
              [itemId]: {
                kind: 'success',
                message:
                  `Demo claim confirmed: ${result.claimId}. ` +
                  'No real item or ticket was purchased.',
              },
            },
          }));

          return;
        }

        // This request owns one optimistic decrement.
        // Roll back only the failed request's single unit.
        const failureStatus: ClaimUiStatus =
          result.status === 409
            ? {
                kind: 'conflict',
                message:
                  '409 Conflict: simulated claim rejected. ' +
                  'One inventory unit was restored.',
              }
            : {
                kind: 'error',
                message:
                  '503 Service Unavailable: simulated claim failed. ' +
                  'One inventory unit was restored.',
              };

        applyState((previous) => ({
          items: updateItemStock(
            previous.items,
            itemId,
            1,
          ),
          statuses: {
            ...previous.statuses,
            [itemId]: failureStatus,
          },
        }));
      } catch (error) {
        if (
          error instanceof MockClaimAbortedError ||
          controller.signal.aborted
        ) {
          return;
        }

        if (
          !mountedRef.current ||
          generationRef.current !== generation ||
          pendingRef.current.get(itemId) !== controller
        ) {
          return;
        }

        applyState((previous) => ({
          items: updateItemStock(
            previous.items,
            itemId,
            1,
          ),
          statuses: {
            ...previous.statuses,
            [itemId]: {
              kind: 'error',
              message:
                'Unexpected simulated claim error. ' +
                'One inventory unit was restored.',
            },
          },
        }));
      } finally {
        if (
          pendingRef.current.get(itemId) === controller
        ) {
          pendingRef.current.delete(itemId);
        }
      }
    },
    [applyState],
  );

  const getStatus = useCallback(
    (itemId: string): ClaimUiStatus =>
      state.statuses[itemId] ?? INITIAL_STATUS,
    [state.statuses],
  );

  return {
    items: state.items,
    claim,
    reset,
    getStatus,
  };
}
