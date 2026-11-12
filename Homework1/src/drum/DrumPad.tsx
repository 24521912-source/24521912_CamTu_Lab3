
import { useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { DrumPadConfig } from './drum.types'
import styles from './DrumKit.module.css'

interface DrumPadProps {
  pad: DrumPadConfig
  onHit: (id: DrumPadConfig['id']) => void
}

export function DrumPad({ pad, onHit }: DrumPadProps) {
  const [isPressed, setIsPressed] = useState(false)

  function handlePointerDown(
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (event.button !== 0) return
    setIsPressed(true)
  }

  function handlePointerUp() {
    setIsPressed(false)
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

    setIsPressed(true)
  }

  function handleKeyUp(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.code === 'Enter' || event.code === 'Space') {
      setIsPressed(false)
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
      onBlur={() => setIsPressed(false)}
      onClick={() => onHit(pad.id)}
    >
      <span className={styles.padKey} aria-hidden="true">
        {pad.key}
      </span>

      <span className={styles.padName} aria-hidden="true">
        {pad.name}
      </span>

      <span className={styles.padDescription} aria-hidden="true">
        {pad.description}
      </span>
    </button>
  )
}
