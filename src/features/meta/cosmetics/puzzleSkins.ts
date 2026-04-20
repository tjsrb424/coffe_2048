import { cn } from "@/lib/utils";
import type {
  PuzzleSkinDefinition,
  PuzzleSkinId,
  PuzzleSkinKind,
} from "@/features/meta/types/gameState";

export const DEFAULT_PUZZLE_BACKGROUND_SKIN_ID = "cafe_default_bg" as const;
export const DEFAULT_PUZZLE_BLOCK_SKIN_ID = "cream_default_blocks" as const;

export const PUZZLE_SKINS: PuzzleSkinDefinition[] = [
  {
    id: DEFAULT_PUZZLE_BACKGROUND_SKIN_ID,
    kind: "background",
    title: "기본 카페 보드",
    description: "따뜻한 크림 톤의 기본 보드",
    coinCost: 0,
    requiredLevel: 1,
  },
  {
    id: "warm_wood_bg",
    kind: "background",
    title: "웜 우드 보드",
    description: "나무 카운터 위에 타일을 올린 느낌",
    coinCost: 180,
    requiredLevel: 8,
  },
  {
    id: "night_counter_bg",
    kind: "background",
    title: "나이트 카운터",
    description: "늦은 밤 카페의 차분한 보드",
    coinCost: 320,
    requiredLevel: 18,
  },
  {
    id: DEFAULT_PUZZLE_BLOCK_SKIN_ID,
    kind: "blocks",
    title: "크림 타일",
    description: "기본 커피 크림 타일",
    coinCost: 0,
    requiredLevel: 1,
  },
  {
    id: "espresso_blocks",
    kind: "blocks",
    title: "에스프레소 타일",
    description: "진한 로스팅 색감의 블록 스킨",
    coinCost: 220,
    requiredLevel: 10,
  },
  {
    id: "mint_ceramic_blocks",
    kind: "blocks",
    title: "민트 세라믹 타일",
    description: "밝은 민트 포인트가 있는 블록 스킨",
    coinCost: 360,
    requiredLevel: 22,
  },
];

export function puzzleSkinDefinition(id: PuzzleSkinId): PuzzleSkinDefinition {
  return PUZZLE_SKINS.find((skin) => skin.id === id) ?? PUZZLE_SKINS[0]!;
}

export function puzzleSkinsByKind(kind: PuzzleSkinKind): PuzzleSkinDefinition[] {
  return PUZZLE_SKINS.filter((skin) => skin.kind === kind);
}

export function normalizeOwnedPuzzleSkinIds(
  input: PuzzleSkinId[] | undefined | null,
): PuzzleSkinId[] {
  const known = new Set(PUZZLE_SKINS.map((skin) => skin.id));
  return Array.from(
    new Set([
      DEFAULT_PUZZLE_BACKGROUND_SKIN_ID,
      DEFAULT_PUZZLE_BLOCK_SKIN_ID,
      ...(input ?? []),
    ]),
  ).filter((id): id is PuzzleSkinId => known.has(id));
}

export function normalizeEquippedPuzzleSkinId(
  input: string | undefined | null,
  kind: PuzzleSkinKind,
  ownedIds: PuzzleSkinId[],
): PuzzleSkinId {
  const fallback =
    kind === "background"
      ? DEFAULT_PUZZLE_BACKGROUND_SKIN_ID
      : DEFAULT_PUZZLE_BLOCK_SKIN_ID;
  const definition = PUZZLE_SKINS.find(
    (skin) => skin.id === input && skin.kind === kind,
  );
  if (!definition || !ownedIds.includes(definition.id)) return fallback;
  return definition.id;
}

export function puzzleBoardClassForSkin(id: PuzzleSkinId): string {
  switch (id) {
    case "warm_wood_bg":
      return "bg-gradient-to-br from-[#7a4a2c]/18 via-[#d2a56f]/20 to-[#f7ead3]/75";
    case "night_counter_bg":
      return "bg-gradient-to-br from-[#1f1815]/25 via-[#5a3a2c]/22 to-[#d7b88e]/42";
    default:
      return "bg-coffee-900/10";
  }
}

export function puzzleCellClassForSkin(id: PuzzleSkinId): string {
  switch (id) {
    case "warm_wood_bg":
      return "bg-[#f0d9bc]/80";
    case "night_counter_bg":
      return "bg-[#fff4df]/58";
    default:
      return "bg-cream-200/75";
  }
}

export function puzzleTileClassForSkin(id: PuzzleSkinId, value: number): string {
  if (id === "espresso_blocks") {
    if (value <= 4) return cn("bg-[#d8b18a] text-coffee-900 ring-1 ring-coffee-700/12");
    if (value <= 64) return cn("bg-[#9f6540] text-cream-50 ring-1 ring-white/15");
    return cn("bg-gradient-to-br from-[#5a3224] to-[#251613] text-cream-50 ring-1 ring-accent-soft/25");
  }
  if (id === "mint_ceramic_blocks") {
    if (value <= 4) return cn("bg-[#dbe9dc] text-coffee-900 ring-1 ring-accent-mint/20");
    if (value <= 64) return cn("bg-[#a8cdb8] text-coffee-950 ring-1 ring-accent-mint/30");
    return cn("bg-gradient-to-br from-[#74aa94] to-[#42695d] text-cream-50 ring-1 ring-white/25");
  }
  return "";
}
