import { useEffect, useRef, useState } from "react";
import {
  PianoSynth,
  MAX_VOICES,
  type ActiveVoice,
} from "./PianoSynth";

const TEST_NOTES = [
  { midi: 60, name: "C4" },
  { midi: 62, name: "D4" },
  { midi: 64, name: "E4" },
  { midi: 65, name: "F4" },
  { midi: 67, name: "G4" },
  { midi: 69, name: "A4" },
  { midi: 71, name: "B4" },
  { midi: 72, name: "C5" },
] as const;

export default function SynthTestPanel() {
  const synthRef = useRef<PianoSynth | null>(null);

  const [voices, setVoices] = useState<
    readonly ActiveVoice[]
  >([]);

  const [lastEvent, setLastEvent] = useState(
    "No events yet"
  );

  const [error, setError] = useState("");

  useEffect(() => {
    const synth = new PianoSynth();
    synthRef.current = synth;

    const unsubscribe = synth.subscribe(
      (current, event) => {
        setVoices(current);

        if (event) {
          setLastEvent(
            `Voice #${event.voice.id} - MIDI ${event.voice.midi}: ${event.reason}`
          );
        }
      }
    );

    return () => {
      unsubscribe();
      synth.dispose();

      if (synthRef.current === synth) {
        synthRef.current = null;
      }
    };
  }, []);

  async function execute(
    action: (synth: PianoSynth) => void
  ): Promise<void> {
    const synth = synthRef.current;
    if (!synth) return;

    setError("");

    try {
      await synth.unlock();

      if (synthRef.current !== synth) {
        return;
      }

      action(synth);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unknown audio error"
      );
    }
  }

  function addNote(midi: number): void {
    void execute(synth => synth.noteOn(midi));
  }

  function fillEight(): void {
    void execute(synth => {
      synth.stopAll();

      for (const note of TEST_NOTES) {
        synth.noteOn(note.midi);
      }
    });
  }

  function releaseOldest(): void {
    const synth = synthRef.current;
    if (!synth) return;

    const oldest = synth.getActiveVoices()[0];

    if (oldest) {
      synth.noteOff(oldest.id);
    }
  }

  function stopAll(): void {
    synthRef.current?.stopAll();
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Task 04 - Audio Engine Test</h1>

      <p>
        Web Audio API | 8 concurrent voices | FIFO
      </p>

      <section aria-labelledby="test-controls">
        <h2 id="test-controls">Audio controls</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <button
            type="button"
            onClick={() => addNote(69)}
          >
            Play A4 (440 Hz)
          </button>

          <button type="button" onClick={fillEight}>
            Fill 8 Voices
          </button>

          <button
            type="button"
            onClick={() => addNote(74)}
          >
            Add 9th Voice (D5)
          </button>

          <button
            type="button"
            onClick={releaseOldest}
          >
            Release Oldest
          </button>

          <button type="button" onClick={stopAll}>
            Stop All
          </button>
        </div>
      </section>

      <section aria-labelledby="voice-status">
        <h2 id="voice-status">
          Active Voices: {voices.length}/{MAX_VOICES}
        </h2>

        <p aria-live="polite">{lastEvent}</p>

        <ol>
          {voices.map(voice => (
            <li key={voice.id}>
              Voice #{voice.id} - MIDI {voice.midi}
              {" - "}
              {voice.freqHz.toFixed(2)} Hz
            </li>
          ))}
        </ol>

        {voices.length === 0 && (
          <p>No active voices.</p>
        )}
      </section>

      {error && <p role="alert">{error}</p>}

      <p>
        Lower your speaker volume before testing
        multiple simultaneous notes.
      </p>
    </main>
  );
}