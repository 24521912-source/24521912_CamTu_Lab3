import type { CSSProperties, PointerEvent } from "react";
import type { PianoNote } from "../piano/types";
import styles from "./PianoKey.module.css";

interface PianoKeyProps {
  note: PianoNote;
  isPressed: boolean;
  left?: number;
  onStart: (midi: number, pointerId: number) => void;
  onEnd: (midi: number, pointerId: number) => void;
  onTap: (midi: number) => void;
}

export default function PianoKey({
  note,
  isPressed,
  left,
  onStart,
  onEnd,
  onTap,
}: PianoKeyProps) {
  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    onStart(note.midi, event.pointerId);
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    onEnd(note.midi, event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const position: CSSProperties | undefined =
    left === undefined ? undefined : { left };

  return (
    <button
      type="button"
      className={[
        styles.key,
        note.isBlack ? styles.black : styles.white,
        isPressed ? styles.pressed : "",
      ].join(" ")}
      style={position}
      aria-label={`${note.name}, MIDI ${note.midi}`}
      aria-pressed={isPressed}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onClick={(event) => {
        // Native keyboard and assistive-technology activation.
        // Pointer clicks are already handled by pointer events.
        if (event.detail === 0) {
          onTap(note.midi);
        }
      }}
    >
      <span aria-hidden="true" className={styles.noteLabel}>
        {note.name}
      </span>
    </button>
  );
}