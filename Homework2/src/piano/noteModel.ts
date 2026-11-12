import type { PianoNote } from "./types";

export const MIN_MIDI = 21;
export const MAX_MIDI = 108;
export const TOTAL_KEYS = MAX_MIDI - MIN_MIDI + 1;

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
] as const;

const BLACK_PITCH_CLASSES = new Set<number>([
  1, 3, 6, 8, 10,
]);

export function isValidMidi(midi: number): boolean {
  return (
    Number.isInteger(midi) &&
    midi >= MIN_MIDI &&
    midi <= MAX_MIDI
  );
}

export function getFrequency(midi: number): number {
  if (!isValidMidi(midi)) {
    throw new RangeError(
      "MIDI must be an integer between 21 and 108"
    );
  }

  return 440 * 2 ** ((midi - 69) / 12);
}

export function isBlackKey(midi: number): boolean {
  if (!isValidMidi(midi)) {
    throw new RangeError(
      "MIDI must be an integer between 21 and 108"
    );
  }

  return BLACK_PITCH_CLASSES.has(midi % 12);
}

export function createNote(midi: number): PianoNote {
  if (!isValidMidi(midi)) {
    throw new RangeError(
      "MIDI must be an integer between 21 and 108"
    );
  }

  const pitchClass = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = `${NOTE_NAMES[pitchClass]}${octave}`;
  const isBlack = isBlackKey(midi);

  return Object.freeze({
    id: `midi-${midi}` as const,
    midi,
    name,
    octave,
    pitchClass,
    freqHz: getFrequency(midi),
    isBlack,
    isWhite: !isBlack,
  });
}

export function generatePianoNotes(): readonly PianoNote[] {
  const notes = Array.from(
    { length: TOTAL_KEYS },
    (_, index) => createNote(MIN_MIDI + index)
  );

  return Object.freeze(notes);
}

export const PIANO_NOTES = generatePianoNotes();