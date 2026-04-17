"use client";

import { Card } from "@/components/ui/Card";
import { t } from "@/locale/i18n";
import { useAppStore } from "@/stores/useAppStore";

export function OfflineSalesCard() {
  const cafe = useAppStore((s) => s.cafeState);
  if (cafe.lastOfflineSaleAtMs === 0 || cafe.lastOfflineSaleCoins <= 0) return null;

  return (
    <Card className="mb-4 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
        {t("offlineSales.heading")}
      </div>
      <p className="mt-2 text-sm text-coffee-800">
        {t("offlineSales.body", {
          sold: cafe.lastOfflineSaleSoldCount,
          coins: cafe.lastOfflineSaleCoins,
        })}
      </p>
    </Card>
  );
}
