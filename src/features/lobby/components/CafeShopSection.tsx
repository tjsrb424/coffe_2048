"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BeanIcon } from "@/components/ui/BeanIcon";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { EspressoShotIcon } from "@/components/ui/EspressoShotIcon";
import { DRINK_MENU_TEXT_IDS } from "@/data/drinkMenuTextIds";
import { MENU_ORDER } from "@/features/meta/balance/cafeEconomy";
import { MATERIAL_ORDER, materialDefinition } from "@/features/meta/economy/materials";
import { PRICING_DEFINITIONS } from "@/features/meta/economy/pricing";
import { recipeDefinition } from "@/features/meta/economy/recipes";
import {
  canPurchaseRecipe,
  recipePurchaseCost,
} from "@/features/meta/progression/levelBands";
import { normalizeAccountLevelState } from "@/features/meta/progression/missionEngine";
import type {
  DrinkMenuId,
  MaterialId,
  MaterialTier,
} from "@/features/meta/types/gameState";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { t } from "@/locale/i18n";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";

type ShopTab = "materials" | "recipes";

export function CafeShopSection() {
  const [tab, setTab] = useState<ShopTab>("materials");
  const coins = useAppStore((s) => s.playerResources.coins);
  const materialInventory = useAppStore((s) => s.cafeState.materialInventory);
  const rawAccount = useAppStore((s) => s.accountLevel);
  const purchaseMaterial = useAppStore((s) => s.purchaseMaterial);
  const purchaseRecipe = useAppStore((s) => s.purchaseRecipe);
  const { lightTap } = useGameFeedback();
  const account = normalizeAccountLevelState(rawAccount);

  return (
    <div className="space-y-4">
      <Card className="p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
              상점
            </div>
            <p className="mt-1 text-sm font-semibold text-coffee-900">
              코인을 재료와 레시피로 바꿔요.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-cream-200/70 px-3 py-1.5 text-sm font-bold tabular-nums text-coffee-900 ring-1 ring-coffee-600/8">
            <CoinIcon size={18} className="opacity-95" />
            {coins}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-cream-200/55 p-1 ring-1 ring-coffee-600/6">
          <ShopTabButton active={tab === "materials"} onClick={() => setTab("materials")}>
            재료상점
          </ShopTabButton>
          <ShopTabButton active={tab === "recipes"} onClick={() => setTab("recipes")}>
            레시피상점
          </ShopTabButton>
        </div>
      </Card>

      {tab === "materials" ? (
        <ul className="grid grid-cols-1 gap-3">
          {MATERIAL_ORDER.map((id) => {
            const material = materialDefinition(id);
            const owned = materialInventory[id] ?? 0;
            const canBuy = coins >= material.coinCost;
            return (
              <li key={id}>
                <Card className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-coffee-900">
                          {material.name}
                        </h3>
                        <span className={materialTierClassName(material.tier)}>
                          {materialTierLabel(material.tier)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-coffee-700/78">
                        {material.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold tabular-nums text-coffee-800">
                        <span className="rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
                          보유 {owned}
                        </span>
                        <span className="rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
                          +{material.purchaseAmount}개
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={canBuy ? "soft" : "ghost"}
                      className="h-11 min-h-0 shrink-0 px-3 text-xs font-semibold"
                      disabled={!canBuy}
                      onClick={() => {
                        lightTap();
                        purchaseMaterial(id);
                      }}
                    >
                      <span className="inline-flex items-center gap-1">
                        <CoinIcon size={14} className="opacity-95" />
                        {material.coinCost}
                      </span>
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {MENU_ORDER.map((id) => (
            <RecipeShopCard
              key={id}
              id={id}
              unlocked={account.unlockedRecipeIds.includes(id)}
              purchased={account.purchasedRecipeIds.includes(id)}
              canBuy={canPurchaseRecipe(account, id, coins)}
              onBuy={() => {
                lightTap();
                purchaseRecipe(id);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ShopTabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-[1.05rem] px-3 text-sm font-bold transition-colors",
        active
          ? "bg-cream-50 text-coffee-950 shadow-sm ring-1 ring-coffee-600/8"
          : "text-coffee-700/78 hover:bg-cream-50/50",
      )}
    >
      {children}
    </button>
  );
}

function RecipeShopCard({
  id,
  unlocked,
  purchased,
  canBuy,
  onBuy,
}: {
  id: DrinkMenuId;
  unlocked: boolean;
  purchased: boolean;
  canBuy: boolean;
  onBuy: () => void;
}) {
  const recipe = recipeDefinition(id);
  const pricing = PRICING_DEFINITIONS[id];
  const cost = recipePurchaseCost(id);
  const statusLabel = purchased
    ? "구매 완료"
    : unlocked
      ? "구매 가능"
      : `Lv.${recipe.levelRequired}에 열림`;
  const materials = Object.entries(recipe.materials) as Array<[MaterialId, number]>;

  return (
    <li>
      <Card
        className={cn(
          "p-3.5",
          !unlocked && "bg-cream-200/55 text-coffee-700/75",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-coffee-900">
                {t(DRINK_MENU_TEXT_IDS[id].nameTextId)}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                  purchased
                    ? "bg-accent-mint/24 text-coffee-900 ring-accent-mint/35"
                    : unlocked
                      ? "bg-accent-soft/16 text-coffee-900 ring-accent-soft/24"
                      : "bg-coffee-900/5 text-coffee-700/70 ring-coffee-600/10",
                )}
              >
                {statusLabel}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-coffee-700/78">
              {t(DRINK_MENU_TEXT_IDS[id].descriptionTextId)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold tabular-nums text-coffee-800">
              <span className="inline-flex items-center gap-1 rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
                <EspressoShotIcon size={14} className="opacity-90" />
                {recipe.shots}
              </span>
              {recipe.beans > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
                  <BeanIcon size={14} className="opacity-90" />
                  {recipe.beans}
                </span>
              ) : null}
              {materials.map(([materialId, amount]) => (
                <span
                  key={materialId}
                  className="rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7"
                >
                  {materialDefinition(materialId).name} {amount}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full bg-cream-50/80 px-2 py-0.5 ring-1 ring-accent-soft/18">
                판매
                <CoinIcon size={13} className="opacity-90" />
                {pricing.sellPrice}
              </span>
              {pricing.materialCost > 0 ? (
                <span className="rounded-full bg-cream-50/80 px-2 py-0.5 ring-1 ring-accent-soft/18">
                  원가 {pricing.materialCost}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant={canBuy ? "soft" : "ghost"}
            className="h-11 min-h-0 shrink-0 px-3 text-xs font-semibold"
            disabled={!canBuy || purchased}
            onClick={onBuy}
          >
            {purchased ? (
              "완료"
            ) : cost <= 0 ? (
              "기본"
            ) : (
              <span className="inline-flex items-center gap-1">
                <CoinIcon size={14} className="opacity-95" />
                {cost}
              </span>
            )}
          </Button>
        </div>
      </Card>
    </li>
  );
}

function materialTierLabel(tier: MaterialTier): string {
  switch (tier) {
    case "basic":
      return "기본";
    case "flavor":
      return "향";
    case "premium":
      return "고급";
    case "rare":
      return "희귀";
    default:
      return "재료";
  }
}

function materialTierClassName(tier: MaterialTier): string {
  return cn(
    "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
    tier === "rare"
      ? "bg-coffee-900/8 text-coffee-900 ring-coffee-600/14"
      : tier === "premium"
        ? "bg-accent-soft/18 text-coffee-900 ring-accent-soft/28"
        : tier === "flavor"
          ? "bg-[#f4e2c7] text-coffee-900 ring-accent-soft/20"
          : "bg-cream-200/70 text-coffee-700 ring-coffee-600/8",
  );
}
