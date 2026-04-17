"use client";

import { useEffect, useRef } from "react";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import { useAppStore } from "@/stores/useAppStore";

type SaleTickDetail = {
  gainedCoins: number;
  soldCount: number;
  soldByMenu: Partial<Record<DrinkMenuId, number>>;
};

export function useCafeAutoSell(options: {
  onCoinsEarned?: (input: SaleTickDetail) => void;
  onOfflineSettled?: (input: SaleTickDetail) => void;
}) {
  const stepAutoSell = useAppStore((s) => s.stepAutoSell);
  const recordOfflineSaleSummary = useAppStore((s) => s.recordOfflineSaleSummary);
  const autoSellIntervalMs = useAppStore(
    (s) => getCafeRuntimeModifiers(s.cafeState).autoSellIntervalMs,
  );
  const onCoinsEarned = options.onCoinsEarned;
  const onOfflineSettled = options.onOfflineSettled;
  const cbRef = useRef(onCoinsEarned);
  cbRef.current = onCoinsEarned;
  const offlineRef = useRef(onOfflineSettled);
  offlineRef.current = onOfflineSettled;
  const firstRef = useRef(true);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const lastBefore = useAppStore.getState().cafeState.lastAutoSellAtMs;
      const { gainedCoins, soldCount, ticks, soldByMenu } = stepAutoSell(now);
      if (gainedCoins <= 0) return;

      const gapMs = lastBefore > 0 ? now - lastBefore : 0;
      const shouldTreatAsOffline =
        firstRef.current &&
        lastBefore > 0 &&
        (ticks >= 2 ||
          gapMs >= Math.max(8000, Math.floor(autoSellIntervalMs * 2.25)));

      const detail = { gainedCoins, soldCount, soldByMenu };
      if (shouldTreatAsOffline) {
        recordOfflineSaleSummary({ atMs: now, gainedCoins, soldCount });
        offlineRef.current?.(detail);
      } else {
        cbRef.current?.(detail);
      }
    };
    tick();
    firstRef.current = false;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [autoSellIntervalMs, recordOfflineSaleSummary, stepAutoSell]);
}
