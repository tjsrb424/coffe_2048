import {
  MissionType,
  type AccountLevelState,
  type DrinkMenuId,
  type LevelUnlock,
  type MissionDefinition,
  type MissionEvent,
  type MissionProgressState,
  type MissionSlot,
  type PlayerResources,
} from "@/features/meta/types/gameState";
import {
  MAX_ACCOUNT_LEVEL,
  levelRewardForLevel,
  recipeIdsUnlockedByLevel,
  tierIndexForLevel,
  unlocksForLevel,
} from "./levelBands";
import {
  missionDefinitionById,
  missionDefinitionsForLevel,
} from "./missionDefinitions";

export type MissionApplyResult = {
  account: AccountLevelState;
  levelUps: number[];
  unlocks: LevelUnlock[];
  rewards: Pick<PlayerResources, "coins" | "beans">;
};

function slotIdFor(level: number, slotIndex: number): string {
  return `lv${level}-slot${slotIndex}`;
}

function buildSlotsForLevel(level: number, nowMs: number): {
  slots: MissionSlot[];
  progress: MissionProgressState;
} {
  const definitions = missionDefinitionsForLevel(level);
  const progress: MissionProgressState = {};
  const slots = definitions.map((definition) => {
    const id = slotIdFor(level, definition.slotIndex);
    progress[id] = {
      current: 0,
      target: definition.target,
      completed: false,
      updatedAtMs: nowMs,
      completedAtMs: null,
    };
    return {
      id,
      slotIndex: definition.slotIndex,
      missionId: definition.id,
      startedAtMs: nowMs,
      completedAtMs: null,
    };
  });
  return { slots, progress };
}

export function createDefaultAccountLevelState(nowMs = 0): AccountLevelState {
  const { slots, progress } = buildSlotsForLevel(1, nowMs);
  return {
    level: 1,
    tierIndex: tierIndexForLevel(1),
    currentLevelCompleted: false,
    levelStartedAtMs: nowMs,
    lastLevelUpAtMs: 0,
    missionSlots: slots,
    missionProgress: progress,
    unlockedRecipeIds: recipeIdsUnlockedByLevel(1),
    purchasedRecipeIds: ["americano"],
  };
}

function uniqueRecipeIds(ids: DrinkMenuId[]): DrinkMenuId[] {
  return Array.from(new Set(ids));
}

export function normalizeAccountLevelState(
  input: AccountLevelState | undefined | null,
  nowMs = Date.now(),
): AccountLevelState {
  if (!input || typeof input !== "object") {
    return createDefaultAccountLevelState(nowMs);
  }

  const level = Math.max(
    1,
    Math.min(MAX_ACCOUNT_LEVEL, Math.floor(input.level || 1)),
  );
  const expectedDefinitions = missionDefinitionsForLevel(level);
  const hasValidSlots =
    Array.isArray(input.missionSlots) &&
    input.missionSlots.length === expectedDefinitions.length &&
    input.missionSlots.every((slot) =>
      expectedDefinitions.some((definition) => definition.id === slot.missionId),
    );

  const base =
    hasValidSlots && input.missionProgress
      ? {
          slots: input.missionSlots,
          progress: input.missionProgress,
        }
      : buildSlotsForLevel(level, input.levelStartedAtMs || nowMs);

  const progress: MissionProgressState = {};
  for (const slot of base.slots) {
    const definition = missionDefinitionById(slot.missionId);
    if (!definition) continue;
    const prev = base.progress[slot.id];
    const current = Math.max(0, prev?.current ?? 0);
    const completed = prev?.completed ?? current >= definition.target;
    progress[slot.id] = {
      current,
      target: definition.target,
      completed,
      updatedAtMs: prev?.updatedAtMs ?? nowMs,
      completedAtMs:
        prev?.completedAtMs ?? (completed ? prev?.updatedAtMs ?? nowMs : null),
    };
  }

  const unlockedRecipeIds = uniqueRecipeIds([
    ...recipeIdsUnlockedByLevel(level),
    ...(input.unlockedRecipeIds ?? []),
  ]);
  const purchasedRecipeIds = uniqueRecipeIds([
    "americano",
    ...(input.purchasedRecipeIds ?? []),
  ]).filter((id) => unlockedRecipeIds.includes(id));

  const currentLevelCompleted =
    base.slots.length > 0 &&
    base.slots.every((slot) => progress[slot.id]?.completed);

  return {
    level,
    tierIndex: tierIndexForLevel(level),
    currentLevelCompleted,
    levelStartedAtMs: input.levelStartedAtMs || nowMs,
    lastLevelUpAtMs: input.lastLevelUpAtMs ?? 0,
    missionSlots: base.slots.map((slot) => ({
      ...slot,
      completedAtMs: progress[slot.id]?.completedAtMs ?? slot.completedAtMs,
    })),
    missionProgress: progress,
    unlockedRecipeIds,
    purchasedRecipeIds,
  };
}

function soldAmountForDrink(
  soldByMenu: Partial<Record<DrinkMenuId, number>>,
  id: DrinkMenuId | undefined,
): number {
  if (!id) return 0;
  return soldByMenu[id] ?? 0;
}

function eventDelta(
  definition: MissionDefinition,
  event: MissionEvent,
): { mode: "add" | "max"; value: number } {
  switch (definition.type) {
    case MissionType.CumulativeScore:
      return event.type === "puzzleRunCompleted"
        ? { mode: "add", value: event.score }
        : { mode: "add", value: 0 };
    case MissionType.SingleSessionScore:
      return event.type === "puzzleRunCompleted"
        ? { mode: "max", value: event.score }
        : { mode: "max", value: 0 };
    case MissionType.MergeCount:
      return event.type === "puzzleRunCompleted"
        ? { mode: "add", value: event.mergeCount }
        : { mode: "add", value: 0 };
    case MissionType.BeansEarned:
      if (event.type === "puzzleRunCompleted") return { mode: "add", value: event.beans };
      return event.type === "beansEarned"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.BeansRoasted:
      return event.type === "beansRoasted"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.ShotsCreated:
      return event.type === "shotsCreated"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.DrinksCrafted:
      return event.type === "drinkCrafted"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.SpecificDrinkSold:
      return event.type === "drinkSold"
        ? {
            mode: "add",
            value: soldAmountForDrink(event.soldByMenu, definition.params?.drinkId),
          }
        : { mode: "add", value: 0 };
    case MissionType.TotalDrinksSold:
      return event.type === "drinkSold"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.CoinsEarned:
      if (event.type === "puzzleRunCompleted") return { mode: "add", value: event.coins };
      return event.type === "coinsEarned"
        ? { mode: "add", value: event.amount }
        : { mode: "add", value: 0 };
    case MissionType.RecipePurchased:
      return event.type === "recipePurchased" &&
        (!definition.params?.recipeId ||
          definition.params.recipeId === event.recipeId)
        ? { mode: "add", value: 1 }
        : { mode: "add", value: 0 };
    case MissionType.CollectionRegistered:
      return event.type === "collectionRegistered" &&
        (!definition.params?.collectionKind ||
          definition.params.collectionKind === event.collectionKind)
        ? { mode: "add", value: 1 }
        : { mode: "add", value: 0 };
    case MissionType.TimeRecipePurchased:
      return event.type === "timeRecipePurchased" &&
        definition.params?.timeOfDay === event.timeOfDay &&
        (!definition.params?.beverageId ||
          definition.params.beverageId === event.beverageId)
        ? { mode: "add", value: 1 }
        : { mode: "add", value: 0 };
    case MissionType.TimeDrinkSold:
      return event.type === "drinkSold" &&
        definition.params?.timeOfDay === event.timeOfDay
        ? {
            mode: "add",
            value:
              definition.params?.drinkId != null
                ? soldAmountForDrink(event.soldByMenu, definition.params.drinkId)
                : event.amount,
          }
        : { mode: "add", value: 0 };
    case MissionType.SkinPurchased:
      return event.type === "skinPurchased" &&
        (!definition.params?.skinId || definition.params.skinId === event.skinId)
        ? { mode: "add", value: 1 }
        : { mode: "add", value: 0 };
    default:
      return { mode: "add", value: 0 };
  }
}

function advanceIfComplete(
  account: AccountLevelState,
  nowMs: number,
): MissionApplyResult {
  const allComplete =
    account.missionSlots.length > 0 &&
    account.missionSlots.every(
      (slot) => account.missionProgress[slot.id]?.completed,
    );

  if (!allComplete || account.level >= MAX_ACCOUNT_LEVEL) {
    return {
      account: { ...account, currentLevelCompleted: allComplete },
      levelUps: [],
      unlocks: [],
      rewards: { coins: 0, beans: 0 },
    };
  }

  const nextLevel = account.level + 1;
  const { slots, progress } = buildSlotsForLevel(nextLevel, nowMs);
  const unlocks = unlocksForLevel(nextLevel);
  const reward = levelRewardForLevel(nextLevel);
  const unlockedRecipeIds = uniqueRecipeIds([
    ...account.unlockedRecipeIds,
    ...recipeIdsUnlockedByLevel(nextLevel),
  ]);

  return {
    account: {
      ...account,
      level: nextLevel,
      tierIndex: tierIndexForLevel(nextLevel),
      currentLevelCompleted: false,
      levelStartedAtMs: nowMs,
      lastLevelUpAtMs: nowMs,
      missionSlots: slots,
      missionProgress: progress,
      unlockedRecipeIds,
      purchasedRecipeIds: account.purchasedRecipeIds.filter((id) =>
        unlockedRecipeIds.includes(id),
      ),
    },
    levelUps: [nextLevel],
    unlocks,
    rewards: reward,
  };
}

export function applyMissionEvent(
  input: AccountLevelState,
  event: MissionEvent,
  nowMs = Date.now(),
): MissionApplyResult {
  const account = normalizeAccountLevelState(input, nowMs);
  if (account.level >= MAX_ACCOUNT_LEVEL && account.currentLevelCompleted) {
    return {
      account,
      levelUps: [],
      unlocks: [],
      rewards: { coins: 0, beans: 0 },
    };
  }

  let changed = false;
  const nextProgress: MissionProgressState = { ...account.missionProgress };
  const nextSlots = account.missionSlots.map((slot) => ({ ...slot }));

  for (const slot of nextSlots) {
    const definition = missionDefinitionById(slot.missionId);
    const current = nextProgress[slot.id];
    if (!definition || !current || current.completed) continue;
    const delta = eventDelta(definition, event);
    if (delta.value <= 0) continue;

    const nextCurrent =
      delta.mode === "max"
        ? Math.max(current.current, delta.value)
        : current.current + delta.value;
    const completed = nextCurrent >= definition.target;
    nextProgress[slot.id] = {
      ...current,
      current: Math.min(nextCurrent, definition.target),
      completed,
      updatedAtMs: nowMs,
      completedAtMs: completed ? nowMs : current.completedAtMs,
    };
    if (completed) slot.completedAtMs = nowMs;
    changed = true;
  }

  if (!changed) {
    return {
      account,
      levelUps: [],
      unlocks: [],
      rewards: { coins: 0, beans: 0 },
    };
  }

  return advanceIfComplete(
    {
      ...account,
      missionSlots: nextSlots,
      missionProgress: nextProgress,
    },
    nowMs,
  );
}
