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
  morning_mist_latte: {
    id: "morning_mist_latte",
    name: "모닝 미스트 라떼",
    levelRequired: 61,
    purchaseCost: 160,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      milk: 1,
      vanillaSyrup: 1,
    },
    firstCraftKey: "recipe:morning_mist_latte:firstCraft",
  },
  dawn_honey_shot: {
    id: "dawn_honey_shot",
    name: "새벽 허니 샷",
    levelRequired: 67,
    purchaseCost: 180,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      honey: 1,
    },
    firstCraftKey: "recipe:dawn_honey_shot:firstCraft",
  },
  noon_citrus_coffee: {
    id: "noon_citrus_coffee",
    name: "정오의 시트러스 커피",
    levelRequired: 62,
    purchaseCost: 170,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      fruitBase: 1,
      sparklingWater: 1,
    },
    firstCraftKey: "recipe:noon_citrus_coffee:firstCraft",
  },
  traveler_blend: {
    id: "traveler_blend",
    name: "떠돌이 블렌드",
    levelRequired: 70,
    purchaseCost: 210,
    shopAvailability: "timeWindow",
    shots: 2,
    beans: 2,
    materials: {
      hazelnutSyrup: 1,
    },
    firstCraftKey: "recipe:traveler_blend:firstCraft",
  },
  evening_caramel_crema: {
    id: "evening_caramel_crema",
    name: "이브닝 카라멜 크레마",
    levelRequired: 64,
    purchaseCost: 220,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      caramelSyrup: 1,
      cream: 1,
    },
    firstCraftKey: "recipe:evening_caramel_crema:firstCraft",
  },
  sunset_tea_latte: {
    id: "sunset_tea_latte",
    name: "선셋 티 라떼",
    levelRequired: 69,
    purchaseCost: 240,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      milk: 1,
      blackTeaBase: 1,
    },
    firstCraftKey: "recipe:sunset_tea_latte:firstCraft",
  },
  night_velvet_mocha: {
    id: "night_velvet_mocha",
    name: "나이트 벨벳 모카",
    levelRequired: 65,
    purchaseCost: 250,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 2,
    materials: {
      mochaSauce: 1,
      cream: 1,
    },
    firstCraftKey: "recipe:night_velvet_mocha:firstCraft",
  },
  midnight_tonic: {
    id: "midnight_tonic",
    name: "미드나잇 토닉",
    levelRequired: 68,
    purchaseCost: 260,
    shopAvailability: "timeWindow",
    shots: 1,
    beans: 1,
    materials: {
      fruitBase: 1,
      sparklingWater: 1,
    },
    firstCraftKey: "recipe:midnight_tonic:firstCraft",
  },
};

export function recipeDefinition(id: DrinkMenuId): RecipeDefinition {
  return RECIPE_DEFINITIONS[id];
}

export function recipePurchaseCost(id: DrinkMenuId): number {
  return RECIPE_DEFINITIONS[id].purchaseCost;
}
