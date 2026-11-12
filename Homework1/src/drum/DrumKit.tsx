
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  DRUM_PADS,
  DRUM_PAD_BY_ID,
} from './drum.config'

import type { DrumPadId } from './drum.types'

import {
  createDrumAudioEngine,
  type DrumAudioEngine,
} from './audio/drumAudio'

import { useDrumKeyboard } from './hooks/useDrumKeyboard'
import { DrumPad } from './DrumPad'

import {
  DrumFeedback,
  type DrumHit,
} from './DrumFeedback'

import styles from './DrumKit.module.css'

const MAX_HISTORY = 8
const METER_RESET_DELAY = 650
const ANNOUNCEMENT_INTERVAL = 900

const DRUM_INTENSITY: Record<DrumPadId, number> = {
  kick: 95,
  snare: 85,
  'closed-hihat': 40,
  'open-hihat': 65,
  clap: 75,
  tom: 80,
  crash: 100,
}

export function DrumKit() {
  const engineRef = useRef<DrumAudioEngine | null>(null)

  const nextHitIdRef = useRef(0)

  const meterTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null)

  const announcementTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null)

  const pendingHitCountRef = useRef(0)
  const latestHitNameRef = useRef('')

  const [history, setHistory] = useState<DrumHit[]>([])
  const [intensity, setIntensity] = useState(0)

  const [announcement, setAnnouncement] = useState(
    'Drum Kit ready to play.',
  )

  useEffect(() => {
    const engine = createDrumAudioEngine()
    engineRef.current = engine

    return () => {
      engineRef.current = null
      void engine.dispose()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (meterTimerRef.current !== null) {
        clearTimeout(meterTimerRef.current)
        meterTimerRef.current = null
      }

      if (announcementTimerRef.current !== null) {
        clearTimeout(announcementTimerRef.current)
        announcementTimerRef.current = null
      }

      pendingHitCountRef.current = 0
    }
  }, [])

  const handleHit = useCallback((id: DrumPadId) => {
    const engine = engineRef.current
    const pad = DRUM_PAD_BY_ID.get(id)

    if (!engine || !pad) return

    void engine.play(id)

    nextHitIdRef.current += 1

    const hit: DrumHit = {
      id: nextHitIdRef.current,
      padId: id,
      name: pad.name,
      key: pad.key,
    }

    setHistory((previous) => {
      return [hit, ...previous].slice(0, MAX_HISTORY)
    })

    setIntensity(DRUM_INTENSITY[id])

    if (meterTimerRef.current !== null) {
      clearTimeout(meterTimerRef.current)
    }

    meterTimerRef.current = setTimeout(() => {
      setIntensity(0)
      meterTimerRef.current = null
    }, METER_RESET_DELAY)

    pendingHitCountRef.current += 1
    latestHitNameRef.current = pad.name

    if (announcementTimerRef.current === null) {
      announcementTimerRef.current = setTimeout(() => {
        const count = pendingHitCountRef.current
        const latest = latestHitNameRef.current

        setAnnouncement(
          count === 1
            ? `Played ${latest}.`
            : `${count} drum hits. Latest: ${latest}.`,
        )

        pendingHitCountRef.current = 0
        announcementTimerRef.current = null
      }, ANNOUNCEMENT_INTERVAL)
    }
  }, [])

  const { pressedCodes } = useDrumKeyboard(handleHit)

  return (
    <main className={styles.studio}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          PRODUCTION STUDIO
        </p>

        <h1 className={styles.title}>
          Drum Kit
        </h1>

        <p className={styles.subtitle}>
          Your digital percussion playground.
          Play seven drum sounds directly in your browser.
        </p>
      </header>

      <section
        className={styles.instrument}
        aria-labelledby="drum-heading"
      >
        <div className={styles.sectionHeader}>
          <h2
            id="drum-heading"
            className={styles.sectionTitle}
          >
            Drum Pads
          </h2>

          <span className={styles.padCount}>
            07 PADS
          </span>
        </div>

        <p
  id="drum-instructions"
  className={styles.instructions}
>
  Use the physical keys W, A, S, D, J, K or L to play.
  You can also click a pad, or focus it with Tab
  and press Enter or Space.
  Each pad shows its current pressed state.
</p>

        <div className={styles.padGrid}>
          {DRUM_PADS.map((pad) => (
            <DrumPad
  key={pad.id}
  pad={pad}
  isShortcutPressed={
    pressedCodes.has(pad.code)
  }
  instructionsId="drum-instructions"
  onHit={handleHit}
/>
          ))}
        </div>
      </section>

      <DrumFeedback
        history={history}
        intensity={intensity}
        announcement={announcement}
      />

      <footer className={styles.footer}>
        <p>
          Built with React 19 + Web Audio API
        </p>
      </footer>
    </main>
  )
}
