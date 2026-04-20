import {
  MissionCategory,
  MissionType,
  type BeverageId,
  type DrinkMenuId,
  type MissionDefinition,
  type TimeOfDayId,
} from "@/features/meta/types/gameState";
import { MAX_ACCOUNT_LEVEL, missionSlotCountForLevel } from "./levelBands";

const DRINK_ORDER: DrinkMenuId[] = ["americano", "latte", "affogato"];
const TIME_ORDER: TimeOfDayId[] = ["morning", "day", "evening", "night"];
const TIME_RECIPE_ORDER: BeverageId[] = [
  "morning_mist_latte",
  "noon_citrus_coffee",
  "evening_caramel_crema",
  "night_velvet_mocha",
];

function drinkLabel(id: DrinkMenuId): string {
  if (id === "latte") return "라떼";
  if (id === "affogato") return "아포가토";
  return "아메리카노";
}

function targetFor(type: MissionType, level: number): number {
  switch (type) {
    case MissionType.CumulativeScore:
      return 120 + level * 70;
    case MissionType.SingleSessionScore:
      return 96 + level * 24;
    case MissionType.MergeCount:
      return 5 + Math.floor(level * 1.15);
    case MissionType.BeansEarned:
      return 1 + Math.floor(level / 5);
    case MissionType.BeansRoasted:
      return 2 + Math.floor(level / 4);
    case MissionType.ShotsCreated:
      return 3 + Math.floor(level / 4);
    case MissionType.DrinksCrafted:
      return 1 + Math.floor(level / 12);
    case MissionType.SpecificDrinkSold:
      return 1 + Math.floor(level / 14);
    case MissionType.TotalDrinksSold:
      return 2 + Math.floor(level / 9);
    case MissionType.CoinsEarned:
      return 25 + level * 12;
    case MissionType.RecipePurchased:
    case MissionType.CollectionRegistered:
    case MissionType.TimeRecipePurchased:
    case MissionType.SkinPurchased:
      return 1;
    case MissionType.TimeDrinkSold:
      return 1 + Math.floor(level / 18);
    default:
      return 1;
  }
}

function definitionFor(level: number, slotIndex: number): MissionDefinition {
  const drinkId = DRINK_ORDER[(level + slotIndex) % DRINK_ORDER.length]!;
  const timeOfDay = TIME_ORDER[Math.floor(level / 10) % TIME_ORDER.length]!;
  const timeRecipeId =
    TIME_RECIPE_ORDER[Math.floor(level / 10) % TIME_RECIPE_ORDER.length]!;

  if (level === 2 && slotIndex === 0) {
    return {
      id: `lv${level}-slot${slotIndex}-recipe-latte`,
      level,
      slotIndex,
      category: MissionCategory.ShopTimeLink,
      type: MissionType.RecipePurchased,
      title: "라떼 노트 구매",
      target: 1,
      params: { recipeId: "latte" },
    };
  }

  if (level === 3 && slotIndex === 0) {
    return {
      id: `lv${level}-slot${slotIndex}-recipe-affogato`,
      level,
      slotIndex,
      category: MissionCategory.ShopTimeLink,
      type: MissionType.RecipePurchased,
      title: "아포가토 노트 구매",
      target: 1,
      params: { recipeId: "affogato" },
    };
  }

  if (slotIndex === 0) {
    const variants = [
      MissionType.CumulativeScore,
      MissionType.SingleSessionScore,
      MissionType.MergeCount,
      MissionType.BeansEarned,
    ];
    const type = variants[level % variants.length]!;
    const title =
      type === MissionType.CumulativeScore
        ? "점수 모으기"
        : type === MissionType.SingleSessionScore
          ? "한 판 집중"
          : type === MissionType.MergeCount
            ? "타일 합치기"
            : "원두 모으기";
    return {
      id: `lv${level}-slot${slotIndex}-${type}`,
      level,
      slotIndex,
      category: MissionCategory.Puzzle,
      type,
      title,
      target: targetFor(type, level),
    };
  }

  if (slotIndex === 1) {
    const variants = [
      MissionType.BeansRoasted,
      MissionType.ShotsCreated,
      MissionType.DrinksCrafted,
      MissionType.CoinsEarned,
    ];
    const type = variants[level % variants.length]!;
    const title =
      type === MissionType.BeansRoasted
        ? "원두 로스팅"
        : type === MissionType.ShotsCreated
          ? "샷 준비"
          : type === MissionType.DrinksCrafted
            ? "음료 만들기"
            : "코인 모으기";
    return {
      id: `lv${level}-slot${slotIndex}-${type}`,
      level,
      slotIndex,
      category:
        type === MissionType.CoinsEarned
          ? MissionCategory.Sales
          : MissionCategory.Production,
      type,
      title,
      target: targetFor(type, level),
    };
  }

  const variants = [
    MissionType.TotalDrinksSold,
    MissionType.SpecificDrinkSold,
    MissionType.CollectionRegistered,
    MissionType.TimeDrinkSold,
    MissionType.SkinPurchased,
    MissionType.TimeRecipePurchased,
  ];
  const type = variants[level % variants.length]!;
  const title =
    type === MissionType.TotalDrinksSold
      ? "음료 판매"
      : type === MissionType.SpecificDrinkSold
        ? `${drinkLabel(drinkId)} 판매`
        : type === MissionType.CollectionRegistered
          ? "손님 기록"
          : type === MissionType.TimeDrinkSold
            ? "시간대 판매"
            : type === MissionType.SkinPurchased
              ? "새 꾸밈 담기"
              : "시간대 노트";
  return {
    id: `lv${level}-slot${slotIndex}-${type}`,
    level,
    slotIndex,
    category:
      type === MissionType.CollectionRegistered
        ? MissionCategory.Collection
        : type === MissionType.SpecificDrinkSold ||
            type === MissionType.TotalDrinksSold ||
            type === MissionType.TimeDrinkSold
          ? MissionCategory.Sales
          : MissionCategory.ShopTimeLink,
    type,
    title,
    target: targetFor(type, level),
    params: {
      drinkId:
        type === MissionType.SpecificDrinkSold || type === MissionType.TimeDrinkSold
          ? drinkId
          : undefined,
      beverageId:
        type === MissionType.TimeRecipePurchased ? timeRecipeId : undefined,
      timeOfDay:
        type === MissionType.TimeDrinkSold ||
        type === MissionType.TimeRecipePurchased
          ? timeOfDay
          : undefined,
      collectionKind:
        type === MissionType.CollectionRegistered ? "story" : undefined,
    },
  };
}

export const MISSION_DEFINITIONS: MissionDefinition[] = Array.from(
  { length: MAX_ACCOUNT_LEVEL },
  (_, i) => i + 1,
).flatMap((level) =>
  Array.from({ length: missionSlotCountForLevel(level) }, (_, slotIndex) =>
    definitionFor(level, slotIndex),
  ),
);

export function missionDefinitionsForLevel(level: number): MissionDefinition[] {
  return MISSION_DEFINITIONS.filter((definition) => definition.level === level);
}

export function missionDefinitionById(id: string): MissionDefinition | null {
  return MISSION_DEFINITIONS.find((definition) => definition.id === id) ?? null;
}
