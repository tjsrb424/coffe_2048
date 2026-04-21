"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LobbyReturnButton } from "@/components/navigation/LobbyReturnButton";
import { Card } from "@/components/ui/Card";
import { drinkMenuName } from "@/data/drinkMenuTextIds";
import {
  CAFE_ECONOMY,
  visibleMenuOrder,
} from "@/features/meta/balance/cafeEconomy";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { t } from "@/locale/i18n";
import { useAppStore } from "@/stores/useAppStore";

/** /menu — 진열 재고·단가 요약(쇼케이스 탭 역할) */
export function ShowcaseMenuScreen() {
  useResetDocumentScrollOnMount();
  const cafe = useAppStore((s) => s.cafeState);
  const beverageCodex = useAppStore((s) => s.beverageCodex);
  const menuStock = useAppStore((s) => s.cafeState.menuStock);
  const m = getCafeRuntimeModifiers(cafe);
  const visibleMenuIds = useMemo(
    () => visibleMenuOrder(beverageCodex),
    [beverageCodex],
  );

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            {t("menu.page.kicker")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
            {t("menu.page.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            {t("menu.page.intro")}
            <Link href="/cafe" className="font-semibold underline-offset-2 hover:underline">
              {t("menu.page.introLink")}
            </Link>
            {t("menu.page.introSuffix")}
          </p>
        </header>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            {t("menu.page.stockHeading")}
          </div>
          <ul className="mt-4 space-y-3">
            {visibleMenuIds.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between rounded-2xl bg-cream-200/60 px-3 py-3 ring-1 ring-coffee-600/5"
              >
                <span className="text-sm font-semibold text-coffee-900">
                  {drinkMenuName(id, t)}
                </span>
                <span className="tabular-nums text-sm text-coffee-700">
                  {t("menu.stock.line", {
                    count: menuStock[id],
                    price: CAFE_ECONOMY.sellPrice[id] + m.sellBonus,
                  })}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <LobbyReturnButton />
      </AppShell>
    </>
  );
}
