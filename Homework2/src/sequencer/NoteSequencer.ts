import type { RecordedNoteEvent } from "../piano/types";

export type PlaybackSpeed = 0.5 | 1 | 2;

export interface PlaybackSink {
  noteOn(midi: number): number;
  noteOff(voiceId: number): void;
}

interface PlaybackRun {
  controller: AbortController;
  voices: Set<number>;
  sink: PlaybackSink;
}

function abortError(): Error {
  const error = new Error("Sequence playback cancelled");
  error.name = "AbortError";
  return error;
}

/**
 * Abortable JavaScript delay.
 * Clears its timeout and abort listener on completion.
 */
function waitMs(
  delayMs: number,
  signal: AbortSignal
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }

    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, Math.max(0, delayMs));

    function onAbort(): void {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
      reject(abortError());
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function validateEvents(
  events: readonly RecordedNoteEvent[]
): void {
  for (const event of events) {
    if (
      !Number.isInteger(event.midi) ||
      event.midi < 21 ||
      event.midi > 108 ||
      !Number.isFinite(event.freqHz) ||
      event.freqHz <= 0 ||
      !Number.isFinite(event.durationMs) ||
      event.durationMs < 0 ||
      !Number.isFinite(event.deltaMs) ||
      event.deltaMs < 0
    ) {
      throw new RangeError("Invalid recorded note event");
    }
  }
}

export class NoteSequencer {
  private current: PlaybackRun | null = null;

  get isPlaying(): boolean {
    return this.current !== null;
  }

  /**
   * Replay events in original note-on order.
   *
   * deltaMs: difference between consecutive note-on events.
   * durationMs: duration of the individual note.
   *
   * Uses absolute target times for note-on events
   * to reduce accumulated scheduling drift.
   */
  async play(
    events: readonly RecordedNoteEvent[],
    speed: PlaybackSpeed,
    sink: PlaybackSink
  ): Promise<void> {
    if (this.current) {
      throw new Error("Sequence is already playing");
    }

    if (speed !== 0.5 && speed !== 1 && speed !== 2) {
      throw new RangeError("Unsupported playback speed");
    }

    validateEvents(events);

    if (events.length === 0) {
      return;
    }

    // Snapshot the input to avoid external modifications.
    const notes = events.map((event) => ({ ...event }));

    const run: PlaybackRun = {
      controller: new AbortController(),
      voices: new Set<number>(),
      sink,
    };

    this.current = run;

    const signal = run.controller.signal;
    const startTime = performance.now();

    let elapsedMs = 0;

    const releaseVoice = (voiceId: number): void => {
      if (!run.voices.delete(voiceId)) {
        return;
      }

      sink.noteOff(voiceId);
    };

    const noteEndTasks: Promise<void>[] = [];

    try {
      for (const note of notes) {
        // Calculate target note-on time.
        elapsedMs += note.deltaMs / speed;

        const targetTime = startTime + elapsedMs;

        await waitMs(
          Math.max(0, targetTime - performance.now()),
          signal
        );

        if (signal.aborted) {
          break;
        }

        const voiceId = sink.noteOn(note.midi);
        run.voices.add(voiceId);

        // Each note finishes independently.
        // Overlapping notes therefore remain overlapping.
        const endTime =
          performance.now() + note.durationMs / speed;

        const endTask = (async () => {
          await waitMs(
            Math.max(0, endTime - performance.now()),
            signal
          );

          releaseVoice(voiceId);
        })();

        noteEndTasks.push(endTask);
      }

      // Wait for all note durations to finish.
      await Promise.all(noteEndTasks);
    } catch (error) {
      // Cancellation is an expected result of Stop Sequence.
      if (!signal.aborted) {
        throw error;
      }
    } finally {
      run.controller.abort();

      // Release only voices owned by this replay.
      for (const voiceId of Array.from(run.voices)) {
        releaseVoice(voiceId);
      }

      // Ensure no delay promises remain outstanding.
      await Promise.allSettled(noteEndTasks);

      if (this.current === run) {
        this.current = null;
      }
    }
  }

  /**
   * Cancel pending waits and release replay voices.
   * Safe to call repeatedly.
   */
  stop(): void {
    const run = this.current;

    if (!run) {
      return;
    }

    this.current = null;
    run.controller.abort();

    for (const voiceId of Array.from(run.voices)) {
      run.voices.delete(voiceId);
      run.sink.noteOff(voiceId);
    }
  }

  dispose(): void {
    this.stop();
  }
}