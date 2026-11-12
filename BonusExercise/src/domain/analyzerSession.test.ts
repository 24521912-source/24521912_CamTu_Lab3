
import { describe, expect, it } from 'vitest';

import {
  INITIAL_ANALYZER_SESSION,
  analyzerSessionReducer,
} from './analyzerSession';

const dating = analyzerSessionReducer(
  INITIAL_ANALYZER_SESSION,
  { type: 'PHASE_EVENT', event: 'START_DATING' },
);

describe('Analyzer session integration', () => {
  it('only sends while dating', () => {
    expect(
      analyzerSessionReducer(INITIAL_ANALYZER_SESSION, {
        type: 'SEND',
        now: 1000,
      }),
    ).toBe(INITIAL_ANALYZER_SESSION);
  });

  it('ghosts only after the correct deadline', () => {
    const waiting = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const early = analyzerSessionReducer(waiting, {
      type: 'TIMEOUT',
      requestId: 1,
      now: 5999,
    });

    expect(early).toBe(waiting);

    const expired = analyzerSessionReducer(waiting, {
      type: 'TIMEOUT',
      requestId: 1,
      now: 6000,
    });

    expect(expired.phase).toBe('GHOSTED_EXIT');
    expect(expired.message.status).toBe('TIMED_OUT');
  });

  it('does not ghost after a reply', () => {
    const waiting = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const replied = analyzerSessionReducer(waiting, {
      type: 'REPLY',
    });

    const late = analyzerSessionReducer(replied, {
      type: 'TIMEOUT',
      requestId: 1,
      now: 6000,
    });

    expect(late.phase).toBe('DATING_NO_LOVE');
    expect(late.message.status).toBe('REPLIED');
  });

  it('cancels on phase change', () => {
    const waiting = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const committed = analyzerSessionReducer(waiting, {
      type: 'PHASE_EVENT',
      event: 'CONFIRM_RELATIONSHIP',
    });

    expect(committed.phase).toBe('OFFICIAL_LOVE');
    expect(committed.message.status).toBe('CANCELLED');

    expect(
      analyzerSessionReducer(committed, {
        type: 'TIMEOUT',
        requestId: 1,
        now: 6000,
      }),
    ).toBe(committed);
  });

  it('cancels on switching to AI_DO', () => {
    const waiting = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const switched = analyzerSessionReducer(waiting, {
      type: 'SWITCH_TO_AI_DO',
    });

    expect(switched.message.status).toBe('CANCELLED');
    expect(switched.phase).toBe('DATING_NO_LOVE');
  });

  it('cancels on manual exit', () => {
    const waiting = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const exited = analyzerSessionReducer(waiting, {
      type: 'PHASE_EVENT',
      event: 'EXIT',
    });

    expect(exited.phase).toBe('GHOSTED_EXIT');
    expect(exited.message.status).toBe('CANCELLED');
  });

  it('ignores stale request after resending', () => {
    const first = analyzerSessionReducer(dating, {
      type: 'SEND',
      now: 1000,
    });

    const second = analyzerSessionReducer(first, {
      type: 'SEND',
      now: 4000,
    });

    const stale = analyzerSessionReducer(second, {
      type: 'TIMEOUT',
      requestId: 1,
      now: 6000,
    });

    expect(stale).toBe(second);
    expect(stale.message.requestId).toBe(2);
    expect(stale.message.deadline).toBe(9000);
  });

  it('does not allow manual GHOST_TIMEOUT', () => {
    expect(
      analyzerSessionReducer(dating, {
        type: 'PHASE_EVENT',
        event: 'GHOST_TIMEOUT',
      }),
    ).toBe(dating);
  });
});
