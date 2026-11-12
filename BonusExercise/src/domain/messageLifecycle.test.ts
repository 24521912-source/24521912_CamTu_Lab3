
import { describe, expect, it } from 'vitest';
import {
  INITIAL_MESSAGE_STATE,
  MESSAGE_TIMEOUT_MS,
  transitionMessage,
} from './messageLifecycle';

describe('Message lifecycle', () => {
  it('starts idle', () => {
    expect(INITIAL_MESSAGE_STATE).toEqual({
      status: 'IDLE',
      requestId: 0,
      deadline: null,
    });
  });

  it('starts a five-second window on SEND', () => {
    const state = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    expect(state).toEqual({
      status: 'WAITING',
      requestId: 1,
      deadline: 1000 + MESSAGE_TIMEOUT_MS,
    });
  });

  it('accepts a reply and ignores late timeout', () => {
    const waiting = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    const replied = transitionMessage(waiting, {
      type: 'REPLY',
    });

    expect(replied.status).toBe('REPLIED');
    expect(replied.deadline).toBeNull();

    expect(
      transitionMessage(replied, {
        type: 'TIMEOUT',
        requestId: 1,
        now: 6000,
      }),
    ).toBe(replied);
  });

  it('cancels a pending message', () => {
    const waiting = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    const cancelled = transitionMessage(waiting, {
      type: 'CANCEL',
    });

    expect(cancelled.status).toBe('CANCELLED');

    expect(
      transitionMessage(cancelled, {
        type: 'TIMEOUT',
        requestId: 1,
        now: 6000,
      }),
    ).toBe(cancelled);
  });

  it('ignores a timeout before the deadline', () => {
    const waiting = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    expect(
      transitionMessage(waiting, {
        type: 'TIMEOUT',
        requestId: 1,
        now: 5999,
      }),
    ).toBe(waiting);
  });

  it('times out at exactly five seconds', () => {
    const waiting = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    const timedOut = transitionMessage(waiting, {
      type: 'TIMEOUT',
      requestId: 1,
      now: 6000,
    });

    expect(timedOut.status).toBe('TIMED_OUT');
    expect(timedOut.deadline).toBeNull();
  });

  it('restarts deadline on repeated SEND', () => {
    const first = transitionMessage(
      INITIAL_MESSAGE_STATE,
      { type: 'SEND', now: 1000 },
    );

    const second = transitionMessage(first, {
      type: 'SEND',
      now: 4000,
    });

    expect(second.requestId).toBe(2);
    expect(second.deadline).toBe(9000);

    expect(
      transitionMessage(second, {
        type: 'TIMEOUT',
        requestId: 1,
        now: 6000,
      }),
    ).toBe(second);

    expect(
      transitionMessage(second, {
        type: 'TIMEOUT',
        requestId: 2,
        now: 9000,
      }).status,
    ).toBe('TIMED_OUT');
  });

  it('does not change state for invalid events', () => {
    expect(
      transitionMessage(INITIAL_MESSAGE_STATE, {
        type: 'REPLY',
      }),
    ).toBe(INITIAL_MESSAGE_STATE);

    expect(
      transitionMessage(INITIAL_MESSAGE_STATE, {
        type: 'CANCEL',
      }),
    ).toBe(INITIAL_MESSAGE_STATE);

    expect(
      transitionMessage(INITIAL_MESSAGE_STATE, {
        type: 'SEND',
        now: NaN,
      }),
    ).toBe(INITIAL_MESSAGE_STATE);
  });
});
