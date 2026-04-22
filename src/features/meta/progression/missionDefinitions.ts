import {
  MissionCategory,
  MissionType,
  type DrinkMenuId,
  type MissionDefinition,
} from "@/features/meta/types/gameState";
import { MAX_ACCOUNT_LEVEL, missionSlotCountForLevel } from "./levelBands";

const DRINK_ORDER: DrinkMenuId[] = ["americano", "latte", "affogato"];

function drinkLabel(id: DrinkMenuId): string {
  if (id === "latte") return "라떼";
  if (id === "affogato") return "아포가토";
  return "아메리카노";
}

function phasedTarget(
  level: number,
  input: { base: number; early: number; mid: number; late: number },
): number {
  const lv = Math.max(1, Math.floor(level));
  const earlyLevels = Math.min(lv, 20);
  const midLevels = Math.max(0, Math.min(lv - 20, 30));
  const lateLevels = Math.max(0, lv - 50);
  return Math.floor(
    input.base +
      earlyLevels * input.early +
      midLevels * input.mid +
      lateLevels * input.late,
  );
}

function targetFor(type: MissionType, level: number): number {
  switch (type) {
    case MissionType.CumulativeScore:
      return phasedTarget(level, { base: 110, early: 48, mid: 58, late: 46 });
    case MissionType.SingleSessionScore:
      return phasedTarget(level, { base: 100, early: 18, mid: 20, late: 18 });
    case MissionType.MergeCount:
      return phasedTarget(level, { base: 4, early: 1, mid: 0.95, late: 0.75 });
    case MissionType.BeansEarned:
      return 1 + Math.floor(level / 6);
    case MissionType.BeansRoasted:
      return 2 + Math.floor(level / 5);
    case MissionType.ShotsCreated:
      return 3 + Math.floor(level / 5);
    case MissionType.DrinksCrafted:
      return 1 + Math.floor(level / 14);
    case MissionType.SpecificDrinkSold:
      return 1 + Math.floor(level / 16);
    case MissionType.TotalDrinksSold:
      return 2 + Math.floor(level / 12);
    case MissionType.CoinsEarned:
      return phasedTarget(level, { base: 18, early: 8, mid: 9, late: 7 });
    case MissionType.RecipePurchased:
    case MissionType.CollectionRegistered:
    case MissionType.TimeRecipePurchased:
    case MissionType.SkinPurchased:
      return 1;
    case MissionType.TimeDrinkSold:
      return 1 + Math.floor(level / 20);
    default:
      return 1;
  }
}

function definitionFor(level: number, slotIndex: number): MissionDefinition {
  const drinkId = DRINK_ORDER[(level + slotIndex) % DRINK_ORDER.length]!;

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

  // 2차 밸런스: 중후반 핵심 레벨업 미션은 현재 레벨에서 바로 진척 가능한
  // 판매/제작/코인 루프로만 구성해 성장이 막히지 않게 한다.
  const variants = [
    MissionType.TotalDrinksSold,
    MissionType.SpecificDrinkSold,
    MissionType.DrinksCrafted,
    MissionType.CoinsEarned,
  ];
  const type = variants[Math.floor(level / 2) % variants.length]!;
  const title =
    type === MissionType.TotalDrinksSold
      ? "음료 판매"
      : type === MissionType.SpecificDrinkSold
        ? `${drinkLabel(drinkId)} 판매`
        : type === MissionType.DrinksCrafted
          ? "메뉴 채우기"
          : "매출 모으기";
  return {
    id: `lv${level}-slot${slotIndex}-${type}`,
    level,
    slotIndex,
    category:
      type === MissionType.SpecificDrinkSold ||
      type === MissionType.TotalDrinksSold ||
      type === MissionType.CoinsEarned
        ? MissionCategory.Sales
        : MissionCategory.Production,
    type,
    title,
    target: targetFor(type, level),
    params: {
      drinkId: type === MissionType.SpecificDrinkSold ? drinkId : undefined,
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
