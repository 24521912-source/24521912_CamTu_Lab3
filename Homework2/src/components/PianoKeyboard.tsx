import { useCallback, useEffect, useRef, useState } from "react";
import { PIANO_NOTES } from "../piano/noteModel";
import type { RecordedNoteEvent } from "../piano/types";
import { PianoSynth } from "../audio/PianoSynth";
import { NoteRecorder } from "../recording/NoteRecorder";
import ReplayControls from "./ReplayControls";
import PianoKey from "./PianoKey";
import styles from "./PianoKeyboard.module.css";


const WHITE_WIDTH = 44;
const BLACK_WIDTH = 28;
const KEYBOARD_TAP_MS = 220;

interface NoteSession {
  kind: "pointer" | "tap";
  pointerId?: number;
  voiceId?: number;
  timer?: ReturnType<typeof setTimeout>;
}

const WHITE_NOTES = PIANO_NOTES.filter(
  (note) => note.isWhite
);

const BLACK_NOTES = (() => {
  let whiteCount = 0;
  const positions: Array<{ midi: number; left: number }> = [];

  for (const note of PIANO_NOTES) {
    if (note.isWhite) {
      whiteCount++;
    } else {
      positions.push({
        midi: note.midi,
        left: whiteCount * WHITE_WIDTH - BLACK_WIDTH / 2,
      });
    }
  }

  return positions;
})();

const BLACK_NOTE_MAP = new Map(
  PIANO_NOTES.filter((note) => note.isBlack).map(
    (note) => [note.midi, note]
  )
);

export default function PianoKeyboard() {
  const synthRef = useRef<PianoSynth | null>(null);
  const sessionsRef = useRef(new Map<number, NoteSession>());

  const recorderRef = useRef<NoteRecorder | null>(null);

  if (recorderRef.current === null) {
    recorderRef.current = new NoteRecorder();
  }

  const [pressed, setPressed] = useState<ReadonlySet<number>>(
    () => new Set<number>()
  );
  const [activeCount, setActiveCount] = useState(0);
  const [error, setError] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<
    readonly RecordedNoteEvent[]
  >([]);

  const refreshPressed = useCallback(() => {
    setPressed(new Set(sessionsRef.current.keys()));
  }, []);

  const endSession = useCallback(
    (midi: number, pointerId?: number) => {
      const session = sessionsRef.current.get(midi);

      if (!session) return;

      if (
        pointerId !== undefined &&
        (session.kind !== "pointer" ||
          session.pointerId !== pointerId)
      ) {
        return;
      }

      sessionsRef.current.delete(midi);

      if (session.timer !== undefined) {
        clearTimeout(session.timer);
      }

      if (session.voiceId !== undefined) {
        synthRef.current?.noteOff(session.voiceId);
      }

      refreshPressed();
    },
    [refreshPressed]
  );

  useEffect(() => {
    const synth = new PianoSynth();
    synthRef.current = synth;

    const recorder = recorderRef.current!;

    const unsubscribe = synth.subscribe((voices, event) => {
      setActiveCount(voices.length);

      if (event) {
        // Record the actual end of the audio voice.
        // This also covers FIFO voice stealing.
        recorder.noteOff(event.voice.id, performance.now());
        setRecordedNotes(recorder.getEvents());

        if (
          event.reason === "stolen" ||
          event.reason === "stopped"
        ) {
          for (const [midi, session] of sessionsRef.current) {
            if (session.voiceId === event.voice.id) {
              sessionsRef.current.delete(midi);

              if (session.timer !== undefined) {
                clearTimeout(session.timer);
              }

              refreshPressed();
              break;
            }
          }
        }
      }
    });

    const handleBlur = () => {
      for (const session of sessionsRef.current.values()) {
        if (session.timer !== undefined) {
          clearTimeout(session.timer);
        }
      }

      sessionsRef.current.clear();
      synth.stopAll();
      refreshPressed();
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
      unsubscribe();

      recorder.stop(performance.now());

      for (const session of sessionsRef.current.values()) {
        if (session.timer !== undefined) {
          clearTimeout(session.timer);
        }
      }

      sessionsRef.current.clear();
      synth.dispose();

      if (synthRef.current === synth) {
        synthRef.current = null;
      }
    };
  }, [refreshPressed]);

  const startSession = useCallback(
    (
      midi: number,
      kind: "pointer" | "tap",
      pointerId?: number
    ) => {
      if (sessionsRef.current.has(midi)) return;

      const synth = synthRef.current;
      if (!synth) return;

      const session: NoteSession = { kind, pointerId };

      sessionsRef.current.set(midi, session);
      refreshPressed();
      setError("");

      void synth.unlock().then(
        () => {
          if (sessionsRef.current.get(midi) !== session) return;

          const voiceId = synth.noteOn(midi);
          session.voiceId = voiceId;

          // Record only notes that successfully start playing.
          const recorder = recorderRef.current;

          if (recorder?.isRecording) {
            recorder.noteOn(
              voiceId,
              midi,
              PIANO_NOTES[midi - 21].freqHz,
              performance.now()
            );
          }

          if (kind === "tap") {
            session.timer = setTimeout(() => {
              endSession(midi);
            }, KEYBOARD_TAP_MS);
          }
        },
        (cause: unknown) => {
          if (sessionsRef.current.get(midi) === session) {
            sessionsRef.current.delete(midi);
            refreshPressed();
          }

          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to initialize audio"
          );
        }
      ).catch((cause: unknown) => {
        if (sessionsRef.current.get(midi) === session) {
          sessionsRef.current.delete(midi);
          refreshPressed();
        }

        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to play note"
        );
      });
    },
    [endSession, refreshPressed]
  );

  const onStart = useCallback(
    (midi: number, pointerId: number) => {
      startSession(midi, "pointer", pointerId);
    },
    [startSession]
  );

  const onEnd = useCallback(
    (midi: number, pointerId: number) => {
      endSession(midi, pointerId);
    },
    [endSession]
  );

  const onTap = useCallback(
    (midi: number) => {
      startSession(midi, "tap");
    },
    [startSession]
  );

  const stopAllNotes = useCallback(() => {
    for (const session of sessionsRef.current.values()) {
      if (session.timer !== undefined) {
        clearTimeout(session.timer);
      }
    }

    sessionsRef.current.clear();
    synthRef.current?.stopAll();
    refreshPressed();
  }, [refreshPressed]);

function startRecording(): void {
  if (isRecording || isPlaying) return;

    recorderRef.current?.start();
    setRecordedNotes([]);
    setIsRecording(true);
  }

  function stopRecording(): void {
    if (!isRecording) return;

    const notes = recorderRef.current?.stop(performance.now()) ?? [];

    setRecordedNotes(notes);
    setIsRecording(false);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>88-Key Polyphonic Piano</h1>
        <p>React 19 · TypeScript · Web Audio API</p>
      </header>

      <section
        className={styles.panel}
        aria-labelledby="piano-heading"
      >
        <div className={styles.toolbar}>
          <div>
            <h2 id="piano-heading">Piano Keyboard</h2>
            <p>88 keys · 52 white · 36 black · A0–C8</p>
          </div>

          <div className={styles.controls}>
            <span aria-live="polite">
              Active voices: {activeCount}/8
            </span>

            <button
              type="button"
              className={styles.stopButton}
              onClick={stopAllNotes}
            >
              Stop All Notes
            </button>
          </div>
        </div>

        <p className={styles.instructions}>
          Hold a key with a mouse or touch.
          Use Tab and Enter/Space for keyboard activation.
          Scroll horizontally to reach all 88 keys.
        </p>

        <div
          className={styles.scrollArea}
          role="region"
          aria-label="Scrollable 88-key piano"
          tabIndex={0}
        >
          <div
            className={styles.keyboard}
            style={{ width: WHITE_NOTES.length * WHITE_WIDTH }}
          >
            <div className={styles.whiteRow}>
              {WHITE_NOTES.map((note) => (
                <PianoKey
                  key={note.id}
                  note={note}
                  isPressed={pressed.has(note.midi)}
                  onStart={onStart}
                  onEnd={onEnd}
                  onTap={onTap}
                />
              ))}
            </div>

            {BLACK_NOTES.map(({ midi, left }) => {
              const note = BLACK_NOTE_MAP.get(midi);
              if (!note) return null;

              return (
                <PianoKey
                  key={note.id}
                  note={note}
                  left={left}
                  isPressed={pressed.has(note.midi)}
                  onStart={onStart}
                  onEnd={onEnd}
                  onTap={onTap}
                />
              );
            })}
          </div>
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            Audio error: {error}
          </p>
        )}

        <section
          aria-labelledby="recording-heading"
          style={{ marginTop: 28 }}
        >
          <h2 id="recording-heading">FIFO Note Recording</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={startRecording}
              disabled={isRecording || isPlaying}
            >
              Start Recording
            </button>

            <button
              type="button"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              Stop Recording
            </button>
          </div>

          <p role="status">
            {isRecording
              ? "Recording in progress"
              : "Recording stopped"}
            {" · "}
            {recordedNotes.length} completed note events
          </p>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <caption>
                Captured notes in note-on order
              </caption>

              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">MIDI</th>
                  <th scope="col">Frequency (Hz)</th>
                  <th scope="col">Duration (ms)</th>
                  <th scope="col">Delta (ms)</th>
                </tr>
              </thead>

              <tbody>
                {recordedNotes.map((note, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{note.midi}</td>
                    <td>{note.freqHz.toFixed(2)}</td>
                    <td>{note.durationMs.toFixed(0)}</td>
                    <td>{note.deltaMs.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
                    </div>
        </section>

        <ReplayControls
          notes={recordedNotes}
          synthRef={synthRef}
          disabled={isRecording}
          onPlayingChange={setIsPlaying}
        />
      </section>
    </main>
  );
}