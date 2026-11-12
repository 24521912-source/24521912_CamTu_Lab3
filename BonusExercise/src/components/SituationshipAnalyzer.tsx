
import { useId, useState, type FormEvent } from 'react';

import {
  INITIAL_RELATIONSHIP_PHASE,
  canTransition,
  getAvailableEvents,
  transitionRelationship,
  type RelationshipEvent,
  type RelationshipPhase,
} from '../domain/relationshipMachine';

import {
  DEFAULT_MULTIPLIERS,
  appendEffortSignal,
  createDefaultSignalInput,
  createEffortSignal,
  removeEffortSignal,
  summarizeEffort,
  type EffortActor,
  type EffortLog,
} from '../domain/effortModel';

import styles from './SituationshipAnalyzer.module.css';

const PHASE_LABELS: Record<RelationshipPhase, string> = {
  FRIENDS: 'Bạn bè',
  DATING_NO_LOVE: 'Hẹn hò nhưng chưa yêu',
  OFFICIAL_LOVE: 'Yêu chính thức',
  GHOSTED_EXIT: 'Đã kết thúc',
};

const EVENT_LABELS: Record<RelationshipEvent, string> = {
  START_DATING: 'Bắt đầu hẹn hò',
  RETURN_TO_FRIENDS: 'Quay về bạn bè',
  CONFIRM_RELATIONSHIP: 'Xác nhận tình yêu',
  GHOST_TIMEOUT: 'Hết hạn phản hồi',
  EXIT: 'Chủ động kết thúc',
  RESET: 'Bắt đầu lại',
};

const ACTOR_LABELS: Record<EffortActor, string> = {
  EM: 'Em',
  AI_DO: 'Ai Đó',
};

function formatScore(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function SituationshipAnalyzer() {
  const [phase, setPhase] = useState<RelationshipPhase>(
    INITIAL_RELATIONSHIP_PHASE,
  );

  const [effortLog, setEffortLog] = useState<EffortLog>([]);

  const [actor, setActor] = useState<EffortActor>('EM');
  const [stepsInput, setStepsInput] = useState('1');
  const [formError, setFormError] = useState('');
  const [announcement, setAnnouncement] = useState(
    'Ứng dụng đã sẵn sàng.',
  );

  const actorId = useId();
  const stepsId = useId();
  const errorId = useId();

  // Derived values: no redundant score state or useEffect.
  const summary = summarizeEffort(effortLog);
  const availableEvents = getAvailableEvents(phase);

  function handleTransition(event: RelationshipEvent) {
    if (!canTransition(phase, event)) {
      return;
    }

    const nextPhase = transitionRelationship(phase, event);

    setPhase(nextPhase);
    setAnnouncement(
      `Trạng thái đã chuyển sang ${PHASE_LABELS[nextPhase]}.`,
    );
  }

  function handleAddSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = stepsInput.trim();
    const steps = Number(trimmed);

    if (
      trimmed === '' ||
      !Number.isSafeInteger(steps) ||
      steps <= 0
    ) {
      setFormError('Số bước phải là số nguyên dương hợp lệ.');
      setAnnouncement('Không thể thêm hành động: dữ liệu không hợp lệ.');
      return;
    }

    try {
      const input = createDefaultSignalInput(actor, steps);
      const signal = createEffortSignal(input);

      setEffortLog((previous) =>
        appendEffortSignal(previous, signal),
      );

      setFormError('');
      setAnnouncement(
        `Đã ghi nhận ${steps} bước của ${ACTOR_LABELS[actor]}.`,
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Không thể ghi nhận hành động.',
      );
      setAnnouncement('Không thể ghi nhận hành động.');
    }
  }

  function handleRemoveSignal(id: string) {
    setEffortLog((previous) =>
      removeEffortSignal(previous, id),
    );

    setAnnouncement('Đã xóa một hành động khỏi lịch sử.');
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            LAB 03 BONUS EXERCISE
          </p>

          <h1>Hẹn Hò Nhưng Không Yêu</h1>

          <p className={styles.subtitle}>
            SituationshipAnalyzer — Finite State Machine
            &amp; Asymmetric Effort
          </p>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="phase-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="phase-heading">Trạng thái quan hệ</h2>
            <span className={styles.phaseCode}>{phase}</span>
          </div>

          <p className={styles.phaseName}>
            {PHASE_LABELS[phase]}
          </p>

          <p className={styles.helper}>
            Chỉ những sự kiện hợp lệ mới được hiển thị.
            Mỗi thời điểm chỉ có một trạng thái.
          </p>

          <div
            className={styles.actions}
            aria-label="Chuyển trạng thái"
          >
            {availableEvents
              .filter((event) => event !== 'GHOST_TIMEOUT')
              .map((event) => (
                <button
                  key={event}
                  type="button"
                  className={styles.button}
                  onClick={() => handleTransition(event)}
                >
                  {EVENT_LABELS[event]}
                </button>
              ))}
          </div>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="effort-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="effort-heading">Asymmetric Effort</h2>
          </div>

          <p className={styles.helper}>
            Hệ số minh họa: Em × 0.1, Ai Đó × 50.
            Điểm không phản ánh giá trị thực của một mối quan hệ.
          </p>

          <div className={styles.scoreGrid}>
            <article className={styles.scoreCard}>
              <h3>Em</h3>
              <strong>{formatScore(summary.EM.totalImpact)}</strong>
              <p>
                {summary.EM.totalSteps} bước ·{' '}
                {summary.EM.signalCount} hành động
              </p>
            </article>

            <article className={styles.scoreCard}>
              <h3>Ai Đó</h3>
              <strong>
                {formatScore(summary.AI_DO.totalImpact)}
              </strong>
              <p>
                {summary.AI_DO.totalSteps} bước ·{' '}
                {summary.AI_DO.signalCount} hành động
              </p>
            </article>
          </div>

          <div
            className={
              summary.redFlag
                ? styles.warning
                : styles.normalStatus
            }
          >
            <strong>
              {summary.redFlag
                ? '⚠ Red flag — Chênh lệch nỗ lực'
                : 'Chưa có red flag theo ngưỡng demo'}
            </strong>
            <p>
              Cảnh báo khi Em có ít nhất 5 bước và
              số bước gấp ít nhất 5 lần Ai Đó.
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleAddSignal}
            noValidate
          >
            <div className={styles.field}>
              <label htmlFor={actorId}>
                Người thực hiện
              </label>

              <select
                id={actorId}
                value={actor}
                onChange={(event) => {
                  setActor(event.target.value as EffortActor);
                  setFormError('');
                }}
              >
                <option value="EM">Em</option>
                <option value="AI_DO">Ai Đó</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={stepsId}>
                Số bước nỗ lực
              </label>

              <input
                id={stepsId}
                type="number"
                min="1"
                step="1"
                required
                value={stepsInput}
                aria-invalid={formError !== ''}
                aria-describedby={
                  formError ? errorId : undefined
                }
                onChange={(event) => {
                  setStepsInput(event.target.value);
                  setFormError('');
                }}
              />
            </div>

            {formError && (
              <p
                id={errorId}
                className={styles.error}
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              className={styles.primaryButton}
            >
              Ghi nhận hành động
            </button>
          </form>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="history-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="history-heading">
              Lịch sử hành động
            </h2>

            <span className={styles.count}>
              {effortLog.length} mục
            </span>
          </div>

          {effortLog.length === 0 ? (
            <p className={styles.helper}>
              Chưa có hành động nào được ghi nhận.
            </p>
          ) : (
            <ol className={styles.history}>
              {effortLog.map((signal) => (
                <li
                  key={signal.id}
                  className={styles.historyItem}
                >
                  <div>
                    <strong>
                      {ACTOR_LABELS[signal.actor]}
                    </strong>

                    <p>
                      {signal.steps} bước ×{' '}
                      {signal.multiplier} ={' '}
                      {formatScore(
                        signal.steps * signal.multiplier,
                      )}{' '}
                      điểm
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    aria-label={
                      `Xóa hành động ${signal.id} của ` +
                      ACTOR_LABELS[signal.actor]
                    }
                    onClick={() =>
                      handleRemoveSignal(signal.id)
                    }
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>

        <output
          className={styles.liveStatus}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </output>

        <footer className={styles.footer}>
          <p>
            UIT Web Application Development 2026 —
            Lab 03 Bonus Exercise
          </p>
          <p>
            Local demo only. No backend or real messages.
          </p>
          <p>
            Demo multipliers: {DEFAULT_MULTIPLIERS.EM}
            {' / '}
            {DEFAULT_MULTIPLIERS.AI_DO}
          </p>
        </footer>
      </div>
    </main>
  );
}
