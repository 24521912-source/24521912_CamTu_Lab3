
import type { SquadId, SquadTelemetry } from "../types/telemetry.ts";

/** Dữ liệu mẫu của ba đội PUBG Vietnam Series. */
export const SQUAD_DATA: Record<SquadId, SquadTelemetry> = {
  ces: {
    id: "ces",
    name: "Cerberus Esports",
    map: "Erangel",
    phase: "Phase 6",
    alive: 4,
    kills: 14,
    wwcdProb: 68,
    status: "In Safe Zone",
  },

  te: {
    id: "te",
    name: "The Expendables",
    map: "Miramar",
    phase: "Phase 7",
    alive: 4,
    kills: 18,
    wwcdProb: 82,
    status: "Holding High Ground",
  },

  ge: {
    id: "ge",
    name: "Genius Esports",
    map: "Taego",
    phase: "Phase 5",
    alive: 3,
    kills: 9,
    wwcdProb: 41,
    status: "Rotating Blue Zone",
  },
};

/** Đội được chọn mặc định theo yêu cầu bài Lab. */
export const DEFAULT_SQUAD_ID: SquadId = "te";

/** Danh sách đội dùng để xây dựng bộ chọn đội ở các task tiếp theo. */
export const SQUAD_IDS: readonly SquadId[] = ["ces", "te", "ge"];
