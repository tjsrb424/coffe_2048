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

export const TIME_SHOP_ENTRIES: TimeShopEntry[] = [
  {
    id: "time-shop-morning-mist",
    beverageId: "morning_mist_latte",
    timeOfDay: "morning",
    price: 160,
    requiredLevel: 61,
    missionTag: "morning-recipe",
  },
  {
    id: "time-shop-dawn-honey",
    beverageId: "dawn_honey_shot",
    timeOfDay: "morning",
    price: 180,
    requiredLevel: 67,
    missionTag: "morning-recipe",
  },
  {
    id: "time-shop-noon-citrus",
    beverageId: "noon_citrus_coffee",
    timeOfDay: "day",
    price: 170,
    requiredLevel: 62,
    missionTag: "day-recipe",
  },
  {
    id: "time-shop-traveler-blend",
    beverageId: "traveler_blend",
    timeOfDay: "day",
    price: 210,
    requiredLevel: 70,
    missionTag: "day-recipe",
  },
  {
    id: "time-shop-evening-caramel",
    beverageId: "evening_caramel_crema",
    timeOfDay: "evening",
    price: 220,
    requiredLevel: 64,
    missionTag: "evening-recipe",
  },
  {
    id: "time-shop-sunset-tea",
    beverageId: "sunset_tea_latte",
    timeOfDay: "evening",
    price: 240,
    requiredLevel: 69,
    missionTag: "evening-recipe",
  },
  {
    id: "time-shop-night-velvet",
    beverageId: "night_velvet_mocha",
    timeOfDay: "night",
    price: 250,
    requiredLevel: 65,
    missionTag: "night-recipe",
  },
  {
    id: "time-shop-midnight-tonic",
    beverageId: "midnight_tonic",
    timeOfDay: "night",
    price: 260,
    requiredLevel: 68,
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
