import {
  BEVERAGE_ID_BY_RECIPE_ID,
  beverageDefinition,
} from "@/features/meta/content/beverages";
import type {
  AccountLevelState,
  BeverageCodexState,
  BeverageId,
  DrinkMenuId,
} from "@/features/meta/types/gameState";
import { recipeDefinition } from "./recipes";

type AccountRecipeSnapshot = Pick<
  AccountLevelState,
  "unlockedRecipeIds" | "purchasedRecipeIds"
>;

type CodexRecipeSnapshot = Pick<BeverageCodexState, "purchasedTimeRecipeIds">;

export function isTimeWindowRecipeId(id: DrinkMenuId): boolean {
  return recipeDefinition(id).shopAvailability === "timeWindow";
}

export function isOwnedRecipe(input: {
  id: DrinkMenuId;
  account?: AccountRecipeSnapshot | null;
  codex?: CodexRecipeSnapshot | null;
}): boolean {
  if (isTimeWindowRecipeId(input.id)) {
    const beverageId = BEVERAGE_ID_BY_RECIPE_ID[input.id];
    return input.codex?.purchasedTimeRecipeIds.includes(beverageId) ?? false;
  }
  return input.account?.purchasedRecipeIds.includes(input.id) ?? false;
}

export function isUnlockedRecipe(input: {
  id: DrinkMenuId;
  account?: AccountRecipeSnapshot | null;
  codex?: CodexRecipeSnapshot | null;
}): boolean {
  if (isTimeWindowRecipeId(input.id)) {
    return isOwnedRecipe(input);
  }
  return input.account?.unlockedRecipeIds.includes(input.id) ?? false;
}

export function isOwnedBeverageRecipe(input: {
  beverageId: BeverageId;
  account?: AccountRecipeSnapshot | null;
  codex?: CodexRecipeSnapshot | null;
}): boolean {
  const beverage = beverageDefinition(input.beverageId);
  if (!beverage?.recipeId) return false;
  return isOwnedRecipe({
    id: beverage.recipeId,
    account: input.account,
    codex: input.codex,
  });
}
