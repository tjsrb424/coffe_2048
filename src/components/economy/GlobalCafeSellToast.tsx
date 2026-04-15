"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCafeAutoSell } from "@/features/lobby/hooks/useCafeAutoSell";
import { useLobbyFxStore } from "@/stores/useLobbyFxStore";

/**
 * 카페 자동 판매 틱 + 코인 토스트. 모든 주요 라우트에서 마운트되도록 template에 둔다.
 */
export function GlobalCafeSellToast() {
  const [coinToast, setCoinToast] = useState<{
    amount: number;
    kind: "online" | "offline";
  } | null>(null);

  const onCoinsEarned = useCallback((amount: number) => {
    useLobbyFxStore.getState().pingPurchase("online");
    setCoinToast({ amount, kind: "online" });
  }, []);

  const onOfflineSettled = useCallback(
    (input: { gainedCoins: number; soldCount: number }) => {
      if (input.gainedCoins <= 0) return;
      useLobbyFxStore.getState().pingPurchase("offline");
      setCoinToast({ amount: input.gainedCoins, kind: "offline" });
    },
    [],
  );

  useCafeAutoSell({ onCoinsEarned, onOfflineSettled });

  useEffect(() => {
    if (coinToast == null) return;
    const t = window.setTimeout(() => setCoinToast(null), 1400);
    return () => window.clearTimeout(t);
  }, [coinToast]);

  return (
    <AnimatePresence>
      {coinToast != null ? (
        <motion.div
          key={`${coinToast.kind}-${coinToast.amount}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="pointer-events-none fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[60] -translate-x-1/2"
        >
          <span className="rounded-full bg-coffee-700/95 px-3 py-1.5 text-xs font-semibold text-cream-50 shadow-card ring-1 ring-black/10">
            {coinToast.kind === "offline" ? "오프라인 판매 " : ""}+
            {coinToast.amount} 코인
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
