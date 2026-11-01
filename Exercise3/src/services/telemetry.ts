
import type { SquadId, SquadTelemetry } from "../types/telemetry";
import { SQUAD_DATA } from "../data/squads";

const REQUEST_DELAY_MS = 1500;
const PACKET_LOSS_RATE = 0.35;

/**
 * Giả lập lấy telemetry từ vệ tinh.
 * Có 35% khả năng mất gói và hỗ trợ hủy bằng AbortSignal.
 */
export function fetchSquadTelemetry(
  squadId: SquadId,
  options: { signal: AbortSignal },
): Promise<SquadTelemetry> {
  const { signal } = options;

  return new Promise<SquadTelemetry>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const cleanup = () => {
      clearTimeout(timeoutId);
      signal.removeEventListener("abort", handleAbort);
    };

    const handleAbort = () => {
      cleanup();
      reject(new DOMException("Request aborted", "AbortError"));
    };

    const timeoutId = setTimeout(() => {
      cleanup();

      if (signal.aborted) {
        reject(new DOMException("Request aborted", "AbortError"));
        return;
      }

      if (Math.random() < PACKET_LOSS_RATE) {
        reject(
          new Error(
            "Satellite connection lost. Telemetry packet timed out.",
          ),
        );
        return;
      }

      resolve({ ...SQUAD_DATA[squadId] });
    }, REQUEST_DELAY_MS);

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}
