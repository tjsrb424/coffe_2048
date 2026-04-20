import type {
  BeverageCategoryDefinition,
  BeverageCategoryId,
  BeverageDefinition,
  BeverageId,
  BeverageRarity,
  DrinkMenuId,
  TimeOfDayId,
} from "@/features/meta/types/gameState";

type BeverageSeed = {
  id: BeverageId;
  name: string;
  description: string;
  rarity: BeverageRarity;
  recipeId?: DrinkMenuId;
  timeLimited?: TimeOfDayId;
};

export const BEVERAGE_CATEGORY_ORDER: BeverageCategoryId[] = [
  "espressoBasic",
  "milkCoffee",
  "sweetLatte",
  "mochaDessert",
  "teaLatte",
  "refreshing",
  "rareIngredient",
  "timeLimited",
  "signature",
  "legendaryCollection",
];

export const BEVERAGE_CATEGORIES: Record<
  BeverageCategoryId,
  BeverageCategoryDefinition
> = {
  espressoBasic: {
    id: "espressoBasic",
    title: "에스프레소/기본 커피",
    shortTitle: "기본 커피",
    description: "가장 먼저 익히는 커피의 뼈대",
  },
  milkCoffee: {
    id: "milkCoffee",
    title: "기본 우유 커피",
    shortTitle: "우유 커피",
    description: "우유와 샷을 다루는 기본 루틴",
  },
  sweetLatte: {
    id: "sweetLatte",
    title: "시럽/달달 라떼",
    shortTitle: "달달 라떼",
    description: "시럽으로 향을 쌓는 부드러운 메뉴",
  },
  mochaDessert: {
    id: "mochaDessert",
    title: "모카/디저트 커피",
    shortTitle: "디저트",
    description: "크림과 소스로 완성하는 디저트 라인",
  },
  teaLatte: {
    id: "teaLatte",
    title: "말차/티 라떼",
    shortTitle: "티 라떼",
    description: "차 베이스와 우유가 만나는 메뉴",
  },
  refreshing: {
    id: "refreshing",
    title: "청량/아이스/논커피",
    shortTitle: "청량",
    description: "가볍고 시원한 시간대 보조 메뉴",
  },
  rareIngredient: {
    id: "rareIngredient",
    title: "희귀 재료 음료",
    shortTitle: "희귀 재료",
    description: "비싼 재료로 마진과 수집감을 만드는 메뉴",
  },
  timeLimited: {
    id: "timeLimited",
    title: "시간대 한정 음료",
    shortTitle: "시간 한정",
    description: "아침, 낮, 저녁, 밤에 떠돌이 판매상이 들고 와요",
  },
  signature: {
    id: "signature",
    title: "시그니처 음료",
    shortTitle: "시그니처",
    description: "카페의 분위기를 대표하는 고유 메뉴",
  },
  legendaryCollection: {
    id: "legendaryCollection",
    title: "전설/고급 컬렉션 음료",
    shortTitle: "컬렉션",
    description: "후반 성장의 긴 목표가 되는 메뉴",
  },
};

const LEVEL_SEQUENCE = [
  1, 2, 3, 4, 6, 7, 9, 10,
  11, 12, 14, 15, 17, 18, 19, 20,
  21, 22, 24, 25, 27, 28, 29, 30,
  31, 32, 33, 35, 36, 37, 38, 39, 40, 40,
  41, 42, 43, 45, 46, 47, 48, 49, 50, 50,
  51, 52, 53, 55, 56, 57, 58, 59, 60, 60,
  61, 62, 64, 65, 67, 68, 69, 70,
  71, 72, 74, 75, 77, 78, 79, 80,
  81, 83, 85, 87, 89, 90,
  91, 94, 97, 100,
] as const;

const BEVERAGE_SEEDS_BY_CATEGORY: Record<BeverageCategoryId, BeverageSeed[]> = {
  espressoBasic: [
    {
      id: "americano",
      name: "아메리카노",
      description: "깔끔한 첫 잔. 모든 운영의 기준이 돼요.",
      rarity: "common",
      recipeId: "americano",
    },
    { id: "espresso", name: "에스프레소", description: "짧고 진한 기본 추출.", rarity: "common" },
    { id: "doppio", name: "도피오", description: "샷을 두 배로 담은 진한 잔.", rarity: "common" },
    { id: "lungo", name: "룽고", description: "긴 추출로 부드럽게 늘린 커피.", rarity: "common" },
    { id: "ristretto", name: "리스트레토", description: "짧은 추출의 농밀한 향.", rarity: "uncommon" },
    { id: "cafe_crema", name: "카페 크레마", description: "부드러운 크레마가 남는 기본 커피.", rarity: "uncommon" },
    { id: "cold_brew", name: "콜드브루", description: "천천히 내려 차분한 산미를 담아요.", rarity: "uncommon" },
    { id: "long_black", name: "롱 블랙", description: "물 위에 샷을 얹어 향을 살려요.", rarity: "uncommon" },
  ],
  milkCoffee: [
    {
      id: "latte",
      name: "카페 라떼",
      description: "우유와 샷의 부드러운 균형.",
      rarity: "common",
      recipeId: "latte",
    },
    { id: "cappuccino", name: "카푸치노", description: "거품과 샷의 가벼운 균형.", rarity: "common" },
    { id: "flat_white", name: "플랫 화이트", description: "얇은 밀크폼으로 향을 선명하게.", rarity: "common" },
    { id: "cortado", name: "코르타도", description: "샷과 우유를 짧게 맞춘 잔.", rarity: "uncommon" },
    { id: "cafe_au_lait", name: "카페 오레", description: "편안한 우유 커피의 기본.", rarity: "common" },
    { id: "milk_espresso", name: "밀크 에스프레소", description: "우유 위에 샷을 짧게 올려요.", rarity: "uncommon" },
    { id: "oat_latte", name: "오트 라떼", description: "고소한 식물성 라떼.", rarity: "uncommon" },
    { id: "breve_latte", name: "브레베 라떼", description: "크림감이 진한 우유 커피.", rarity: "rare" },
  ],
  sweetLatte: [
    { id: "vanilla_latte", name: "바닐라 라떼", description: "바닐라 향이 은은하게 남아요.", rarity: "uncommon" },
    { id: "caramel_latte", name: "카라멜 라떼", description: "고소한 단맛을 올린 라떼.", rarity: "uncommon" },
    { id: "hazelnut_latte", name: "헤이즐넛 라떼", description: "견과 향이 부드럽게 퍼져요.", rarity: "uncommon" },
    { id: "honey_latte", name: "허니 라떼", description: "꿀의 따뜻한 단맛을 담아요.", rarity: "rare" },
    { id: "maple_latte", name: "메이플 라떼", description: "깊은 시럽 향이 남는 라떼.", rarity: "rare" },
    { id: "cinnamon_latte", name: "시나몬 라떼", description: "향신료가 조용히 올라와요.", rarity: "rare" },
    { id: "brown_sugar_latte", name: "흑당 라떼", description: "진한 단맛의 오후 메뉴.", rarity: "rare" },
    { id: "salted_caramel_latte", name: "솔티드 카라멜 라떼", description: "짭조름한 끝맛이 있는 라떼.", rarity: "rare" },
  ],
  mochaDessert: [
    { id: "mocha", name: "카페 모카", description: "초코와 샷이 만나는 기본 디저트.", rarity: "uncommon" },
    { id: "white_mocha", name: "화이트 모카", description: "부드럽고 달콤한 모카 변주.", rarity: "rare" },
    { id: "chocolate_latte", name: "초코 라떼", description: "커피 없이도 편안한 달콤함.", rarity: "uncommon" },
    {
      id: "affogato",
      name: "아포가토",
      description: "달콤한 크림 위에 샷을 얹어요.",
      rarity: "rare",
      recipeId: "affogato",
    },
    { id: "cream_mocha", name: "크림 모카", description: "크림과 모카 소스의 묵직한 잔.", rarity: "rare" },
    { id: "tiramisu_latte", name: "티라미수 라떼", description: "디저트 향을 라떼로 접어요.", rarity: "rare" },
    { id: "cocoa_espresso", name: "코코아 에스프레소", description: "쌉싸름한 코코아와 진한 샷.", rarity: "rare" },
    { id: "dessert_con_panna", name: "디저트 콘파냐", description: "크림 위에 향을 짧게 남겨요.", rarity: "signature" },
  ],
  teaLatte: [
    { id: "matcha_latte", name: "말차 라떼", description: "쌉싸름한 녹차와 우유의 균형.", rarity: "uncommon" },
    { id: "hojicha_latte", name: "호지차 라떼", description: "볶은 차 향이 따뜻하게 남아요.", rarity: "rare" },
    { id: "black_tea_latte", name: "홍차 라떼", description: "차분한 향의 우유 티.", rarity: "uncommon" },
    { id: "earl_grey_latte", name: "얼그레이 라떼", description: "베르가못 향이 은은한 라떼.", rarity: "rare" },
    { id: "chai_latte", name: "차이 라떼", description: "향신료를 얹은 티 라떼.", rarity: "rare" },
    { id: "matcha_espresso", name: "말차 에스프레소", description: "말차 위에 샷을 천천히 올려요.", rarity: "rare" },
    { id: "royal_milk_tea", name: "로열 밀크티", description: "홍차를 진하게 끓인 고급 메뉴.", rarity: "signature" },
    { id: "jasmine_tea_latte", name: "자스민 티 라떼", description: "꽃향이 조용히 남는 티 라떼.", rarity: "rare" },
  ],
  refreshing: [
    { id: "lemonade_coffee", name: "레모네이드 커피", description: "산뜻한 산미와 커피의 조합.", rarity: "uncommon" },
    { id: "sparkling_ade", name: "스파클링 에이드", description: "탄산으로 가볍게 쉬어가는 잔.", rarity: "common" },
    { id: "iced_peach_tea", name: "아이스 피치티", description: "달콤한 복숭아 향의 아이스 티.", rarity: "common" },
    { id: "espresso_tonic", name: "에스프레소 토닉", description: "탄산 위에 샷을 띄운 청량 메뉴.", rarity: "rare" },
    { id: "fruit_coffee_fizz", name: "프루트 커피 피즈", description: "과일 베이스와 커피의 밝은 조합.", rarity: "rare" },
    { id: "mint_cooler", name: "민트 쿨러", description: "가볍고 시원한 논커피 메뉴.", rarity: "uncommon" },
    { id: "grapefruit_cold_brew", name: "자몽 콜드브루", description: "자몽 산미를 얹은 콜드브루.", rarity: "rare" },
    { id: "blue_soda", name: "블루 소다", description: "손님 눈에 먼저 들어오는 청량 메뉴.", rarity: "rare" },
  ],
  rareIngredient: [
    { id: "rare_bean_latte", name: "희귀 원두 라떼", description: "비싼 원두 향을 우유로 감싸요.", rarity: "rare" },
    { id: "honey_cream_espresso", name: "허니 크림 에스프레소", description: "꿀과 크림을 짧게 올린 잔.", rarity: "rare" },
    { id: "matcha_cream_mocha", name: "말차 크림 모카", description: "말차와 모카의 진한 교차점.", rarity: "signature" },
    { id: "fruit_cream_latte", name: "과일 크림 라떼", description: "과일 베이스와 크림의 부드러운 잔.", rarity: "rare" },
    { id: "gold_vanilla_latte", name: "골드 바닐라 라떼", description: "희귀 재료를 더한 고급 바닐라.", rarity: "signature" },
    { id: "rare_caramel_shot", name: "희귀 카라멜 샷", description: "짧지만 값이 높은 카라멜 메뉴.", rarity: "signature" },
    { id: "black_sesame_latte", name: "흑임자 라떼", description: "고소한 재료감이 강한 라떼.", rarity: "rare" },
    { id: "chestnut_cream_latte", name: "밤 크림 라떼", description: "가을 느낌의 묵직한 크림 라떼.", rarity: "signature" },
  ],
  timeLimited: [
    { id: "morning_mist_latte", name: "모닝 미스트 라떼", description: "아침 공기처럼 연한 한정 라떼.", rarity: "rare", timeLimited: "morning" },
    { id: "noon_citrus_coffee", name: "정오의 시트러스 커피", description: "낮에만 어울리는 산뜻한 커피.", rarity: "rare", timeLimited: "day" },
    { id: "evening_caramel_crema", name: "이브닝 카라멜 크레마", description: "저녁빛을 닮은 카라멜 메뉴.", rarity: "signature", timeLimited: "evening" },
    { id: "night_velvet_mocha", name: "나이트 벨벳 모카", description: "밤에만 조용히 꺼내는 모카.", rarity: "signature", timeLimited: "night" },
    { id: "dawn_honey_shot", name: "새벽 허니 샷", description: "이른 시간에 달게 깨우는 잔.", rarity: "rare", timeLimited: "morning" },
    { id: "sunset_tea_latte", name: "선셋 티 라떼", description: "해질녘에 어울리는 차분한 티 라떼.", rarity: "signature", timeLimited: "evening" },
    { id: "midnight_tonic", name: "미드나잇 토닉", description: "밤의 탄산감이 있는 한정 메뉴.", rarity: "signature", timeLimited: "night" },
    { id: "traveler_blend", name: "떠돌이 블렌드", description: "판매상이 남기고 가는 계절 블렌드.", rarity: "rare", timeLimited: "day" },
  ],
  signature: [
    { id: "house_signature", name: "하우스 시그니처", description: "카페의 첫 대표 메뉴.", rarity: "signature" },
    { id: "white_garden_latte", name: "화이트 가든 라떼", description: "차분한 꽃향을 닮은 라떼.", rarity: "signature" },
    { id: "velvet_crema", name: "벨벳 크레마", description: "부드러운 크레마를 오래 남겨요.", rarity: "signature" },
    { id: "atelier_mocha", name: "아틀리에 모카", description: "공방처럼 정성스럽게 쌓은 모카.", rarity: "signature" },
    { id: "rose_vanilla_latte", name: "로즈 바닐라 라떼", description: "장미와 바닐라 향의 조용한 조합.", rarity: "signature" },
    { id: "coffee_blossom", name: "커피 블라썸", description: "커피 향이 꽃처럼 퍼지는 메뉴.", rarity: "signature" },
    { id: "nutty_cloud", name: "너티 클라우드", description: "견과 향과 크림이 올라간 대표 메뉴.", rarity: "signature" },
    { id: "cafe_2048_signature", name: "카페 2048 시그니처", description: "2048번째 잔을 기다리는 상징 메뉴.", rarity: "signature" },
  ],
  legendaryCollection: [
    { id: "legendary_espresso", name: "전설의 에스프레소", description: "깊은 성장 끝에 남는 가장 짧은 잔.", rarity: "legendary" },
    { id: "moonlight_affogato", name: "문라이트 아포가토", description: "달빛 같은 크림과 샷의 컬렉션 메뉴.", rarity: "legendary" },
    { id: "golden_crema", name: "골든 크레마", description: "빛나는 크레마가 오래 남는 잔.", rarity: "legendary" },
    { id: "collector_latte", name: "컬렉터 라떼", description: "수집가를 위한 후반 라떼.", rarity: "legendary" },
    { id: "royal_mocha", name: "로열 모카", description: "가장 무거운 모카 컬렉션.", rarity: "legendary" },
    { id: "starlight_tea", name: "스타라이트 티", description: "밤하늘을 닮은 고급 티 메뉴.", rarity: "legendary" },
    { id: "ancient_bean_brew", name: "고대 원두 브루", description: "오래된 원두 기록을 담은 잔.", rarity: "legendary" },
    { id: "final_cup", name: "파이널 컵", description: "마지막 레벨의 조용한 목표.", rarity: "legendary" },
  ],
};

export const BEVERAGE_DEFINITIONS: BeverageDefinition[] = BEVERAGE_CATEGORY_ORDER.flatMap(
  (categoryId) => BEVERAGE_SEEDS_BY_CATEGORY[categoryId].map((seed) => seed),
).map((seed, index) => ({
  ...seed,
  categoryId: categoryIdForSeed(seed.id),
  unlockLevel: LEVEL_SEQUENCE[index] ?? 100,
  guestReactionSlot: `guest-reaction:${seed.id}`,
}));

export const BEVERAGE_BY_ID: Record<BeverageId, BeverageDefinition> =
  Object.fromEntries(
    BEVERAGE_DEFINITIONS.map((beverage) => [beverage.id, beverage]),
  );

export const BEVERAGE_ID_BY_RECIPE_ID: Record<DrinkMenuId, BeverageId> = {
  americano: "americano",
  latte: "latte",
  affogato: "affogato",
};

function categoryIdForSeed(id: BeverageId): BeverageCategoryId {
  for (const categoryId of BEVERAGE_CATEGORY_ORDER) {
    if (BEVERAGE_SEEDS_BY_CATEGORY[categoryId].some((seed) => seed.id === id)) {
      return categoryId;
    }
  }
  return "espressoBasic";
}

export function beverageDefinition(id: BeverageId): BeverageDefinition | null {
  return BEVERAGE_BY_ID[id] ?? null;
}

export function beverageForRecipeId(id: DrinkMenuId): BeverageDefinition {
  return BEVERAGE_BY_ID[BEVERAGE_ID_BY_RECIPE_ID[id]]!;
}
