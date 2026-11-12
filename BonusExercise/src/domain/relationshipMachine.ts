
export const RELATIONSHIP_PHASES = [
  'FRIENDS',
  'DATING_NO_LOVE',
  'OFFICIAL_LOVE',
  'GHOSTED_EXIT',
] as const;

export type RelationshipPhase =
  (typeof RELATIONSHIP_PHASES)[number];

export const RELATIONSHIP_EVENTS = [
  'START_DATING',
  'RETURN_TO_FRIENDS',
  'CONFIRM_RELATIONSHIP',
  'GHOST_TIMEOUT',
  'EXIT',
  'RESET',
] as const;

export type RelationshipEvent =
  (typeof RELATIONSHIP_EVENTS)[number];

export const INITIAL_RELATIONSHIP_PHASE: RelationshipPhase =
  'FRIENDS';

export const RELATIONSHIP_TRANSITIONS = {
  FRIENDS: {
    START_DATING: 'DATING_NO_LOVE',
    EXIT: 'GHOSTED_EXIT',
  },

  DATING_NO_LOVE: {
    RETURN_TO_FRIENDS: 'FRIENDS',
    CONFIRM_RELATIONSHIP: 'OFFICIAL_LOVE',
    GHOST_TIMEOUT: 'GHOSTED_EXIT',
    EXIT: 'GHOSTED_EXIT',
  },

  OFFICIAL_LOVE: {
    EXIT: 'GHOSTED_EXIT',
  },

  GHOSTED_EXIT: {
    RESET: 'FRIENDS',
  },
} as const satisfies Record<
  RelationshipPhase,
  Partial<Record<RelationshipEvent, RelationshipPhase>>
>;

export function transitionRelationship(
  currentPhase: RelationshipPhase,
  event: RelationshipEvent,
): RelationshipPhase {
  const transitions: Partial<
    Record<RelationshipEvent, RelationshipPhase>
  > = RELATIONSHIP_TRANSITIONS[currentPhase];

  return transitions[event] ?? currentPhase;
}

export function canTransition(
  currentPhase: RelationshipPhase,
  event: RelationshipEvent,
): boolean {
  const transitions: Partial<
    Record<RelationshipEvent, RelationshipPhase>
  > = RELATIONSHIP_TRANSITIONS[currentPhase];

  return Object.prototype.hasOwnProperty.call(
    transitions,
    event,
  );
}

export function getAvailableEvents(
  currentPhase: RelationshipPhase,
): RelationshipEvent[] {
  const transitions: Partial<
    Record<RelationshipEvent, RelationshipPhase>
  > = RELATIONSHIP_TRANSITIONS[currentPhase];

  return RELATIONSHIP_EVENTS.filter((event) =>
    Object.prototype.hasOwnProperty.call(
      transitions,
      event,
    ),
  );
}
