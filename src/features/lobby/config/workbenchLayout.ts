export const WORKBENCH_LAYOUT_BASE = {
  width: 1080,
  height: 1920,
} as const;

export const WORKBENCH_CARD_LAYOUT_BASE = {
  width: 503,
  height: 445,
} as const;

export const WORKBENCH_BOTTOM_LAYOUT_BASE = {
  width: 1080,
  height: 337,
} as const;

export type WorkbenchLayoutItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  zIndex: number;
  opacity?: number;
};

export const WORKBENCH_LAYOUT_KEYS = [
  "headerHud",
  "backButton",
  "titleLogo",
  "currencyBar",
  "categoryTabs",
  "recipeFilterBar",
  "recipeGrid",
  "bottomPanel",
  "bottomSelectBg",
  "bottomDrink",
  "bottomInfo",
  "bottomControls",
  "cardStatusBadge",
  "cardNewBadge",
  "cardFavorite",
  "cardDrinkImage",
  "cardName",
  "cardType",
  "cardMaterials",
  "cardButton",
] as const;

export type WorkbenchLayoutKey = (typeof WORKBENCH_LAYOUT_KEYS)[number];
export type WorkbenchLayout = Record<WorkbenchLayoutKey, WorkbenchLayoutItem>;
export type WorkbenchLayoutPatch = Partial<
  Record<WorkbenchLayoutKey, Partial<WorkbenchLayoutItem>>
>;

export const WORKBENCH_LAYOUT_LABELS: Record<WorkbenchLayoutKey, string> = {
  headerHud: "Header HUD",
  backButton: "Back button",
  titleLogo: "Title logo",
  currencyBar: "Currency bar",
  categoryTabs: "Category tabs",
  recipeFilterBar: "Recipe filter bar",
  recipeGrid: "Recipe grid",
  bottomPanel: "Bottom panel",
  bottomSelectBg: "Bottom select bg",
  bottomDrink: "Bottom drink",
  bottomInfo: "Bottom info",
  bottomControls: "Bottom controls",
  cardStatusBadge: "Card status badge",
  cardNewBadge: "Card NEW badge",
  cardFavorite: "Card favorite",
  cardDrinkImage: "Card drink image",
  cardName: "Card name",
  cardType: "Card type",
  cardMaterials: "Card materials",
  cardButton: "Card button",
};

/**
 * 후속 에셋 매핑 키:
 * - topBar: 헤더 배경/타이틀 리본/뒤로가기 버튼 베이스
 * - currencyBar: 코인/원두/하트 아이콘 및 캡슐 배경
 * - categoryTabs: 탭 배경/활성 탭 프레임/카테고리 아이콘
 * - recipeFilterBar: 정렬/필터/리스트 버튼 베이스
 * - recipeGrid: 카드 프레임/상태 배지/썸네일 이미지
 * - bottomPanel: 하단 선택 패널 배경/캐릭터 장식
 * - quantityStepper: +/- 스텝퍼 프레임
 * - craftCta: 메인 제작 버튼 9-slice 또는 단일 PNG
 */
export const workbenchLayout: WorkbenchLayout = {
  headerHud: { x: 0, y: 0, width: 1080, height: 415, scale: 1, zIndex: 10 },
  backButton: { x: 49, y: 50, width: 113, height: 113, scale: 1, zIndex: 25 },
  titleLogo: { x: 162, y: 60, width: 454, height: 127, scale: 1, zIndex: 25 },
  currencyBar: { x: 636, y: 66, width: 396, height: 54, scale: 1, zIndex: 30 },
  categoryTabs: { x: 43, y: 257, width: 994, height: 139, scale: 1, zIndex: 25 },
  recipeFilterBar: { x: 43, y: 405, width: 994, height: 81, scale: 1, zIndex: 25 },
  recipeGrid: { x: 43, y: 503, width: 994, height: 1053, scale: 1, zIndex: 20 },
  bottomPanel: { x: 0, y: 1583, width: 1080, height: 337, scale: 1, zIndex: 35 },
  bottomSelectBg: { x: 18, y: 10, width: 1044, height: 314, scale: 1, zIndex: 1 },
  bottomDrink: { x: 54, y: 72, width: 230, height: 220, scale: 1, zIndex: 5 },
  bottomInfo: { x: 300, y: 68, width: 352, height: 210, scale: 1, zIndex: 5 },
  bottomControls: { x: 690, y: 74, width: 332, height: 220, scale: 1, zIndex: 5 },
  cardStatusBadge: { x: 15, y: 346, width: 158, height: 43, scale: 1, zIndex: 10 },
  cardNewBadge: { x: 14, y: 14, width: 94, height: 49, scale: 1, zIndex: 20 },
  cardFavorite: { x: 446, y: 30, width: 42, height: 42, scale: 1, zIndex: 30 },
  cardDrinkImage: { x: 20, y: 84, width: 206, height: 226, scale: 1, zIndex: 5 },
  cardName: { x: 236, y: 72, width: 226, height: 42, scale: 1, zIndex: 8 },
  cardType: { x: 304, y: 120, width: 88, height: 31, scale: 1, zIndex: 8 },
  cardMaterials: { x: 244, y: 178, width: 236, height: 112, scale: 1, zIndex: 8 },
  cardButton: { x: 248, y: 344, width: 235, height: 69, scale: 1, zIndex: 12 },
};

function numericOrFallback(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function mergeWorkbenchLayoutPatch(
  base: WorkbenchLayout,
  patch: unknown,
): WorkbenchLayout {
  if (!patch || typeof patch !== "object") return base;

  return WORKBENCH_LAYOUT_KEYS.reduce((next, key) => {
    const patchItem = (patch as WorkbenchLayoutPatch)[key];
    if (!patchItem || typeof patchItem !== "object") {
      next[key] = base[key];
      return next;
    }

    next[key] = {
      x: numericOrFallback(patchItem.x, base[key].x),
      y: numericOrFallback(patchItem.y, base[key].y),
      width: numericOrFallback(patchItem.width, base[key].width),
      height: numericOrFallback(patchItem.height, base[key].height),
      scale: numericOrFallback(patchItem.scale, base[key].scale),
      zIndex: numericOrFallback(patchItem.zIndex, base[key].zIndex),
      opacity:
        patchItem.opacity == null
          ? base[key].opacity
          : numericOrFallback(patchItem.opacity, base[key].opacity ?? 1),
    };
    return next;
  }, {} as WorkbenchLayout);
}
