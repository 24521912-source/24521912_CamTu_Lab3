
import { useEffect, useRef, useState } from 'react'
import { getDrumPadByCode } from '../drum.config'
import type {
  DrumKeyCode,
  DrumPadId,
} from '../drum.types'

interface DrumKeyboardState {
  pressedCodes: ReadonlySet<DrumKeyCode>
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false
  }

  if (
    target.closest(
      'input, textarea, select, [role="textbox"]',
    )
  ) {
    return true
  }

  if (
    target instanceof HTMLElement &&
    target.isContentEditable
  ) {
    return true
  }

  const editableAncestor = target.closest(
    '[contenteditable]',
  )

  return editableAncestor instanceof HTMLElement &&
    editableAncestor.isContentEditable
}

function isComposing(event: KeyboardEvent): boolean {
  return event.isComposing || event.key === 'Process'
}

export function useDrumKeyboard(
  onHit: (id: DrumPadId) => void,
): DrumKeyboardState {
  const [pressedCodes, setPressedCodes] = useState<
    ReadonlySet<DrumKeyCode>
  >(() => new Set())

  const heldCodesRef = useRef(new Set<DrumKeyCode>())
  const onHitRef = useRef(onHit)

  useEffect(() => {
    onHitRef.current = onHit
  }, [onHit])

  useEffect(() => {
    const heldCodes = heldCodesRef.current

    function clearPressedKeys() {
      if (heldCodes.size === 0) return

      heldCodes.clear()
      setPressedCodes(new Set())
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        isComposing(event) ||
        isEditableTarget(event.target)
      ) {
        return
      }

      const pad = getDrumPadByCode(event.code)

      if (!pad) return

      const code = pad.code

      if (heldCodes.has(code)) return

      heldCodes.add(code)
      setPressedCodes(new Set(heldCodes))

      onHitRef.current(pad.id)
    }

    function handleKeyUp(event: KeyboardEvent) {
      const pad = getDrumPadByCode(event.code)

      if (!pad) return

      if (!heldCodes.delete(pad.code)) return

      setPressedCodes(new Set(heldCodes))
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearPressedKeys()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', clearPressedKeys)

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', clearPressedKeys)

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )

      heldCodes.clear()
    }
  }, [])

  return { pressedCodes }
}
