
import {
  INITIAL_RELATIONSHIP_PHASE,
  canTransition,
  transitionRelationship,
  type RelationshipEvent,
  type RelationshipPhase,
} from './relationshipMachine';

import {
  INITIAL_MESSAGE_STATE,
  transitionMessage,
  type MessageState,
} from './messageLifecycle';

export interface AnalyzerSession {
  readonly phase: RelationshipPhase;
  readonly message: MessageState;
}

export const INITIAL_ANALYZER_SESSION: AnalyzerSession = {
  phase: INITIAL_RELATIONSHIP_PHASE,
  message: INITIAL_MESSAGE_STATE,
};

export type AnalyzerAction =
  | {
      readonly type: 'PHASE_EVENT';
      readonly event: RelationshipEvent;
    }
  | { readonly type: 'SEND'; readonly now: number }
  | { readonly type: 'REPLY' }
  | { readonly type: 'CANCEL' }
  | { readonly type: 'SWITCH_TO_AI_DO' }
  | {
      readonly type: 'TIMEOUT';
      readonly requestId: number;
      readonly now: number;
    };

export function analyzerSessionReducer(
  state: AnalyzerSession,
  action: AnalyzerAction,
): AnalyzerSession {
  switch (action.type) {
    case 'PHASE_EVENT': {
      // Timer timeout is never a user-triggered phase button.
      if (
        action.event === 'GHOST_TIMEOUT' ||
        !canTransition(state.phase, action.event)
      ) {
        return state;
      }

      return {
        phase: transitionRelationship(
          state.phase,
          action.event,
        ),
        message: transitionMessage(state.message, {
          type: 'CANCEL',
        }),
      };
    }

    case 'SEND': {
      if (state.phase !== 'DATING_NO_LOVE') {
        return state;
      }

      const message = transitionMessage(state.message, {
        type: 'SEND',
        now: action.now,
      });

      return message === state.message
        ? state
        : { ...state, message };
    }

    case 'REPLY':
    case 'CANCEL': {
      const message = transitionMessage(state.message, {
        type: action.type,
      });

      return message === state.message
        ? state
        : { ...state, message };
    }

    case 'SWITCH_TO_AI_DO': {
      const message = transitionMessage(state.message, {
        type: 'CANCEL',
      });

      return message === state.message
        ? state
        : { ...state, message };
    }

    case 'TIMEOUT': {
      if (state.phase !== 'DATING_NO_LOVE') {
        return state;
      }

      const message = transitionMessage(state.message, {
        type: 'TIMEOUT',
        requestId: action.requestId,
        now: action.now,
      });

      if (message.status !== 'TIMED_OUT') {
        return state;
      }

      if (!canTransition(state.phase, 'GHOST_TIMEOUT')) {
        return state;
      }

      return {
        phase: transitionRelationship(
          state.phase,
          'GHOST_TIMEOUT',
        ),
        message,
      };
    }
  }
}
