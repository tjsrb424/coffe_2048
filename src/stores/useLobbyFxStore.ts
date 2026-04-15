"use client";

import { create } from "zustand";

/** persist 하지 않음 — 자동 판매 등에서 로비 연출만 동기화 */
type LobbyFx = {
  purchasePulse: number;
  purchaseKind: "online" | "offline";
  pingPurchase: (kind: "online" | "offline") => void;
};

export const useLobbyFxStore = create<LobbyFx>((set, get) => ({
  purchasePulse: 0,
  purchaseKind: "online",
  pingPurchase: (kind) =>
    set({
      purchasePulse: get().purchasePulse + 1,
      purchaseKind: kind,
    }),
}));
