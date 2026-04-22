import {
  totalMenuStock,
  trySellOneRoundRobin,
} from "@/features/meta/balance/cafeEconomy";
import type {
  DrinkMenuId,
  MenuStock,
} from "@/features/meta/types/gameState";

export const OFFLINE_REWARD_MAX_MS = 90 * 60 * 1000;
export const OFFLINE_REWARD_COIN_RATIO = 0.5;

export type OfflineCafeRewardResult = {
  soldCount: number;
  grossCoins: number;
  pendingCoins: number;
  soldByMenu: Partial<Record<DrinkMenuId, number>>;
  nextMenuStock: MenuStock;
  cappedElapsedMs: number;
};

export function simulateOfflineCafeReward(input: {
  menuStock: MenuStock;
  elapsedMs: number;
  intervalMs: number;
  sellBonus?: number;
}): OfflineCafeRewardResult | null {
  const cappedElapsedMs = Math.max(
    0,
    Math.min(input.elapsedMs, OFFLINE_REWARD_MAX_MS),
  );
  if (cappedElapsedMs < input.intervalMs) return null;
  if (totalMenuStock(input.menuStock) <= 0) return null;

  const totalTicks = Math.floor(cappedElapsedMs / input.intervalMs);
  if (totalTicks <= 0) return null;

  let nextMenuStock = { ...input.menuStock };
  let soldCount = 0;
  let grossCoins = 0;
  const soldByMenu: Partial<Record<DrinkMenuId, number>> = {};

  for (let i = 0; i < totalTicks; i += 1) {
    const sold = trySellOneRoundRobin(nextMenuStock, input.sellBonus ?? 0);
    if (!sold) break;
    nextMenuStock = sold.nextStock;
    soldCount += 1;
    grossCoins += sold.coins;
    soldByMenu[sold.id] = (soldByMenu[sold.id] ?? 0) + 1;
  }

  if (soldCount <= 0 || grossCoins <= 0) return null;

  const pendingCoins = Math.max(
    0,
    Math.floor(grossCoins * OFFLINE_REWARD_COIN_RATIO),
  );
  if (pendingCoins <= 0) return null;

  return {
    soldCount,
    grossCoins,
    pendingCoins,
    soldByMenu,
    nextMenuStock,
    cappedElapsedMs,
  };
}
