"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LobbyReturnButton } from "@/components/navigation/LobbyReturnButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { beverageDefinition } from "@/features/meta/content/beverages";
import {
  TIME_SHOP_WINDOWS,
  currentTimeOfDay,
  timeShopEntriesFor,
} from "@/features/meta/content/timeShop";
import { normalizeAccountLevelState } from "@/features/meta/progression/missionEngine";
import type { TimeOfDayId } from "@/features/meta/types/gameState";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";

export function TimeShopScreen() {
  useResetDocumentScrollOnMount();
  const [slot, setSlot] = useState<TimeOfDayId>("day");
  const coins = useAppStore((s) => s.playerResources.coins);
  const account = normalizeAccountLevelState(useAppStore((s) => s.accountLevel));
  const codex = useAppStore((s) => s.beverageCodex);
  const purchaseTimeShopRecipe = useAppStore((s) => s.purchaseTimeShopRecipe);
  const { lightTap } = useGameFeedback();
  const entries = useMemo(() => timeShopEntriesFor(slot), [slot]);

  useEffect(() => {
    const updateSlot = () => setSlot(currentTimeOfDay(new Date()));
    updateSlot();
    const timer = window.setInterval(updateSlot, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          Traveling Merchant
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
          떠돌이 판매상
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-coffee-700">
          시간대마다 다른 한정 레시피를 조용히 꺼내 놓아요.
        </p>
      </header>

      <Card className="mb-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
              지금 시간대
            </div>
            <h2 className="mt-1 text-xl font-black tracking-tight text-coffee-950">
              {TIME_SHOP_WINDOWS[slot].label}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
              {TIME_SHOP_WINDOWS[slot].description}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-cream-200/70 px-3 py-1.5 text-sm font-bold tabular-nums text-coffee-900 ring-1 ring-coffee-600/8">
            <CoinIcon size={18} className="opacity-95" />
            {coins}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {(["morning", "day", "evening", "night"] as TimeOfDayId[]).map(
            (id) => (
              <div
                key={id}
                className={cn(
                  "rounded-2xl px-2 py-2 text-center text-[11px] font-bold ring-1",
                  slot === id
                    ? "bg-coffee-900 text-cream-50 ring-coffee-900"
                    : "bg-cream-200/55 text-coffee-700/75 ring-coffee-600/7",
                )}
              >
                {TIME_SHOP_WINDOWS[id].label}
              </div>
            ),
          )}
        </div>
      </Card>

      <ul className="space-y-3">
        {entries.map((entry) => {
          const beverage = beverageDefinition(entry.beverageId);
          if (!beverage) return null;
          const purchased = codex.purchasedTimeRecipeIds.includes(beverage.id);
          const levelOk = account.level >= entry.requiredLevel;
          const coinOk = coins >= entry.price;
          const canBuy = !purchased && levelOk && coinOk;
          const blockLine = purchased
            ? "이미 도감에 담긴 한정 레시피예요."
            : !levelOk
              ? `Lv.${entry.requiredLevel}부터 구매할 수 있어요.`
              : !coinOk
                ? "코인이 조금 부족해요."
                : "지금 시간대에 구매할 수 있어요.";

          return (
            <li key={entry.id}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-black text-coffee-950">
                        {beverage.name}
                      </h2>
                      <span className="rounded-full bg-accent-soft/16 px-2 py-0.5 text-[10px] font-bold text-coffee-900 ring-1 ring-accent-soft/24">
                        한정
                      </span>
                      <span className="rounded-full bg-cream-200/70 px-2 py-0.5 text-[10px] font-bold text-coffee-700 ring-1 ring-coffee-600/8">
                        Lv.{entry.requiredLevel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-coffee-700/78">
                      {beverage.description}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-coffee-700/78">
                      {blockLine}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={canBuy ? "soft" : "ghost"}
                    className="h-11 min-h-0 shrink-0 px-3 text-xs font-semibold"
                    disabled={!canBuy}
                    onClick={() => {
                      lightTap();
                      purchaseTimeShopRecipe(beverage.id);
                    }}
                  >
                    {purchased ? (
                      "보유"
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <CoinIcon size={14} className="opacity-95" />
                        {entry.price}
                      </span>
                    )}
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card className="mt-4 bg-cream-200/55 p-4">
        <p className="text-xs leading-relaxed text-coffee-700/80">
          구매한 시간대 레시피는 도감의 구매 완료 상태로 남고, 시간대 레시피
          구매 미션에도 바로 연결됩니다. 실제 제작 레시피는 다음 단계에서
          재료식과 함께 붙이면 됩니다.
        </p>
      </Card>

      <LobbyReturnButton />
    </AppShell>
  );
}
