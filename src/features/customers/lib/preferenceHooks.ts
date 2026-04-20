import { beverageForRecipeId } from "@/features/meta/content/beverages";
import { currentTimeOfDay } from "@/features/meta/content/timeShop";
import { recipeDefinition } from "@/features/meta/economy/recipes";
import type {
  BeverageId,
  BeverageCategoryId,
  BeverageRarity,
  DrinkMenuId,
  MaterialId,
  TimeOfDayId,
} from "@/features/meta/types/gameState";
import type { CustomerProfile } from "@/features/customers/types";

export type CustomerPreferenceHookResult = {
  beverageCategories: BeverageCategoryId[];
  materialIds: MaterialId[];
  timeOfDayId: TimeOfDayId;
  rarities: BeverageRarity[];
  matchedTags: string[];
};

export function resolvePreferenceHookForSale(input: {
  profile: CustomerProfile;
  soldByMenu: Partial<Record<DrinkMenuId, number>>;
  firstSoldBeverageIds?: BeverageId[];
  nowMs?: number;
}): CustomerPreferenceHookResult | null {
  const hooks = input.profile.reactionHooks;
  if (!hooks) return null;

  const beverageCategories = new Set<BeverageCategoryId>();
  const materialIds = new Set<MaterialId>();
  const rarities = new Set<BeverageRarity>();
  for (const [rawId, count] of Object.entries(input.soldByMenu)) {
    if (!count || count <= 0) continue;
    const id = rawId as DrinkMenuId;
    const beverage = beverageForRecipeId(id);
    const recipe = recipeDefinition(id);
    beverageCategories.add(beverage.categoryId);
    rarities.add(beverage.rarity);
    for (const materialId of Object.keys(recipe.materials) as MaterialId[]) {
      materialIds.add(materialId);
    }
  }

  const timeOfDayId = currentTimeOfDay(
    input.nowMs ? new Date(input.nowMs) : new Date(),
  );
  const matchedTags: string[] = [];

  for (const category of hooks.beverageCategories ?? []) {
    if (beverageCategories.has(category)) matchedTags.push(`category:${category}`);
  }
  for (const materialId of hooks.materialIds ?? []) {
    if (materialIds.has(materialId)) matchedTags.push(`material:${materialId}`);
  }
  for (const rarity of hooks.rarities ?? []) {
    if (rarities.has(rarity)) matchedTags.push(`rarity:${rarity}`);
  }
  if ((hooks.timeOfDayIds ?? []).includes(timeOfDayId)) {
    matchedTags.push(`time:${timeOfDayId}`);
  }
  for (const beverageId of hooks.firstSaleBeverageIds ?? []) {
    if ((input.firstSoldBeverageIds ?? []).includes(beverageId)) {
      matchedTags.push(`first-sale:${beverageId}`);
    }
  }

  if (matchedTags.length === 0) return null;
  return {
    beverageCategories: Array.from(beverageCategories),
    materialIds: Array.from(materialIds),
    timeOfDayId,
    rarities: Array.from(rarities),
    matchedTags,
  };
}
