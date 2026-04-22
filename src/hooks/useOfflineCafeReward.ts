"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

/**
 * 앱 복귀 시 오프라인 보상을 정산하고,
 * 숨김/종료 시 마지막 접속 시각을 저장한다.
 */
export function useOfflineCafeReward() {
  const settleOfflineReward = useAppStore((s) => s.settleOfflineReward);
  const markLastSeenAt = useAppStore((s) => s.markLastSeenAt);

  useEffect(() => {
    const settleNow = () => settleOfflineReward(Date.now());
    if (useAppStore.persist.hasHydrated()) {
      settleNow();
    }
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      settleNow();
    });
    return unsubscribe;
  }, [settleOfflineReward]);

  useEffect(() => {
    const markNow = () => markLastSeenAt(Date.now());
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markNow();
        return;
      }
      settleOfflineReward(Date.now());
    };

    window.addEventListener("pagehide", markNow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", markNow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [markLastSeenAt, settleOfflineReward]);
}
