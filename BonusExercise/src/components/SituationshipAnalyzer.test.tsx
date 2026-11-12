
// @vitest-environment jsdom

import { StrictMode } from 'react';
import { act } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { SituationshipAnalyzer } from './SituationshipAnalyzer';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

function renderAnalyzer(strict = false) {
  return render(
    strict ? (
      <StrictMode>
        <SituationshipAnalyzer />
      </StrictMode>
    ) : (
      <SituationshipAnalyzer />
    ),
  );
}

function startDating() {
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Bắt đầu hẹn hò',
    }),
  );
}

function sendMessage() {
  fireEvent.click(
    screen.getByRole('button', {
      name: /Gửi tin nhắn|Gửi lại/,
    }),
  );
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('Seen Không Rep timer integration', () => {
  it('does not start a timer on mount', () => {
    renderAnalyzer();

    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByText('FRIENDS')).toBeTruthy();
  });

  it('starts five seconds only after sending', () => {
    renderAnalyzer();
    startDating();

    expect(vi.getTimerCount()).toBe(0);

    sendMessage();

    expect(screen.getByText('WAITING')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(1);

    advance(4999);

    expect(
      screen.getByText('DATING_NO_LOVE'),
    ).toBeTruthy();

    advance(1);

    expect(
      screen.getByText('GHOSTED_EXIT'),
    ).toBeTruthy();

    expect(screen.getByText('TIMED_OUT')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels timeout after reply', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ai Đó phản hồi',
      }),
    );

    expect(screen.getByText('REPLIED')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);

    advance(10_000);

    expect(
      screen.getByText('DATING_NO_LOVE'),
    ).toBeTruthy();
  });

  it('cancels timeout after manual stop', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Dừng chờ',
      }),
    );

    expect(screen.getByText('CANCELLED')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);

    advance(10_000);

    expect(
      screen.getByText('DATING_NO_LOVE'),
    ).toBeTruthy();
  });

  it('cancels timeout when relationship phase changes', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Xác nhận tình yêu',
      }),
    );

    expect(screen.getByText('OFFICIAL_LOVE')).toBeTruthy();
    expect(screen.getByText('CANCELLED')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);

    advance(10_000);

    expect(screen.getByText('OFFICIAL_LOVE')).toBeTruthy();
  });

  it('cancels timeout on manual exit', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Chủ động kết thúc',
      }),
    );

    expect(screen.getByText('GHOSTED_EXIT')).toBeTruthy();
    expect(screen.getByText('CANCELLED')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels timeout when switching to AI_DO', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    fireEvent.change(
      screen.getByLabelText('Người thực hiện'),
      { target: { value: 'AI_DO' } },
    );

    expect(screen.getByText('CANCELLED')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);

    advance(10_000);

    expect(
      screen.getByText('DATING_NO_LOVE'),
    ).toBeTruthy();
  });

  it('replaces old deadline on rapid resend', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    advance(3000);
    sendMessage();

    expect(vi.getTimerCount()).toBe(1);

    advance(2000);

    expect(screen.getByText('WAITING')).toBeTruthy();

    advance(3000);

    expect(
      screen.getByText('GHOSTED_EXIT'),
    ).toBeTruthy();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not restart timer when effort changes', () => {
    renderAnalyzer();
    startDating();
    sendMessage();

    advance(3000);

    fireEvent.change(
      screen.getByLabelText('Số bước nỗ lực'),
      { target: { value: '10' } },
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ghi nhận hành động',
      }),
    );

    expect(vi.getTimerCount()).toBe(1);

    advance(2000);

    expect(
      screen.getByText('GHOSTED_EXIT'),
    ).toBeTruthy();
  });

  it('cleans up timer on unmount', () => {
    const view = renderAnalyzer();
    startDating();
    sendMessage();

    expect(vi.getTimerCount()).toBe(1);

    view.unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not duplicate timers in StrictMode', () => {
    const view = renderAnalyzer(true);
    startDating();
    sendMessage();

    expect(vi.getTimerCount()).toBe(1);

    advance(5000);

    expect(
      screen.getByText('GHOSTED_EXIT'),
    ).toBeTruthy();

    expect(vi.getTimerCount()).toBe(0);

    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
