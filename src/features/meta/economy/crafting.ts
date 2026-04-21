import type {
  AccountLevelState,
  BeverageCodexState,
  CafeState,
  DrinkMenuId,
  MaterialId,
} from "@/features/meta/types/gameState";
import { materialDefinition } from "./materials";
import { isOwnedRecipe, isUnlockedRecipe } from "./recipeOwnership";
import { recipeDefinition } from "./recipes";

export type MissingMaterial = {
  id: MaterialId;
  name: string;
  have: number;
  need: number;
};

export type CraftValidation = {
  id: DrinkMenuId;
  recipeUnlocked: boolean;
  recipePurchased: boolean;
  shotsOk: boolean;
  beansOk: boolean;
  materialsOk: boolean;
  canCraft: boolean;
  missingMaterials: MissingMaterial[];
};

export function validateCraftDrink(input: {
  id: DrinkMenuId;
  account: AccountLevelState;
  beverageCodex?: BeverageCodexState;
  cafeState: CafeState;
  beans: number;
}): CraftValidation {
  const recipe = recipeDefinition(input.id);
  const missingMaterials = Object.entries(recipe.materials)
    .map(([rawId, need]) => {
      const id = rawId as MaterialId;
      const have = input.cafeState.materialInventory[id] ?? 0;
      return {
        id,
        name: materialDefinition(id).name,
        have,
        need: need ?? 0,
      };
    })
    .filter((item) => item.have < item.need);
  const recipeUnlocked = isUnlockedRecipe({
    id: input.id,
    account: input.account,
    codex: input.beverageCodex,
  });
  const recipePurchased = isOwnedRecipe({
    id: input.id,
    account: input.account,
    codex: input.beverageCodex,
  });
  const shotsOk = input.cafeState.espressoShots >= recipe.shots;
  const beansOk = input.beans >= recipe.beans;
  const materialsOk = missingMaterials.length === 0;

  return {
    id: input.id,
    recipeUnlocked,
    recipePurchased,
    shotsOk,
    beansOk,
    materialsOk,
    canCraft:
      recipeUnlocked && recipePurchased && shotsOk && beansOk && materialsOk,
    missingMaterials,
  };
}

export function missingMaterialsLine(missing: MissingMaterial[]): string {
  return missing
    .map((item) => `${item.name} ${item.have}/${item.need}`)
    .join(", ");
}
