import type {
  MaterialDefinition,
  MaterialId,
  MaterialInventory,
} from "@/features/meta/types/gameState";

export const MATERIAL_ORDER: MaterialId[] = [
  "milk",
  "cream",
  "vanillaSyrup",
  "caramelSyrup",
  "hazelnutSyrup",
  "mochaSauce",
  "honey",
  "matchaPowder",
  "blackTeaBase",
  "fruitBase",
  "sparklingWater",
  "rareIngredient",
];

export const MATERIAL_DEFINITIONS: Record<MaterialId, MaterialDefinition> = {
  milk: {
    id: "milk",
    name: "우유",
    description: "라떼류의 기본 재료",
    coinCost: 15,
    purchaseAmount: 3,
    tier: "basic",
  },
  cream: {
    id: "cream",
    name: "크림",
    description: "디저트 메뉴에 부드러움을 더해요",
    coinCost: 20,
    purchaseAmount: 2,
    tier: "basic",
  },
  vanillaSyrup: {
    id: "vanillaSyrup",
    name: "바닐라 시럽",
    description: "은은한 단맛의 기본 시럽",
    coinCost: 28,
    purchaseAmount: 2,
    tier: "flavor",
  },
  caramelSyrup: {
    id: "caramelSyrup",
    name: "카라멜 시럽",
    description: "고소한 단맛을 올려요",
    coinCost: 32,
    purchaseAmount: 2,
    tier: "flavor",
  },
  hazelnutSyrup: {
    id: "hazelnutSyrup",
    name: "헤이즐넛 시럽",
    description: "견과 향을 가진 시럽",
    coinCost: 34,
    purchaseAmount: 2,
    tier: "flavor",
  },
  mochaSauce: {
    id: "mochaSauce",
    name: "모카 소스",
    description: "초코와 커피의 진한 조합",
    coinCost: 38,
    purchaseAmount: 2,
    tier: "flavor",
  },
  honey: {
    id: "honey",
    name: "꿀",
    description: "따뜻한 단맛을 더하는 재료",
    coinCost: 36,
    purchaseAmount: 2,
    tier: "premium",
  },
  matchaPowder: {
    id: "matchaPowder",
    name: "말차 파우더",
    description: "녹차 계열 메뉴의 핵심 재료",
    coinCost: 52,
    purchaseAmount: 1,
    tier: "premium",
  },
  blackTeaBase: {
    id: "blackTeaBase",
    name: "홍차 베이스",
    description: "티 메뉴 확장을 위한 베이스",
    coinCost: 44,
    purchaseAmount: 2,
    tier: "premium",
  },
  fruitBase: {
    id: "fruitBase",
    name: "과일 베이스",
    description: "상큼한 시즌 메뉴 재료",
    coinCost: 36,
    purchaseAmount: 2,
    tier: "premium",
  },
  sparklingWater: {
    id: "sparklingWater",
    name: "탄산수",
    description: "가벼운 에이드 메뉴에 사용해요",
    coinCost: 24,
    purchaseAmount: 3,
    tier: "basic",
  },
  rareIngredient: {
    id: "rareIngredient",
    name: "희귀 재료",
    description: "특별 메뉴 전용 슬롯",
    coinCost: 110,
    purchaseAmount: 1,
    tier: "rare",
  },
};

export function defaultMaterialInventory(): MaterialInventory {
  return MATERIAL_ORDER.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as MaterialInventory);
}

export function normalizeMaterialInventory(
  input: Partial<MaterialInventory> | undefined | null,
): MaterialInventory {
  return {
    ...defaultMaterialInventory(),
    ...(input ?? {}),
  };
}

export function materialDefinition(id: MaterialId): MaterialDefinition {
  return MATERIAL_DEFINITIONS[id];
}

export function materialUnitCost(id: MaterialId): number {
  const material = MATERIAL_DEFINITIONS[id];
  return Math.ceil(material.coinCost / material.purchaseAmount);
}
