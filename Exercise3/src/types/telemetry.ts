
/** Ba đội PUBG được hỗ trợ trong Exercise 3. */
export type SquadId = "ces" | "te" | "ge";

/** Dữ liệu telemetry của một đội trong trận đấu. */
export interface SquadTelemetry {
  id: SquadId;
  name: string;
  map: string;
  phase: string;
  alive: number;
  kills: number;
  wwcdProb: number;
  status: string;
}

/** Bốn trạng thái hợp lệ của giao diện. */
export type TelemetryStatus =
  | "IDLE"
  | "LOADING"
  | "SUCCESS"
  | "ERROR";

/**
 * Discriminated union:
 * Mỗi trạng thái chỉ chứa dữ liệu phù hợp với trạng thái đó.
 */
export type TelemetryState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "SUCCESS"; data: SquadTelemetry }
  | { status: "ERROR"; error: string };

/** Kiểm tra exhaustiveness khi xử lý state bằng switch. */
export function assertNever(value: never): never {
  throw new Error(`Unexpected telemetry state: ${String(value)}`);
}
