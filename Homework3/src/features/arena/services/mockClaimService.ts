
import type { ClaimResult } from '../domain/types';

export type MockClaimOutcome =
  | 'success'
  | 'conflict'
  | 'error';

export const MOCK_CLAIM_DELAY_MS = 800;

export class MockClaimAbortedError extends Error {
  constructor() {
    super('The simulated claim was cancelled.');
    this.name = 'MockClaimAbortedError';
  }
}

export interface MockClaimRequest {
  readonly itemId: string;
  readonly requestId: number;
  readonly outcome: MockClaimOutcome;
  readonly signal?: AbortSignal;
  readonly delayMs?: number;
}

export function mockClaimService({
  itemId,
  requestId,
  outcome,
  signal,
  delayMs = MOCK_CLAIM_DELAY_MS,
}: MockClaimRequest): Promise<ClaimResult> {
  if (!itemId.trim()) {
    throw new Error('A claim requires a valid item ID.');
  }

  if (
    !Number.isSafeInteger(requestId) ||
    requestId <= 0
  ) {
    throw new Error('Invalid claim request ID.');
  }

  if (
    !Number.isSafeInteger(delayMs) ||
    delayMs < 0
  ) {
    throw new Error('Invalid mock delay.');
  }

  if (
    outcome !== 'success' &&
    outcome !== 'conflict' &&
    outcome !== 'error'
  ) {
    throw new Error('Unsupported mock claim outcome.');
  }

  return new Promise<ClaimResult>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new MockClaimAbortedError());
      return;
    }


    const onAbort = () => {
      clearTimeout(timerId);
      signal?.removeEventListener('abort', onAbort);
      reject(new MockClaimAbortedError());
    };

    const complete = () => {
      signal?.removeEventListener('abort', onAbort);

      switch (outcome) {
        case 'success':
          resolve({
            ok: true,
            itemId,
            claimId: `demo-${itemId}-${requestId}`,
          });
          return;

        case 'conflict':
          resolve({
            ok: false,
            itemId,
            status: 409,
            reason: 'CONFLICT',
          });
          return;

        case 'error':
          resolve({
            ok: false,
            itemId,
            status: 503,
            reason: 'SERVICE_UNAVAILABLE',
          });
          return;
      }
    };

const timerId = setTimeout(complete, delayMs);

    signal?.addEventListener('abort', onAbort, {
      once: true,
    });
  });
}
