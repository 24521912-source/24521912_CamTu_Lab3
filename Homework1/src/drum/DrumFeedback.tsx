
import type { DrumPadId } from './drum.types'
import styles from './DrumKit.module.css'

export interface DrumHit {
  readonly id: number
  readonly padId: DrumPadId
  readonly name: string
  readonly key: string
}

interface DrumFeedbackProps {
  history: readonly DrumHit[]
  intensity: number
  announcement: string
}

export function DrumFeedback({
  history,
  intensity,
  announcement,
}: DrumFeedbackProps) {
  return (
    <section
      className={styles.feedbackSection}
      aria-label="Drum activity feedback"
    >
      <section
        className={styles.feedbackPanel}
        aria-labelledby="history-heading"
      >
        <div className={styles.feedbackHeading}>
          <h2
            id="history-heading"
            className={styles.sectionTitle}
          >
            Hit History
          </h2>

          <span className={styles.historyCount}>
            {history.length} / 8
          </span>
        </div>

        <p className={styles.feedbackHint}>
          Your eight most recent drum hits.
        </p>

        {history.length === 0 ? (
          <p className={styles.emptyHistory}>
            No hits yet. Play a drum pad to begin.
          </p>
        ) : (
          <ol className={styles.historyList}>
            {history.map((hit) => (
              <li
                key={hit.id}
                className={styles.historyItem}
              >
                <span className={styles.historyName}>
                  {hit.name}
                </span>

                <kbd className={styles.historyKey}>
                  {hit.key}
                </kbd>
              </li>
            ))}
          </ol>
        )}

        <output
          className={styles.screenReaderOnly}
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </output>
      </section>

      <section
        className={styles.feedbackPanel}
        aria-labelledby="meter-heading"
      >
        <h2
          id="meter-heading"
          className={styles.sectionTitle}
        >
          Visual Intensity
        </h2>

        <p className={styles.feedbackHint}>
          Visual feedback for your drum activity.
        </p>

        <div className={styles.meterDisplay}>
          <span className={styles.meterValue}>
            {intensity}%
          </span>

          <span className={styles.meterStatus}>
            {intensity === 0 ? 'Idle' : 'Active'}
          </span>
        </div>

        <div
          className={styles.meterTrack}
          role="meter"
          aria-labelledby="meter-heading"
          aria-describedby="meter-help"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={intensity}
          aria-valuetext={`${intensity} percent estimated activity`}
        >
          <div
            className={styles.meterFill}
            style={{ width: `${intensity}%` }}
            aria-hidden="true"
          />
        </div>

        <div className={styles.meterScale}>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        <p
          id="meter-help"
          className={styles.meterDisclaimer}
        >
          Estimated visual activity only.
          Not a calibrated dB SPL measurement.
        </p>
      </section>
    </section>
  )
}
