
import { useState } from 'react'
import type {
  KeyboardEvent,
  PointerEvent,
} from 'react'
import type { DrumPadConfig } from './drum.types'
import styles from './DrumKit.module.css'

interface DrumPadProps {
  pad: DrumPadConfig
  isShortcutPressed: boolean
  onHit: (id: DrumPadConfig['id']) => void
}

export function DrumPad({
  pad,
  isShortcutPressed,
  onHit,
}: DrumPadProps) {
  const [isLocalPressed, setIsLocalPressed] = useState(false)

  const isPressed = isLocalPressed || isShortcutPressed

  function handlePointerDown(
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (event.button !== 0) return

    setIsLocalPressed(true)
  }

  function handlePointerUp() {
    setIsLocalPressed(false)
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.code !== 'Enter' && event.code !== 'Space') {
      return
    }

    if (event.repeat) {
      event.preventDefault()
      return
    }

    setIsLocalPressed(true)
  }

  function handleKeyUp(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.code === 'Enter' || event.code === 'Space') {
      setIsLocalPressed(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.pad}
      data-pressed={isPressed}
      aria-label={`${pad.name}, shortcut ${pad.key}`}
      aria-pressed={isPressed}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => setIsLocalPressed(false)}
      onClick={() => onHit(pad.id)}
    >
      <span className={styles.padKey} aria-hidden="true">
        {pad.key}
      </span>

      <span className={styles.padName} aria-hidden="true">
        {pad.name}
      </span>

      <span
        className={styles.padDescription}
        aria-hidden="true"
      >
        {pad.description}
      </span>
    </button>
  )
}
