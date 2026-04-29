export const WORKBENCH_LAYOUT_BASE = {
  width: 942,
  height: 1672,
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
  "topBar",
  "currencyBar",
  "categoryTabs",
  "recipeFilterBar",
  "recipeGrid",
  "bottomPanel",
  "quantityStepper",
  "craftCta",
] as const;

export type WorkbenchLayoutKey = (typeof WORKBENCH_LAYOUT_KEYS)[number];
export type WorkbenchLayout = Record<WorkbenchLayoutKey, WorkbenchLayoutItem>;
export type WorkbenchLayoutPatch = Partial<
  Record<WorkbenchLayoutKey, Partial<WorkbenchLayoutItem>>
>;

export const WORKBENCH_LAYOUT_LABELS: Record<WorkbenchLayoutKey, string> = {
  topBar: "Top bar",
  currencyBar: "Currency bar",
  categoryTabs: "Category tabs",
  recipeFilterBar: "Recipe filter bar",
  recipeGrid: "Recipe grid",
  bottomPanel: "Bottom panel",
  quantityStepper: "Quantity stepper",
  craftCta: "Craft CTA",
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
  topBar: { x: 24, y: 24, width: 894, height: 206, scale: 1, zIndex: 20 },
  currencyBar: { x: 430, y: 28, width: 480, height: 88, scale: 1, zIndex: 30 },
  categoryTabs: { x: 26, y: 240, width: 890, height: 160, scale: 1, zIndex: 25 },
  recipeFilterBar: { x: 26, y: 402, width: 890, height: 70, scale: 1, zIndex: 25 },
  recipeGrid: { x: 26, y: 480, width: 890, height: 910, scale: 1, zIndex: 20 },
  bottomPanel: { x: 0, y: 1365, width: 942, height: 307, scale: 1, zIndex: 35 },
  quantityStepper: { x: 526, y: 1452, width: 230, height: 74, scale: 1, zIndex: 40 },
  craftCta: { x: 740, y: 1450, width: 178, height: 80, scale: 1, zIndex: 40 },
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
