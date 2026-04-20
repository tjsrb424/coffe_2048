import type { CafeLoopSectionKey } from "@/features/lobby/components/CafeLoopSection";

/** 로비 씬 위 오버레이 핫존 — 비율은 씬 박스 기준 % */
export type LobbyHotspotId =
  | "roast"
  | "showcase"
  | "counter"
  | "puzzle";

export type LobbySheetId = "roast" | "showcase" | "counter" | "puzzle" | "shop";

export type LobbyHotspotConfig = {
  id: LobbyHotspotId;
  label: string;
  /** 씬 컨테이너 기준 퍼센트 */
  rect: { left: number; top: number; width: number; height: number };
  sheet: LobbySheetId;
  /** 시트에 넘길 카페 루프 섹션(해당 시트에서만) */
  cafeSections?: CafeLoopSectionKey[];
};

export const LOBBY_HOTSPOTS: LobbyHotspotConfig[] = [
  {
    id: "roast",
    label: "로스터",
    rect: { left: 6, top: 52, width: 28, height: 22 },
    sheet: "roast",
    cafeSections: ["roast"],
  },
  {
    id: "showcase",
    label: "쇼케이스",
    rect: { left: 58, top: 48, width: 34, height: 28 },
    sheet: "showcase",
    cafeSections: ["craft", "display"],
  },
  {
    id: "counter",
    label: "카운터",
    rect: { left: 34, top: 62, width: 30, height: 24 },
    sheet: "counter",
  },
  {
    id: "puzzle",
    label: "퍼즐",
    rect: { left: 38, top: 28, width: 26, height: 20 },
    sheet: "puzzle",
  },
];
