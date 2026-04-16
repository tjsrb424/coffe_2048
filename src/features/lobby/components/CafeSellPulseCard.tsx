"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useLobbyFxStore } from "@/stores/useLobbyFxStore";

export function CafeSellPulseCard() {
  const pulse = useLobbyFxStore((s) => s.cafeSellPulse);

  if (!pulse) return null;

  return (
    <Card className="mb-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            카운터 소식
          </div>
          <p className="mt-2 text-sm leading-relaxed text-coffee-800">
            {pulse.kind === "offline" ? "자리를 비운 사이" : "방금"}{" "}
            <span className="font-semibold tabular-nums text-coffee-900">
              {pulse.soldCount}
            </span>
            잔이 나가서{" "}
            <span className="font-semibold tabular-nums text-accent-soft">
              +{pulse.gainedCoins}
            </span>
            코인이 들어왔어요.
          </p>
        </div>
        <AnimatePresence>
          <motion.div
            key={pulse.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="shrink-0 rounded-2xl bg-coffee-700/95 px-3 py-2 text-center text-xs font-semibold text-cream-50 shadow-card ring-1 ring-black/10"
          >
            +{pulse.gainedCoins}
            <div className="mt-0.5 text-[10px] font-medium text-cream-50/80">
              코인
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}

