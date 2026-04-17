"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { t } from "@/locale/i18n";
import { useLobbyFxStore } from "@/stores/useLobbyFxStore";

export function CafeSellPulseCard() {
  const pulse = useLobbyFxStore((s) => s.cafeSellPulse);

  if (!pulse) return null;

  const line =
    pulse.kind === "offline"
      ? t("sellPulse.lineOffline", {
          sold: pulse.soldCount,
          coins: pulse.gainedCoins,
        })
      : t("sellPulse.lineOnline", {
          sold: pulse.soldCount,
          coins: pulse.gainedCoins,
        });

  return (
    <Card className="mb-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            {t("sellPulse.heading")}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-coffee-800">{line}</p>
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
              {t("sellPulse.coinLabel")}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
