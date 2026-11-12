import { useCallback, useEffect, useRef, useState } from "react";
import { PIANO_NOTES } from "../piano/noteModel";
import { PianoSynth } from "../audio/PianoSynth";
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

const WHITE_NOTES = PIANO_NOTES.filter((note) => note.isWhite);

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

export default function PianoKeyboard() {
  const synthRef = useRef<PianoSynth | null>(null);
  const sessionsRef = useRef(new Map<number, NoteSession>());

  const [pressed, setPressed] = useState<ReadonlySet<number>>(
    () => new Set<number>()
  );
  const [activeCount, setActiveCount] = useState(0);
  const [error, setError] = useState("");

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

    const unsubscribe = synth.subscribe((voices, event) => {
      setActiveCount(voices.length);

      if (event?.reason === "stolen" || event?.reason === "stopped") {
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

      // Audio activation may be asynchronous.
      // A released note must not start playing afterward.
      void synth.unlock().then(
        () => {
          if (sessionsRef.current.get(midi) !== session) return;

          const voiceId = synth.noteOn(midi);
          session.voiceId = voiceId;

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

  function stopAllNotes() {
    for (const session of sessionsRef.current.values()) {
      if (session.timer !== undefined) {
        clearTimeout(session.timer);
      }
    }

    sessionsRef.current.clear();
    synthRef.current?.stopAll();
    refreshPressed();
  }

  const blackNoteMap = new Map(
    PIANO_NOTES.filter((note) => note.isBlack).map(
      (note) => [note.midi, note]
    )
  );

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
            <p>
              88 keys · 52 white · 36 black · A0–C8
            </p>
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
          Use a mouse or touch to hold notes. Press Tab to
          focus a key, then Enter or Space to play a short note.
          Scroll horizontally to reach the full keyboard.
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
              const note = blackNoteMap.get(midi);

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
      </section>
    </main>
  );
}