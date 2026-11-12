import type { RecordedNoteEvent } from "../piano/types";

interface NoteEntry {
  readonly voiceId: number;
  readonly midi: number;
  readonly freqHz: number;
  readonly startMs: number;
  readonly deltaMs: number;
  endMs: number | null;
}

export class NoteRecorder {
  private entries: NoteEntry[] = [];
  private readonly active = new Map<number, NoteEntry>();
  private previousStartMs: number | null = null;
  private recording = false;

  get isRecording(): boolean {
    return this.recording;
  }

  /**
   * Begin a new recording.
   * Previous events are cleared.
   * Notes already playing before this call are not recorded.
   */
  start(): void {
    this.entries = [];
    this.active.clear();
    this.previousStartMs = null;
    this.recording = true;
  }

  /**
   * Capture note-on only after the synth has started a voice.
   * voiceId identifies one specific audio voice, not just a pitch.
   */
  noteOn(
    voiceId: number,
    midi: number,
    freqHz: number,
    atMs: number
  ): void {
    if (!this.recording) return;

    if (!Number.isSafeInteger(voiceId) || voiceId <= 0) {
      throw new RangeError("Invalid voice ID");
    }

    if (!Number.isInteger(midi) || midi < 21 || midi > 108) {
      throw new RangeError("Invalid MIDI note");
    }

    if (!Number.isFinite(freqHz) || freqHz <= 0) {
      throw new RangeError("Invalid frequency");
    }

    this.validateTime(atMs);

    if (this.active.has(voiceId)) {
      throw new Error("Voice is already being recorded");
    }

    if (
      this.previousStartMs !== null &&
      atMs < this.previousStartMs
    ) {
      throw new RangeError("Note-on timestamps must be ordered");
    }

    const deltaMs =
      this.previousStartMs === null
        ? 0
        : atMs - this.previousStartMs;

    const entry: NoteEntry = {
      voiceId,
      midi,
      freqHz,
      startMs: atMs,
      deltaMs,
      endMs: null,
    };

    this.entries.push(entry);
    this.active.set(voiceId, entry);
    this.previousStartMs = atMs;
  }

  /**
   * Finalize one recorded voice.
   *
   * Called for normal release, FIFO stealing or Stop All.
   */
  noteOff(voiceId: number, atMs: number): void {
    const entry = this.active.get(voiceId);

    if (!entry) return;

    this.validateTime(atMs);

    if (atMs < entry.startMs) {
      throw new RangeError("Note-off precedes note-on");
    }

    entry.endMs = atMs;
    this.active.delete(voiceId);
  }

  /**
   * Stop recording, finalizing notes still held.
   * Stopping the recorder does NOT stop live audio.
   */
  stop(atMs: number): readonly RecordedNoteEvent[] {
    if (!this.recording) {
      return this.getEvents();
    }

    this.validateTime(atMs);

    for (const entry of this.active.values()) {
      if (atMs < entry.startMs) {
        throw new RangeError("Stop time precedes note-on");
      }
    }

    for (const voiceId of Array.from(this.active.keys())) {
      this.noteOff(voiceId, atMs);
    }

    this.recording = false;
    return this.getEvents();
  }

  /**
   * Return completed events in note-on order.
   * Unfinished notes are excluded until released or stopped.
   */
  getEvents(): readonly RecordedNoteEvent[] {
    return Object.freeze(
      this.entries
        .filter((entry) => entry.endMs !== null)
        .map((entry) =>
          Object.freeze({
            midi: entry.midi,
            freqHz: entry.freqHz,
            durationMs: (entry.endMs as number) - entry.startMs,
            deltaMs: entry.deltaMs,
          })
        )
    );
  }

  private validateTime(atMs: number): void {
    if (!Number.isFinite(atMs) || atMs < 0) {
      throw new RangeError(
        "Timestamp must be a non-negative finite number"
      );
    }
  }
}