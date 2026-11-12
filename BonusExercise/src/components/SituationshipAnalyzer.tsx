
import {
  useEffect,
  useId,
  useReducer,
  useState,
  type FormEvent,
} from 'react';

import {
  canTransition,
  getAvailableEvents,
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

import {
  INITIAL_ANALYZER_SESSION,
  analyzerSessionReducer,
} from '../domain/analyzerSession';

import {
  MESSAGE_TIMEOUT_MS,
  type MessageStatus,
} from '../domain/messageLifecycle';

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

const MESSAGE_LABELS: Record<MessageStatus, string> = {
  IDLE: 'Chưa gửi tin nhắn.',
  WAITING: 'Đang chờ phản hồi trong 5 giây.',
  REPLIED: 'Ai Đó đã phản hồi trong thời hạn.',
  CANCELLED: 'Đã hủy lượt chờ phản hồi.',
  TIMED_OUT: 'Seen không rep: đã quá 5 giây.',
};

function formatScore(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function SituationshipAnalyzer() {
  const [session, dispatch] = useReducer(
    analyzerSessionReducer,
    INITIAL_ANALYZER_SESSION,
  );

  const { phase, message } = session;

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

  const summary = summarizeEffort(effortLog);
  const availableEvents = getAvailableEvents(phase);

  const isWaiting = message.status === 'WAITING';

  // One timeout per message request.
  // StrictMode cleanup clears the previous timer.
  useEffect(() => {
    if (
      message.status !== 'WAITING' ||
      message.deadline === null
    ) {
      return;
    }

    const requestId = message.requestId;
    const remaining = Math.max(
      0,
      message.deadline - Date.now(),
    );

    const timeoutId = window.setTimeout(() => {
      dispatch({
        type: 'TIMEOUT',
        requestId,
        now: Date.now(),
      });
    }, remaining);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message.status, message.requestId, message.deadline]);

  function handleTransition(event: RelationshipEvent) {
    if (
      event === 'GHOST_TIMEOUT' ||
      !canTransition(phase, event)
    ) {
      return;
    }

    dispatch({ type: 'PHASE_EVENT', event });
    setAnnouncement(
      `Đã chọn chuyển trạng thái: ${EVENT_LABELS[event]}.`,
    );
  }

  function handleSendMessage() {
  if (phase !== 'DATING_NO_LOVE' || actor !== 'EM') {
    return;
  }

    dispatch({ type: 'SEND', now: Date.now() });
    setAnnouncement(
      'Đã gửi tin nhắn demo. Bắt đầu chờ 5 giây.',
    );
  }

  function handleReply() {
    if (!isWaiting) {
      return;
    }

    dispatch({ type: 'REPLY' });
    setAnnouncement('Đã mô phỏng phản hồi từ Ai Đó.');
  }

  function handleCancel() {
    if (!isWaiting) {
      return;
    }

    dispatch({ type: 'CANCEL' });
    setAnnouncement('Bạn đã dừng chờ phản hồi.');
  }

  function handleActorChange(nextActor: EffortActor) {
    setActor(nextActor);
    setFormError('');

    if (nextActor === 'AI_DO') {
      dispatch({ type: 'SWITCH_TO_AI_DO' });

      if (isWaiting) {
        setAnnouncement(
          'Đã chuyển sang Ai Đó và hủy lượt chờ.',
        );
      }
    }
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
      setAnnouncement('Không thể thêm hành động.');
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

  const statusAnnouncement =
    message.status === 'TIMED_OUT'
      ? 'Seen không rep. Đã chuyển sang trạng thái kết thúc.'
      : message.status === 'WAITING'
        ? 'Đang chờ phản hồi từ Ai Đó trong 5 giây.'
        : message.status === 'REPLIED'
          ? 'Ai Đó đã phản hồi. Timer đã được hủy.'
          : announcement;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            LAB 03 BONUS EXERCISE
          </p>
          <h1>Hẹn Hò Nhưng Không Yêu</h1>
          <p className={styles.subtitle}>
            SituationshipAnalyzer — FSM, Effort &amp;
            Seen Không Rep
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
            Mỗi thời điểm chỉ có một trạng thái quan hệ.
            Chỉ các transition hợp lệ được hiển thị.
          </p>

          <div className={styles.actions}>
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
          aria-labelledby="message-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="message-heading">Seen Không Rep</h2>
            <span className={styles.count}>
              {message.status}
            </span>
          </div>

          <p className={styles.helper}>
            Gửi tin nhắn để bắt đầu hạn chờ 5 giây.
            Không có phản hồi tự động hoặc dịch vụ chat thật.
          </p>

          <p className={styles.messageInfo}>
            {MESSAGE_LABELS[message.status]}
          </p>

          {phase === 'DATING_NO_LOVE' ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={actor !== 'EM'}
                onClick={handleSendMessage}
              >
                {isWaiting
                  ? 'Gửi lại (đặt lại 5 giây)'
                  : 'Gửi tin nhắn'}
              </button>

              {isWaiting && (
                <>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={handleReply}
                  >
                    Ai Đó phản hồi
                  </button>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleCancel}
                  >
                    Dừng chờ
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className={styles.helper}>
              Chỉ có thể gửi tin nhắn demo khi đang
              ở trạng thái hẹn hò chưa yêu.
            </p>
          )}

          <p className={styles.helper}>
            Request #{message.requestId} · Deadline:{' '}
            {MESSAGE_TIMEOUT_MS / 1000} giây mỗi lần gửi.
          </p>
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
            Đây không phải thước đo quan hệ thực tế.
          </p>

          <div className={styles.scoreGrid}>
            <article className={styles.scoreCard}>
              <h3>Em</h3>
              <strong>
                {formatScore(summary.EM.totalImpact)}
              </strong>
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
                onChange={(event) =>
                  handleActorChange(
                    event.target.value as EffortActor,
                  )
                }
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
              <p id={errorId} className={styles.error}>
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
          {statusAnnouncement}
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
