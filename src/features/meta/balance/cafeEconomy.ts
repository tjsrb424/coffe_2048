import type {
  BeverageCodexState,
  DrinkMenuId,
  MenuStock,
} from "@/features/meta/types/gameState";
import { PRICING_DEFINITIONS } from "@/features/meta/economy/pricing";
import { isOwnedRecipe } from "@/features/meta/economy/recipeOwnership";
import { RECIPE_DEFINITIONS } from "@/features/meta/economy/recipes";

export const STANDARD_MENU_ORDER: DrinkMenuId[] = [
  "americano",
  "latte",
  "affogato",
];

export const TIME_MENU_ORDER: DrinkMenuId[] = [
  "morning_mist_latte",
  "dawn_honey_shot",
  "noon_citrus_coffee",
  "traveler_blend",
  "evening_caramel_crema",
  "sunset_tea_latte",
  "night_velvet_mocha",
  "midnight_tonic",
];

export const MENU_ORDER: DrinkMenuId[] = [
  ...STANDARD_MENU_ORDER,
  ...TIME_MENU_ORDER,
];

/** 메뉴 해금 기준 — Phase 4 성장 구조(최소 버전) */
export const MENU_UNLOCK_CAFE_LEVEL: Record<DrinkMenuId, number> = {
  americano: RECIPE_DEFINITIONS.americano.levelRequired,
  latte: RECIPE_DEFINITIONS.latte.levelRequired,
  affogato: RECIPE_DEFINITIONS.affogato.levelRequired,
  morning_mist_latte: RECIPE_DEFINITIONS.morning_mist_latte.levelRequired,
  dawn_honey_shot: RECIPE_DEFINITIONS.dawn_honey_shot.levelRequired,
  noon_citrus_coffee: RECIPE_DEFINITIONS.noon_citrus_coffee.levelRequired,
  traveler_blend: RECIPE_DEFINITIONS.traveler_blend.levelRequired,
  evening_caramel_crema: RECIPE_DEFINITIONS.evening_caramel_crema.levelRequired,
  sunset_tea_latte: RECIPE_DEFINITIONS.sunset_tea_latte.levelRequired,
  night_velvet_mocha: RECIPE_DEFINITIONS.night_velvet_mocha.levelRequired,
  midnight_tonic: RECIPE_DEFINITIONS.midnight_tonic.levelRequired,
};

export const CAFE_ECONOMY = {
  roastBeanCost: 2,
  shotYield: 3,
  maxShots: 24,
  autoSellIntervalMs: 4000,
  /** 한 번에 돌릴 최대 판매 틱 (오프라인·복귀 시 폭주 방지) */
  autoSellMaxTicks: 18,
  recipe: RECIPE_DEFINITIONS,
  sellPrice: {
    americano: PRICING_DEFINITIONS.americano.sellPrice,
    latte: PRICING_DEFINITIONS.latte.sellPrice,
    affogato: PRICING_DEFINITIONS.affogato.sellPrice,
    morning_mist_latte: PRICING_DEFINITIONS.morning_mist_latte.sellPrice,
    dawn_honey_shot: PRICING_DEFINITIONS.dawn_honey_shot.sellPrice,
    noon_citrus_coffee: PRICING_DEFINITIONS.noon_citrus_coffee.sellPrice,
    traveler_blend: PRICING_DEFINITIONS.traveler_blend.sellPrice,
    evening_caramel_crema: PRICING_DEFINITIONS.evening_caramel_crema.sellPrice,
    sunset_tea_latte: PRICING_DEFINITIONS.sunset_tea_latte.sellPrice,
    night_velvet_mocha: PRICING_DEFINITIONS.night_velvet_mocha.sellPrice,
    midnight_tonic: PRICING_DEFINITIONS.midnight_tonic.sellPrice,
  },
} as const;

export function defaultMenuStock(): MenuStock {
  return Object.fromEntries(MENU_ORDER.map((id) => [id, 0])) as MenuStock;
}

export function normalizeMenuStock(
  stock: Partial<Record<DrinkMenuId, number>> | null | undefined,
): MenuStock {
  const base = defaultMenuStock();
  if (!stock) return base;
  for (const id of MENU_ORDER) {
    base[id] = stock[id] ?? 0;
  }
  return base;
}

export function totalMenuStock(stock: MenuStock): number {
  return MENU_ORDER.reduce((sum, id) => sum + (stock[id] ?? 0), 0);
}

export function visibleMenuOrder(
  codex: Pick<BeverageCodexState, "purchasedTimeRecipeIds"> | null | undefined,
): DrinkMenuId[] {
  if (!codex) return [...STANDARD_MENU_ORDER];
  return [
    ...STANDARD_MENU_ORDER,
    ...TIME_MENU_ORDER.filter((id) => isOwnedRecipe({ id, codex })),
  ];
}

export function trySellOneRoundRobin(
  stock: MenuStock,
  sellBonus = 0,
): { id: DrinkMenuId; coins: number; nextStock: MenuStock } | null {
  for (const id of MENU_ORDER) {
    if (stock[id] > 0) {
      return {
        id,
        coins: CAFE_ECONOMY.sellPrice[id] + sellBonus,
        nextStock: { ...stock, [id]: stock[id] - 1 },
      };
    }
  }
  return null;
}
