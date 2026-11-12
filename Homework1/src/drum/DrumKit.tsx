
import { useCallback, useEffect, useRef } from 'react'
import { DRUM_PADS } from './drum.config'
import type { DrumPadId } from './drum.types'
import {
  createDrumAudioEngine,
  type DrumAudioEngine,
} from './audio/drumAudio'
import { DrumPad } from './DrumPad'
import styles from './DrumKit.module.css'

export function DrumKit() {
  const engineRef = useRef<DrumAudioEngine | null>(null)

  useEffect(() => {
    const engine = createDrumAudioEngine()
    engineRef.current = engine

    return () => {
      engineRef.current = null
      void engine.dispose()
    }
  }, [])

  const handleHit = useCallback((id: DrumPadId) => {
    const engine = engineRef.current

    if (!engine) return

    void engine.play(id)
  }, [])

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
          <h2 id="drum-heading" className={styles.sectionTitle}>
            Drum Pads
          </h2>

          <span className={styles.padCount}>
            07 PADS
          </span>
        </div>

        <p className={styles.instructions}>
          Click a pad or use Tab to focus it,
          then press Enter or Space to play.
        </p>

        <div className={styles.padGrid}>
          {DRUM_PADS.map((pad) => (
            <DrumPad
              key={pad.id}
              pad={pad}
              onHit={handleHit}
            />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          Built with React 19 + Web Audio API
        </p>
      </footer>
    </main>
  )
}
