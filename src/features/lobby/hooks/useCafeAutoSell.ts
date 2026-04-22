"use client";

import { useEffect, useRef } from "react";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import { useAppStore } from "@/stores/useAppStore";

type SaleTickDetail = {
  gainedCoins: number;
  soldCount: number;
  soldByMenu: Partial<Record<DrinkMenuId, number>>;
};

export function useCafeAutoSell(options: {
  onCoinsEarned?: (input: SaleTickDetail) => void;
}) {
  const stepAutoSell = useAppStore((s) => s.stepAutoSell);
  const settleOfflineReward = useAppStore((s) => s.settleOfflineReward);
  const onCoinsEarned = options.onCoinsEarned;
  const cbRef = useRef(onCoinsEarned);
  cbRef.current = onCoinsEarned;
  const firstRef = useRef(true);

  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      const now = Date.now();
      if (firstRef.current) {
        settleOfflineReward(now);
        firstRef.current = false;
        if (useAppStore.getState().cafeState.pendingOfflineReward) return;
      }
      const { gainedCoins, soldCount, soldByMenu } = stepAutoSell(now);
      if (gainedCoins <= 0) return;

      cbRef.current?.({ gainedCoins, soldCount, soldByMenu });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [settleOfflineReward, stepAutoSell]);
}
