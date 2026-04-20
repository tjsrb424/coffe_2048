import type {
  AccountLevelState,
  DrinkMenuId,
  LevelBand,
  LevelUnlock,
} from "@/features/meta/types/gameState";
import { recipePurchaseCost as economyRecipePurchaseCost } from "@/features/meta/economy/recipes";

export const MAX_ACCOUNT_LEVEL = 100;

export const LEVEL_BANDS: LevelBand[] = [
  { id: "tier-00", tierIndex: 0, levelMin: 1, levelMax: 9, title: "첫 향", backgroundSlot: "tier-bg-00" },
  { id: "tier-01", tierIndex: 1, levelMin: 10, levelMax: 19, title: "따뜻한 잔", backgroundSlot: "tier-bg-01" },
  { id: "tier-02", tierIndex: 2, levelMin: 20, levelMax: 29, title: "작은 단골", backgroundSlot: "tier-bg-02" },
  { id: "tier-03", tierIndex: 3, levelMin: 30, levelMax: 39, title: "부드러운 오후", backgroundSlot: "tier-bg-03" },
  { id: "tier-04", tierIndex: 4, levelMin: 40, levelMax: 49, title: "조용한 카운터", backgroundSlot: "tier-bg-04" },
  { id: "tier-05", tierIndex: 5, levelMin: 50, levelMax: 59, title: "깊은 로스팅", backgroundSlot: "tier-bg-05" },
  { id: "tier-06", tierIndex: 6, levelMin: 60, levelMax: 69, title: "은은한 밤", backgroundSlot: "tier-bg-06" },
  { id: "tier-07", tierIndex: 7, levelMin: 70, levelMax: 79, title: "긴 여운", backgroundSlot: "tier-bg-07" },
  { id: "tier-08", tierIndex: 8, levelMin: 80, levelMax: 89, title: "가득한 선반", backgroundSlot: "tier-bg-08" },
  { id: "tier-09", tierIndex: 9, levelMin: 90, levelMax: 99, title: "마지막 향", backgroundSlot: "tier-bg-09" },
  { id: "tier-10", tierIndex: 10, levelMin: 100, levelMax: 100, title: "마스터 카페", backgroundSlot: "tier-bg-10" },
];

export const LEVEL_UNLOCKS: LevelUnlock[] = [
  {
    level: 1,
    title: "기본 레시피",
    preview: "아메리카노 제작 가능",
    recipeIds: ["americano"],
  },
  {
    level: 2,
    title: "라떼 노트",
    preview: "카페 라떼 구매 가능",
    recipeIds: ["latte"],
    coinReward: 20,
  },
  {
    level: 3,
    title: "디저트 노트",
    preview: "아포가토 구매 가능",
    recipeIds: ["affogato"],
    coinReward: 24,
  },
  { level: 5, title: "작은 저금통", preview: "코인 보너스", coinReward: 40 },
  { level: 10, title: "새 배경 슬롯", preview: "티어 배경 변경", coinReward: 80 },
  { level: 20, title: "두 번째 온기", preview: "코인 보너스", coinReward: 120 },
  { level: 30, title: "넓어진 루틴", preview: "미션 준비", coinReward: 160 },
  { level: 31, title: "세 번째 미션", preview: "미션 3개 진행", coinReward: 180 },
  { level: 50, title: "깊은 향", preview: "원두 보너스", beanReward: 10 },
  { level: 75, title: "단골의 시간", preview: "코인 보너스", coinReward: 260 },
  { level: 100, title: "마스터 카페", preview: "마스터 배경 슬롯", coinReward: 500 },
];

export function missionSlotCountForLevel(level: number): number {
  if (level <= 10) return 1;
  if (level <= 30) return 2;
  return 3;
}

export function tierIndexForLevel(level: number): number {
  const lv = Math.max(1, Math.min(MAX_ACCOUNT_LEVEL, Math.floor(level)));
  if (lv >= MAX_ACCOUNT_LEVEL) return 10;
  return Math.floor(lv / 10);
}

export function levelBandForLevel(level: number): LevelBand {
  const tierIndex = tierIndexForLevel(level);
  return LEVEL_BANDS.find((band) => band.tierIndex === tierIndex) ?? LEVEL_BANDS[0]!;
}

export function unlocksForLevel(level: number): LevelUnlock[] {
  return LEVEL_UNLOCKS.filter((unlock) => unlock.level === level);
}

export function recipeIdsUnlockedByLevel(level: number): DrinkMenuId[] {
  const ids = new Set<DrinkMenuId>(["americano"]);
  for (const unlock of LEVEL_UNLOCKS) {
    if (unlock.level <= level) {
      for (const id of unlock.recipeIds ?? []) ids.add(id);
    }
  }
  return Array.from(ids);
}

export function nextUnlockPreview(level: number): LevelUnlock | null {
  return (
    LEVEL_UNLOCKS.find((unlock) => unlock.level > level) ??
    (level < MAX_ACCOUNT_LEVEL
      ? {
          level: level + 1,
          title: "다음 레벨",
          preview: "코인 보너스",
          coinReward: levelRewardForLevel(level + 1).coins,
          beanReward: levelRewardForLevel(level + 1).beans,
        }
      : null)
  );
}

export function levelRewardForLevel(level: number): { coins: number; beans: number } {
  const unlocks = unlocksForLevel(level);
  const coins =
    unlocks.reduce((sum, unlock) => sum + (unlock.coinReward ?? 0), 0) ||
    Math.max(8, Math.floor(10 + level * 1.5));
  const beans = unlocks.reduce((sum, unlock) => sum + (unlock.beanReward ?? 0), 0);
  return { coins, beans };
}

export function recipePurchaseCost(id: DrinkMenuId): number {
  return economyRecipePurchaseCost(id);
}

export function canPurchaseRecipe(
  account: AccountLevelState,
  id: DrinkMenuId,
  coins: number,
): boolean {
  return (
    account.unlockedRecipeIds.includes(id) &&
    !account.purchasedRecipeIds.includes(id) &&
    coins >= recipePurchaseCost(id)
  );
}
