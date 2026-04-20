import type {
  DrinkMenuId,
  MaterialId,
  PricingDefinition,
  RecipeDefinition,
} from "@/features/meta/types/gameState";
import { materialUnitCost } from "./materials";
import { RECIPE_DEFINITIONS } from "./recipes";

const BASE_SELL_PRICE: Record<DrinkMenuId, number> = {
  americano: 10,
  latte: 18,
  affogato: 28,
};

function recipeMaterialCost(recipe: RecipeDefinition): number {
  return Object.entries(recipe.materials).reduce((sum, [id, amount]) => {
    return sum + materialUnitCost(id as MaterialId) * (amount ?? 0);
  }, 0);
}

function profitRatingFor(sellPrice: number, materialCost: number): PricingDefinition["profitRating"] {
  const margin = sellPrice - materialCost;
  if (margin >= 18) return "premium";
  if (margin >= 10) return "good";
  return "steady";
}

export const PRICING_DEFINITIONS: Record<DrinkMenuId, PricingDefinition> = {
  americano: createPricing("americano"),
  latte: createPricing("latte"),
  affogato: createPricing("affogato"),
};

function createPricing(id: DrinkMenuId): PricingDefinition {
  const materialCost = recipeMaterialCost(RECIPE_DEFINITIONS[id]);
  const sellPrice = BASE_SELL_PRICE[id];
  return {
    id,
    materialCost,
    basePrice: sellPrice,
    sellPrice,
    profitRating: profitRatingFor(sellPrice, materialCost),
  };
}

export function sellPriceForDrink(id: DrinkMenuId, sellBonus = 0): number {
  return PRICING_DEFINITIONS[id].sellPrice + sellBonus;
}
