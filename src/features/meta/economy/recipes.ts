import type {
  DrinkMenuId,
  RecipeDefinition,
} from "@/features/meta/types/gameState";

export const RECIPE_DEFINITIONS: Record<DrinkMenuId, RecipeDefinition> = {
  americano: {
    id: "americano",
    name: "아메리카노",
    levelRequired: 1,
    purchaseCost: 0,
    shopAvailability: "standard",
    shots: 1,
    beans: 0,
    materials: {},
    firstCraftKey: "recipe:americano:firstCraft",
  },
  latte: {
    id: "latte",
    name: "카페 라떼",
    levelRequired: 2,
    purchaseCost: 80,
    shopAvailability: "standard",
    shots: 1,
    beans: 1,
    materials: {
      milk: 1,
    },
    firstCraftKey: "recipe:latte:firstCraft",
  },
  affogato: {
    id: "affogato",
    name: "아포가토",
    levelRequired: 3,
    purchaseCost: 140,
    shopAvailability: "standard",
    shots: 1,
    beans: 1,
    materials: {
      cream: 1,
    },
    firstCraftKey: "recipe:affogato:firstCraft",
  },
};

export function recipeDefinition(id: DrinkMenuId): RecipeDefinition {
  return RECIPE_DEFINITIONS[id];
}

export function recipePurchaseCost(id: DrinkMenuId): number {
  return RECIPE_DEFINITIONS[id].purchaseCost;
}
