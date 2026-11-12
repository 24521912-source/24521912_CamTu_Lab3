
import { describe, expect, it } from 'vitest';

import {
  INITIAL_RELATIONSHIP_PHASE,
  RELATIONSHIP_EVENTS,
  RELATIONSHIP_PHASES,
  RELATIONSHIP_TRANSITIONS,
  canTransition,
  getAvailableEvents,
  transitionRelationship,
  type RelationshipEvent,
  type RelationshipPhase,
} from './relationshipMachine';

describe('Relationship FSM contract', () => {
  it('starts in FRIENDS', () => {
    expect(INITIAL_RELATIONSHIP_PHASE).toBe('FRIENDS');
  });

  it('has exactly four unique phases', () => {
    expect(RELATIONSHIP_PHASES).toHaveLength(4);
    expect(new Set(RELATIONSHIP_PHASES).size).toBe(4);
  });

  it('has exactly six unique events', () => {
    expect(RELATIONSHIP_EVENTS).toHaveLength(6);
    expect(new Set(RELATIONSHIP_EVENTS).size).toBe(6);
  });

  it('defines a transition entry for every phase', () => {
    expect(Object.keys(RELATIONSHIP_TRANSITIONS).sort()).toEqual(
      [...RELATIONSHIP_PHASES].sort(),
    );
  });
});

describe('Legal relationship transitions', () => {
  const legalCases: Array<
    [RelationshipPhase, RelationshipEvent, RelationshipPhase]
  > = [
    ['FRIENDS', 'START_DATING', 'DATING_NO_LOVE'],
    ['FRIENDS', 'EXIT', 'GHOSTED_EXIT'],

    ['DATING_NO_LOVE', 'RETURN_TO_FRIENDS', 'FRIENDS'],
    ['DATING_NO_LOVE', 'CONFIRM_RELATIONSHIP', 'OFFICIAL_LOVE'],
    ['DATING_NO_LOVE', 'GHOST_TIMEOUT', 'GHOSTED_EXIT'],
    ['DATING_NO_LOVE', 'EXIT', 'GHOSTED_EXIT'],

    ['OFFICIAL_LOVE', 'EXIT', 'GHOSTED_EXIT'],

    ['GHOSTED_EXIT', 'RESET', 'FRIENDS'],
  ];

  it.each(legalCases)(
    '%s + %s -> %s',
    (currentPhase, event, expectedPhase) => {
      expect(canTransition(currentPhase, event)).toBe(true);

      expect(
        transitionRelationship(currentPhase, event),
      ).toBe(expectedPhase);
    },
  );
});

describe('Illegal relationship transitions', () => {
  it('cannot confirm love directly from FRIENDS', () => {
    expect(
      canTransition('FRIENDS', 'CONFIRM_RELATIONSHIP'),
    ).toBe(false);

    expect(
      transitionRelationship(
        'FRIENDS',
        'CONFIRM_RELATIONSHIP',
      ),
    ).toBe('FRIENDS');
  });

  it('cannot trigger ghost timeout from FRIENDS', () => {
    expect(
      transitionRelationship('FRIENDS', 'GHOST_TIMEOUT'),
    ).toBe('FRIENDS');
  });

  it('cannot restart dating from OFFICIAL_LOVE', () => {
    expect(
      transitionRelationship(
        'OFFICIAL_LOVE',
        'START_DATING',
      ),
    ).toBe('OFFICIAL_LOVE');
  });

  it('cannot leave GHOSTED_EXIT except via RESET', () => {
    for (const event of RELATIONSHIP_EVENTS) {
      if (event === 'RESET') {
        continue;
      }

      expect(canTransition('GHOSTED_EXIT', event)).toBe(
        false,
      );

      expect(
        transitionRelationship('GHOSTED_EXIT', event),
      ).toBe('GHOSTED_EXIT');
    }
  });

  it('keeps all illegal phase/event pairs unchanged', () => {
    for (const phase of RELATIONSHIP_PHASES) {
      for (const event of RELATIONSHIP_EVENTS) {
        const legal = canTransition(phase, event);
        const next = transitionRelationship(phase, event);

        expect(RELATIONSHIP_PHASES).toContain(next);

        if (!legal) {
          expect(next).toBe(phase);
        }
      }
    }
  });
});

describe('FSM utility functions', () => {
  it('returns legal events for DATING_NO_LOVE', () => {
    expect(getAvailableEvents('DATING_NO_LOVE')).toEqual([
      'RETURN_TO_FRIENDS',
      'CONFIRM_RELATIONSHIP',
      'GHOST_TIMEOUT',
      'EXIT',
    ]);
  });

  it('returns only RESET for GHOSTED_EXIT', () => {
    expect(getAvailableEvents('GHOSTED_EXIT')).toEqual([
      'RESET',
    ]);
  });

  it('does not expose internal event arrays', () => {
    const events = getAvailableEvents('FRIENDS');

    events.push('RESET');

    expect(getAvailableEvents('FRIENDS')).toEqual([
      'START_DATING',
      'EXIT',
    ]);
  });

  it('produces deterministic results', () => {
    const phase: RelationshipPhase = 'FRIENDS';
    const event: RelationshipEvent = 'START_DATING';

    const first = transitionRelationship(phase, event);
    const second = transitionRelationship(phase, event);

    expect(first).toBe(second);
    expect(phase).toBe('FRIENDS');
  });

  it('supports a valid multi-step scenario', () => {
    let phase: RelationshipPhase =
      INITIAL_RELATIONSHIP_PHASE;

    phase = transitionRelationship(phase, 'START_DATING');
    expect(phase).toBe('DATING_NO_LOVE');

    phase = transitionRelationship(
      phase,
      'CONFIRM_RELATIONSHIP',
    );
    expect(phase).toBe('OFFICIAL_LOVE');

    phase = transitionRelationship(phase, 'EXIT');
    expect(phase).toBe('GHOSTED_EXIT');

    phase = transitionRelationship(phase, 'RESET');
    expect(phase).toBe('FRIENDS');
  });
});
