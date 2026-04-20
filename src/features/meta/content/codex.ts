import type {
  AccountLevelState,
  BeverageCodexState,
  BeverageDefinition,
  BeverageId,
  CodexEntry,
  CodexEntryStage,
  DrinkMenuId,
} from "@/features/meta/types/gameState";
import {
  BEVERAGE_DEFINITIONS,
  BEVERAGE_ID_BY_RECIPE_ID,
} from "./beverages";

export function createDefaultCodexEntry(beverageId: BeverageId): CodexEntry {
  return {
    beverageId,
    totalSold: 0,
    unlockedAtMs: null,
    purchasedAtMs: null,
    firstCraftedAtMs: null,
    firstSoldAtMs: null,
    guestReactionSlot: `guest-reaction:${beverageId}`,
  };
}

export function createDefaultBeverageCodexState(): BeverageCodexState {
  return {
    entries: Object.fromEntries(
      BEVERAGE_DEFINITIONS.map((beverage) => [
        beverage.id,
        createDefaultCodexEntry(beverage.id),
      ]),
    ),
    purchasedTimeRecipeIds: [],
  };
}

export function normalizeBeverageCodexState(
  input: BeverageCodexState | undefined | null,
): BeverageCodexState {
  const defaults = createDefaultBeverageCodexState();
  const entries: BeverageCodexState["entries"] = { ...defaults.entries };
  for (const beverage of BEVERAGE_DEFINITIONS) {
    entries[beverage.id] = {
      ...createDefaultCodexEntry(beverage.id),
      ...(input?.entries?.[beverage.id] ?? {}),
      beverageId: beverage.id,
    };
  }
  return {
    entries,
    purchasedTimeRecipeIds: Array.from(
      new Set(input?.purchasedTimeRecipeIds ?? []),
    ).filter((id) => Boolean(entries[id])),
  };
}

export function markCodexPurchased(
  state: BeverageCodexState,
  beverageId: BeverageId,
  nowMs = Date.now(),
): BeverageCodexState {
  const entry = state.entries[beverageId] ?? createDefaultCodexEntry(beverageId);
  return {
    ...state,
    entries: {
      ...state.entries,
      [beverageId]: {
        ...entry,
        unlockedAtMs: entry.unlockedAtMs ?? nowMs,
        purchasedAtMs: entry.purchasedAtMs ?? nowMs,
      },
    },
  };
}

export function markCodexCrafted(
  state: BeverageCodexState,
  beverageId: BeverageId,
  nowMs = Date.now(),
): BeverageCodexState {
  const purchased = markCodexPurchased(state, beverageId, nowMs);
  const entry = purchased.entries[beverageId]!;
  return {
    ...purchased,
    entries: {
      ...purchased.entries,
      [beverageId]: {
        ...entry,
        firstCraftedAtMs: entry.firstCraftedAtMs ?? nowMs,
      },
    },
  };
}

export function markCodexSold(
  state: BeverageCodexState,
  beverageId: BeverageId,
  amount: number,
  nowMs = Date.now(),
): BeverageCodexState {
  if (amount <= 0) return state;
  const crafted = markCodexCrafted(state, beverageId, nowMs);
  const entry = crafted.entries[beverageId]!;
  return {
    ...crafted,
    entries: {
      ...crafted.entries,
      [beverageId]: {
        ...entry,
        totalSold: entry.totalSold + amount,
        firstSoldAtMs: entry.firstSoldAtMs ?? nowMs,
      },
    },
  };
}

export function beverageIdForRecipeId(id: DrinkMenuId): BeverageId {
  return BEVERAGE_ID_BY_RECIPE_ID[id];
}

export function codexStageFor(input: {
  beverage: BeverageDefinition;
  account: AccountLevelState;
  codex: BeverageCodexState;
}): CodexEntryStage {
  const { beverage, account, codex } = input;
  const entry = codex.entries[beverage.id];
  if (entry?.firstSoldAtMs) return "sold";
  if (entry?.firstCraftedAtMs) return "crafted";
  if (
    entry?.purchasedAtMs ||
    codex.purchasedTimeRecipeIds.includes(beverage.id) ||
    (beverage.recipeId && account.purchasedRecipeIds.includes(beverage.recipeId))
  ) {
    return "purchased";
  }
  if (
    account.level >= beverage.unlockLevel ||
    entry?.unlockedAtMs ||
    (beverage.recipeId && account.unlockedRecipeIds.includes(beverage.recipeId))
  ) {
    return "unlocked";
  }
  return "locked";
}
