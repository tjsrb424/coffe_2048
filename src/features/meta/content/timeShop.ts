import type {
  BeverageId,
  TimeOfDayId,
  TimeShopEntry,
} from "@/features/meta/types/gameState";

export const TIME_SHOP_WINDOWS: Record<
  TimeOfDayId,
  { label: string; description: string; startHour: number; endHour: number }
> = {
  morning: {
    label: "아침",
    description: "가벼운 라떼와 달콤한 첫 잔",
    startHour: 5,
    endHour: 11,
  },
  day: {
    label: "낮",
    description: "산뜻한 커피와 밝은 블렌드",
    startHour: 11,
    endHour: 17,
  },
  evening: {
    label: "저녁",
    description: "카라멜과 티 라떼가 어울리는 시간",
    startHour: 17,
    endHour: 22,
  },
  night: {
    label: "밤",
    description: "묵직한 모카와 조용한 탄산감",
    startHour: 22,
    endHour: 5,
  },
};

// 2차 밸런스: 시간대 메뉴는 18~48 구간에 분산해 중반 선택지를 채운다.
export const TIME_SHOP_ENTRIES: TimeShopEntry[] = [
  {
    id: "time-shop-morning-mist",
    beverageId: "morning_mist_latte",
    timeOfDay: "morning",
    price: 120,
    requiredLevel: 18,
    missionTag: "morning-recipe",
  },
  {
    id: "time-shop-dawn-honey",
    beverageId: "dawn_honey_shot",
    timeOfDay: "morning",
    price: 172,
    requiredLevel: 36,
    missionTag: "morning-recipe",
  },
  {
    id: "time-shop-noon-citrus",
    beverageId: "noon_citrus_coffee",
    timeOfDay: "day",
    price: 132,
    requiredLevel: 22,
    missionTag: "day-recipe",
  },
  {
    id: "time-shop-traveler-blend",
    beverageId: "traveler_blend",
    timeOfDay: "day",
    price: 210,
    requiredLevel: 48,
    missionTag: "day-recipe",
  },
  {
    id: "time-shop-evening-caramel",
    beverageId: "evening_caramel_crema",
    timeOfDay: "evening",
    price: 145,
    requiredLevel: 26,
    missionTag: "evening-recipe",
  },
  {
    id: "time-shop-sunset-tea",
    beverageId: "sunset_tea_latte",
    timeOfDay: "evening",
    price: 196,
    requiredLevel: 44,
    missionTag: "evening-recipe",
  },
  {
    id: "time-shop-night-velvet",
    beverageId: "night_velvet_mocha",
    timeOfDay: "night",
    price: 160,
    requiredLevel: 31,
    missionTag: "night-recipe",
  },
  {
    id: "time-shop-midnight-tonic",
    beverageId: "midnight_tonic",
    timeOfDay: "night",
    price: 184,
    requiredLevel: 40,
    missionTag: "night-recipe",
  },
];

export function currentTimeOfDay(now = new Date()): TimeOfDayId {
  const hour = now.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

export function timeShopEntriesFor(timeOfDay: TimeOfDayId): TimeShopEntry[] {
  return TIME_SHOP_ENTRIES.filter((entry) => entry.timeOfDay === timeOfDay);
}

export function unlockedTimeShopEntriesForLevel(
  level: number,
  timeOfDay?: TimeOfDayId,
): TimeShopEntry[] {
  const pool = timeOfDay ? timeShopEntriesFor(timeOfDay) : TIME_SHOP_ENTRIES;
  return pool.filter((entry) => entry.requiredLevel <= level);
}

export function nextTimeShopEntryForLevel(
  level: number,
  timeOfDay?: TimeOfDayId,
): TimeShopEntry | null {
  const pool = timeOfDay ? timeShopEntriesFor(timeOfDay) : TIME_SHOP_ENTRIES;
  return (
    pool
      .filter((entry) => entry.requiredLevel > level)
      .sort((a, b) => a.requiredLevel - b.requiredLevel)[0] ?? null
  );
}

export function activeTimeShopEntry(
  beverageId: BeverageId,
  timeOfDay = currentTimeOfDay(),
): TimeShopEntry | null {
  return (
    TIME_SHOP_ENTRIES.find(
      (entry) => entry.beverageId === beverageId && entry.timeOfDay === timeOfDay,
    ) ?? null
  );
}
