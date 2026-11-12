import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import type { RecordedNoteEvent } from "../piano/types";
import type { PianoSynth } from "../audio/PianoSynth";

import {
  NoteSequencer,
  type PlaybackSpeed,
} from "../sequencer/NoteSequencer";

interface ReplayControlsProps {
  notes: readonly RecordedNoteEvent[];
  synthRef: RefObject<PianoSynth | null>;
  disabled: boolean;
  onPlayingChange: (playing: boolean) => void;
}

export default function ReplayControls({
  notes,
  synthRef,
  disabled,
  onPlayingChange,
}: ReplayControlsProps) {
  const sequencerRef = useRef<NoteSequencer | null>(null);
  const requestRef = useRef(0);

  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sequencer = new NoteSequencer();
    sequencerRef.current = sequencer;

    return () => {
      // Invalidate an in-flight AudioContext unlock.
      requestRef.current++;
      sequencer.dispose();

      if (sequencerRef.current === sequencer) {
        sequencerRef.current = null;
      }
    };
  }, []);

  async function playSequence(): Promise<void> {
    const sequencer = sequencerRef.current;
    const synth = synthRef.current;

    if (
      !sequencer ||
      !synth ||
      busy ||
      disabled ||
      notes.length === 0
    ) {
      return;
    }

    const requestId = ++requestRef.current;

    setError("");
    setBusy(true);
    onPlayingChange(true);

    try {
      // This is initiated by the user's Play button.
      await synth.unlock();

      // Stop or unmount may happen during unlock.
      if (
        requestRef.current !== requestId ||
        sequencerRef.current !== sequencer
      ) {
        return;
      }

      await sequencer.play(notes, speed, {
        noteOn: (midi) => synth.noteOn(midi),
        noteOff: (voiceId) => synth.noteOff(voiceId),
      });
    } catch (cause) {
      if (
        requestRef.current === requestId &&
        sequencerRef.current === sequencer
      ) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Sequence playback failed"
        );
      }
    } finally {
      if (
        requestRef.current === requestId &&
        sequencerRef.current === sequencer
      ) {
        setBusy(false);
        onPlayingChange(false);
      }
    }
  }

  function stopSequence(): void {
    requestRef.current++;

    sequencerRef.current?.stop();

    setBusy(false);
    onPlayingChange(false);
  }

  return (
    <section
      aria-labelledby="replay-heading"
      style={{
        marginTop: 28,
        paddingTop: 20,
        borderTop: "1px solid #d8e0eb",
      }}
    >
      <h2 id="replay-heading">Sequence Replay</h2>

      <p>
        Play recorded notes at 0.5x, 1x or 2x speed.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <label htmlFor="replay-speed">
          Playback speed
        </label>

        <select
          id="replay-speed"
          value={speed}
          disabled={busy}
          onChange={(event) => {
            setSpeed(
              Number(event.target.value) as PlaybackSpeed
            );
          }}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
        </select>

        <button
          type="button"
          disabled={busy || disabled || notes.length === 0}
          onClick={() => {
            void playSequence();
          }}
        >
          Play Sequence
        </button>

        <button
          type="button"
          disabled={!busy}
          onClick={stopSequence}
        >
          Stop Sequence
        </button>
      </div>

      <p role="status" aria-live="polite">
        {busy
          ? `Playing sequence at ${speed}x`
          : "Sequence idle"}
        {" · "}
        {notes.length} recorded notes
      </p>

      {disabled && (
        <p>
          Stop Recording before starting replay.
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: "#b42318" }}>
          {error}
        </p>
      )}
    </section>
  );
}