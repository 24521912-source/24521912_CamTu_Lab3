/**
 * Unique identifier of a physical piano key.
 * Example: "midi-69" represents A4.
 */
export type PianoNoteId = `midi-${number}`;

/**
 * Immutable data describing a piano key.
 */
export interface PianoNote {
  readonly id: PianoNoteId;
  readonly midi: number;
  readonly name: string;
  readonly octave: number;
  readonly pitchClass: number;
  readonly freqHz: number;
  readonly isBlack: boolean;
  readonly isWhite: boolean;
}

/**
 * Contract for a recorded note.
 *
 * durationMs: time between note-on and note-off.
 * deltaMs: time since the preceding recorded note-on.
 * Both values are measured in milliseconds.
 *
 * Recording behavior will be implemented in Task 07.
 */
export interface RecordedNoteEvent {
  readonly midi: number;
  readonly freqHz: number;
  readonly durationMs: number;
  readonly deltaMs: number;
}