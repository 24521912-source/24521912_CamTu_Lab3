import { getFrequency, isValidMidi } from "../piano/noteModel";

export const MAX_VOICES = 8;

const ATTACK_TIME = 0.012;
const RELEASE_TIME = 0.04;
const MIN_GAIN = 0.0001;
const MAX_GAIN = 0.10;

export interface ActiveVoice {
  readonly id: number;
  readonly midi: number;
  readonly freqHz: number;
}

export type VoiceEndReason = "released" | "stolen" | "stopped";

export interface VoiceEndEvent {
  readonly voice: ActiveVoice;
  readonly reason: VoiceEndReason;
}

type VoiceListener = (
  voices: readonly ActiveVoice[],
  event?: VoiceEndEvent
) => void;

interface VoiceNodes {
  readonly info: ActiveVoice;
  readonly oscillator: OscillatorNode;
  readonly gain: GainNode;
}

export class PianoSynth {
  private context: AudioContext | null = null;
  private readonly voices = new Map<number, VoiceNodes>();
  private readonly listeners = new Set<VoiceListener>();
  private nextId = 1;
  private disposed = false;

  get activeVoiceCount(): number {
    return this.voices.size;
  }

  getActiveVoices(): readonly ActiveVoice[] {
    return Array.from(this.voices.values(), voice => voice.info);
  }

  subscribe(listener: VoiceListener): () => void {
    this.listeners.add(listener);
    listener(this.getActiveVoices());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event?: VoiceEndEvent): void {
    const snapshot = this.getActiveVoices();

    for (const listener of this.listeners) {
      listener(snapshot, event);
    }
  }

  // Call during a real user interaction to enable audio.
  async unlock(): Promise<void> {
    if (this.disposed) {
      throw new Error("Synthesizer has been disposed");
    }

    if (!this.context) {
      this.context = new AudioContext();
    }

    const context = this.context;

    if (context.state === "suspended") {
      await context.resume();
    }

    if (
      this.disposed ||
      this.context !== context ||
      context.state !== "running"
    ) {
      throw new Error("AudioContext is not available");
    }
  }

  noteOn(midi: number): number {
    if (!isValidMidi(midi)) {
      throw new RangeError("Invalid MIDI note");
    }

    const context = this.context;

    if (
      this.disposed ||
      !context ||
      context.state !== "running"
    ) {
      throw new Error("Unlock the audio engine first");
    }

    // FIFO: steal the first voice inserted into the Map.
    if (this.voices.size >= MAX_VOICES) {
      const oldestId = this.voices.keys().next().value;

      if (oldestId !== undefined) {
        this.releaseVoice(oldestId, "stolen");
      }
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const freqHz = getFrequency(midi);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(freqHz, now);

    gain.gain.setValueAtTime(MIN_GAIN, now);
    gain.gain.exponentialRampToValueAtTime(
      MAX_GAIN,
      now + ATTACK_TIME
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    const info: ActiveVoice = {
      id: this.nextId++,
      midi,
      freqHz,
    };

    const voice: VoiceNodes = {
      info,
      oscillator,
      gain,
    };

    oscillator.onended = () => {
      if (this.voices.get(info.id) === voice) {
        this.voices.delete(info.id);
        this.notify({ voice: info, reason: "stopped" });
      }

      oscillator.disconnect();
      gain.disconnect();
    };

    this.voices.set(info.id, voice);

    try {
      oscillator.start(now);
    } catch (error) {
      this.voices.delete(info.id);
      oscillator.onended = null;
      oscillator.disconnect();
      gain.disconnect();
      throw error;
    }

    this.notify();
    return info.id;
  }

  noteOff(voiceId: number): void {
    this.releaseVoice(voiceId, "released");
  }

  private releaseVoice(
    voiceId: number,
    reason: VoiceEndReason
  ): void {
    const voice = this.voices.get(voiceId);

    // Missing IDs are safely ignored.
    if (!voice) {
      return;
    }

    this.voices.delete(voiceId);

    const context = this.context;

    if (context && context.state !== "closed") {
      const now = context.currentTime;
      const envelope = voice.gain.gain;

      envelope.cancelScheduledValues(now);
      envelope.setValueAtTime(
        Math.max(envelope.value, MIN_GAIN),
        now
      );
      envelope.exponentialRampToValueAtTime(
        MIN_GAIN,
        now + RELEASE_TIME
      );

      voice.oscillator.stop(now + RELEASE_TIME + 0.005);
    } else {
      try {
        voice.oscillator.stop();
      } catch {
        // Already stopped or context already closed.
      }
    }

    this.notify({ voice: voice.info, reason });
  }

  stopAll(): void {
    const ids = Array.from(this.voices.keys());

    for (const id of ids) {
      this.releaseVoice(id, "stopped");
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    // Stop all active nodes immediately on final teardown.
    for (const voice of this.voices.values()) {
      voice.oscillator.onended = null;

      try {
        voice.oscillator.stop();
      } catch {
        // Safe if already stopped.
      }

      voice.oscillator.disconnect();
      voice.gain.disconnect();
    }

    this.voices.clear();
    this.listeners.clear();

    const context = this.context;
    this.context = null;

    if (context && context.state !== "closed") {
      void context.close().catch(() => {
        // Ignore an already-closing audio context.
      });
    }
  }
}