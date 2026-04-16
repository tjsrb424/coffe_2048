"use client";

import { create } from "zustand";
import type { LobbyHotspotId } from "@/features/lobby/config/lobbyHotspots";
import type { PuzzleRewards } from "@/features/meta/rewards/computePuzzleRewards";

/** persist 하지 않음 — 자동 판매 등에서 로비 연출만 동기화 */
type LobbyFx = {
  purchasePulse: number;
  purchaseKind: "online" | "offline";
  pingPurchase: (kind: "online" | "offline") => void;
  /** 퍼즐 복귀 직후 핫존 링 강조 */
  puzzleHotspotHints: Partial<Record<LobbyHotspotId, boolean>>;
  setPuzzleHotspotHints: (hints: Partial<Record<LobbyHotspotId, boolean>>) => void;
  clearPuzzleHotspotHint: (id: LobbyHotspotId) => void;
  /** 퍼즐 보상이 로비 HUD로 “흘러들어오는” 1회성 펄스 */
  puzzleRewardPulse: (PuzzleRewards & { key: number }) | null;
  pingPuzzleRewards: (rewards: PuzzleRewards) => void;
  clearPuzzleRewards: () => void;
  /** 자동 판매로 들어온 코인(최근 1회) — 로비 카운터/요약에 사용 */
  cafeSellPulse:
    | { key: number; gainedCoins: number; soldCount: number; kind: "online" | "offline" }
    | null;
  pingCafeSell: (input: { gainedCoins: number; soldCount: number; kind: "online" | "offline" }) => void;
  clearCafeSell: () => void;
};

export const useLobbyFxStore = create<LobbyFx>((set, get) => ({
  purchasePulse: 0,
  purchaseKind: "online",
  puzzleHotspotHints: {},
  puzzleRewardPulse: null,
  pingPurchase: (kind) =>
    set({
      purchasePulse: get().purchasePulse + 1,
      purchaseKind: kind,
    }),
  setPuzzleHotspotHints: (hints) => set({ puzzleHotspotHints: hints }),
  clearPuzzleHotspotHint: (id) =>
    set((s) => {
      const next = { ...s.puzzleHotspotHints };
      delete next[id];
      return { puzzleHotspotHints: next };
    }),
  pingPuzzleRewards: (rewards) =>
    set({
      puzzleRewardPulse: {
        ...rewards,
        key: Date.now(),
      },
    }),
  clearPuzzleRewards: () => set({ puzzleRewardPulse: null }),
  cafeSellPulse: null,
  pingCafeSell: (input) =>
    set({
      cafeSellPulse: {
        ...input,
        key: Date.now(),
      },
    }),
  clearCafeSell: () => set({ cafeSellPulse: null }),
}));
