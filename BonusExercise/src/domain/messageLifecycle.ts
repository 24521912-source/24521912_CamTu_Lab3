
export const MESSAGE_TIMEOUT_MS = 5_000;

export type MessageStatus =
  | 'IDLE'
  | 'WAITING'
  | 'REPLIED'
  | 'CANCELLED'
  | 'TIMED_OUT';

export interface MessageState {
  readonly status: MessageStatus;
  readonly requestId: number;
  readonly deadline: number | null;
}

export const INITIAL_MESSAGE_STATE: MessageState = {
  status: 'IDLE',
  requestId: 0,
  deadline: null,
};

export type MessageEvent =
  | { readonly type: 'SEND'; readonly now: number }
  | { readonly type: 'REPLY' }
  | { readonly type: 'CANCEL' }
  | {
      readonly type: 'TIMEOUT';
      readonly requestId: number;
      readonly now: number;
    };

export function transitionMessage(
  state: MessageState,
  event: MessageEvent,
): MessageState {
  switch (event.type) {
    case 'SEND': {
      if (!Number.isFinite(event.now)) {
        return state;
      }

      if (state.requestId >= Number.MAX_SAFE_INTEGER) {
        return state;
      }

      return {
        status: 'WAITING',
        requestId: state.requestId + 1,
        deadline: event.now + MESSAGE_TIMEOUT_MS,
      };
    }

    case 'REPLY':
      if (state.status !== 'WAITING') {
        return state;
      }

      return {
        ...state,
        status: 'REPLIED',
        deadline: null,
      };

    case 'CANCEL':
      if (state.status !== 'WAITING') {
        return state;
      }

      return {
        ...state,
        status: 'CANCELLED',
        deadline: null,
      };

    case 'TIMEOUT':
      if (
        state.status !== 'WAITING' ||
        state.requestId !== event.requestId ||
        state.deadline === null ||
        !Number.isFinite(event.now) ||
        event.now < state.deadline
      ) {
        return state;
      }

      return {
        ...state,
        status: 'TIMED_OUT',
        deadline: null,
      };
  }
}
