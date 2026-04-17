"use client";

import { Card } from "@/components/ui/Card";
import { t } from "@/locale/i18n";
import { useAppStore } from "@/stores/useAppStore";

export function LastRunCard() {
  const p = useAppStore((s) => s.puzzleProgress);
  const hasRun = p.totalRuns > 0;

  if (!hasRun) {
    return (
      <Card className="mb-4">
        <h3 className="text-sm font-bold text-coffee-900">{t("lastRun.title")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-coffee-700">
          {t("lastRun.empty")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <h3 className="text-sm font-bold text-coffee-900">{t("lastRun.title")}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs font-semibold text-coffee-600/70">
            {t("lastRun.score")}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-coffee-900">
            {p.lastRunScore}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-coffee-600/70">
            {t("lastRun.bestTile")}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-coffee-900">
            {p.lastRunTile}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-coffee-600/70">
            {t("lastRun.coins")}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-accent-soft">
            +{p.lastRunCoins}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-coffee-600/70">
            {t("lastRun.beans")}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-accent-mint">
            +{p.lastRunBeans}
          </div>
        </div>
      </div>
      {p.lastRunHearts > 0 && (
        <p className="mt-3 text-xs font-semibold text-coffee-700">
          {t("lastRun.heartsBonus", { hearts: p.lastRunHearts })}
        </p>
      )}
    </Card>
  );
}
