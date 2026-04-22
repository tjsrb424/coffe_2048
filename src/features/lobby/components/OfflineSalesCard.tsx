"use client";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { cn } from "@/lib/utils";
import { t } from "@/locale/i18n";
import { useAppStore } from "@/stores/useAppStore";
import { useLobbyFxStore } from "@/stores/useLobbyFxStore";

function formatOfflineDuration(elapsedMs: number): string {
  const totalMinutes = Math.max(1, Math.floor(elapsedMs / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${totalMinutes}분`;
  if (minutes <= 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function OfflineSalesCard({ className }: { className?: string }) {
  const pendingReward = useAppStore((s) => s.cafeState.pendingOfflineReward);
  const claimOfflineReward = useAppStore((s) => s.claimOfflineReward);
  const { lightTap } = useGameFeedback();
  if (!pendingReward || pendingReward.pendingCoins <= 0) return null;

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            {t("offlineSales.heading")}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-coffee-800">
            {t("offlineSales.body", {
              time: formatOfflineDuration(pendingReward.elapsedMs),
              sold: pendingReward.soldCount,
              coins: pendingReward.pendingCoins,
            })}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-coffee-600/75">
            {t("offlineSales.note")}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-cream-200/65 px-3 py-2 text-right ring-1 ring-coffee-600/8">
          <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-coffee-600/70">
            <CoinIcon size={14} className="opacity-90" />
            {t("offlineSales.ready")}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-coffee-900">
            +{pendingReward.pendingCoins}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Button
          type="button"
          variant="soft"
          className="h-11 w-full text-xs font-semibold"
          onClick={() => {
            lightTap();
            const claimed = claimOfflineReward();
            if (!claimed) return;
            useLobbyFxStore.getState().pingPurchase("offline");
            useLobbyFxStore.getState().pingCafeSell({
              gainedCoins: claimed.pendingCoins,
              soldCount: claimed.soldCount,
              kind: "offline",
            });
          }}
        >
          {t("offlineSales.claim")}
        </Button>
      </div>
    </Card>
  );
}
