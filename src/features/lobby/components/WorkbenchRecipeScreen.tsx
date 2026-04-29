"use client";

import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { cn } from "@/lib/utils";
import {
  WORKBENCH_LAYOUT_BASE,
  WORKBENCH_LAYOUT_KEYS,
  workbenchLayout,
  mergeWorkbenchLayoutPatch,
  type WorkbenchLayout,
  type WorkbenchLayoutItem,
  type WorkbenchLayoutKey,
} from "@/features/lobby/config/workbenchLayout";
import { WorkbenchTuningPanel } from "./WorkbenchTuningPanel";

type RecipeCategory = "all" | "base" | "milk" | "sweet" | "dessert" | "tea";

type MockRecipe = {
  id: string;
  name: string;
  category: RecipeCategory;
  tag: string;
  stockReady: boolean;
  materials: Array<{ name: string; have: number; need: number }>;
};

const WORKBENCH_TUNING_LAYOUT_STORAGE_KEY =
  "coffee2048_workbench_tuning_layout" as const;

const mockRecipes: MockRecipe[] = [
  {
    id: "americano",
    name: "아메리카노",
    category: "base",
    tag: "기본",
    stockReady: true,
    materials: [
      { name: "원두", have: 12, need: 1 },
      { name: "물", have: 24, need: 1 },
    ],
  },
  {
    id: "latte",
    name: "카페 라떼",
    category: "milk",
    tag: "우유",
    stockReady: true,
    materials: [
      { name: "원두", have: 12, need: 1 },
      { name: "우유", have: 18, need: 1 },
    ],
  },
  {
    id: "vanilla-latte",
    name: "바닐라 라떼",
    category: "sweet",
    tag: "달콤",
    stockReady: true,
    materials: [
      { name: "원두", have: 12, need: 1 },
      { name: "우유", have: 18, need: 1 },
      { name: "시럽", have: 6, need: 1 },
    ],
  },
  {
    id: "cafe-mocha",
    name: "카페 모카",
    category: "sweet",
    tag: "달콤",
    stockReady: false,
    materials: [
      { name: "원두", have: 12, need: 1 },
      { name: "우유", have: 18, need: 1 },
      { name: "초콜릿", have: 4, need: 1 },
    ],
  },
  {
    id: "matcha-latte",
    name: "말차 라떼",
    category: "tea",
    tag: "티&청량",
    stockReady: false,
    materials: [
      { name: "말차", have: 5, need: 1 },
      { name: "우유", have: 18, need: 1 },
      { name: "물", have: 24, need: 1 },
    ],
  },
  {
    id: "nutty-cloud",
    name: "너티 클라우드",
    category: "dessert",
    tag: "스페셜",
    stockReady: false,
    materials: [
      { name: "원두", have: 12, need: 1 },
      { name: "우유", have: 18, need: 1 },
      { name: "헤이즐넛", have: 3, need: 1 },
    ],
  },
];

const categories: Array<{ key: RecipeCategory; label: string }> = [
  { key: "all", label: "전체" },
  { key: "base", label: "기본" },
  { key: "milk", label: "우유" },
  { key: "sweet", label: "달콤" },
  { key: "dessert", label: "디저트" },
  { key: "tea", label: "티&청량" },
];

function isLocalhostDevHost() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost")
  );
}

function parseStoredLayout(): WorkbenchLayout {
  if (typeof window === "undefined") return workbenchLayout;
  try {
    const stored = window.localStorage.getItem(WORKBENCH_TUNING_LAYOUT_STORAGE_KEY);
    return stored
      ? mergeWorkbenchLayoutPatch(workbenchLayout, JSON.parse(stored))
      : workbenchLayout;
  } catch {
    return workbenchLayout;
  }
}

function persistTunedLayout(layout: WorkbenchLayout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      WORKBENCH_TUNING_LAYOUT_STORAGE_KEY,
      JSON.stringify(layout),
    );
  } catch {
    // dev-only tuning
  }
}

function layoutItemStyle(item: WorkbenchLayoutItem): CSSProperties {
  return {
    left: `${(item.x / WORKBENCH_LAYOUT_BASE.width) * 100}%`,
    top: `${(item.y / WORKBENCH_LAYOUT_BASE.height) * 100}%`,
    width: `${(item.width / WORKBENCH_LAYOUT_BASE.width) * 100}%`,
    height: `${(item.height / WORKBENCH_LAYOUT_BASE.height) * 100}%`,
    transform: `scale(${item.scale})`,
    transformOrigin: "top left",
    zIndex: item.zIndex,
    opacity: item.opacity ?? 1,
  };
}

export function WorkbenchRecipeScreen() {
  useResetDocumentScrollOnMount();
  const reduceMotion = !!useReducedMotion();
  const player = useAppStore((s) => s.playerResources);

  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>("all");
  const [selectedRecipeId, setSelectedRecipeId] = useState(mockRecipes[0].id);
  const [craftCount, setCraftCount] = useState(1);

  const isNonProductionBuild = process.env.NODE_ENV !== "production";
  const [canUseWorkbenchDevTools, setCanUseWorkbenchDevTools] =
    useState(isNonProductionBuild);
  const [showTuningPanel, setShowTuningPanel] = useState(isNonProductionBuild);
  const [tunedLayout, setTunedLayout] = useState<WorkbenchLayout>(workbenchLayout);
  const [selectedLayoutKey, setSelectedLayoutKey] =
    useState<WorkbenchLayoutKey>("topBar");
  const [tuningPanelClientReady, setTuningPanelClientReady] = useState(false);

  useEffect(() => {
    setTuningPanelClientReady(true);
  }, []);

  useEffect(() => {
    if (isNonProductionBuild) return;
    setCanUseWorkbenchDevTools(isLocalhostDevHost());
  }, [isNonProductionBuild]);

  useEffect(() => {
    if (!canUseWorkbenchDevTools) return;
    setTunedLayout(parseStoredLayout());
  }, [canUseWorkbenchDevTools]);

  const changeLayoutItem = useCallback(
    (key: WorkbenchLayoutKey, patch: Partial<WorkbenchLayoutItem>) => {
      if (!canUseWorkbenchDevTools) return;
      setTunedLayout((current) => {
        const next = {
          ...current,
          [key]: { ...current[key], ...patch },
        };
        persistTunedLayout(next);
        return next;
      });
    },
    [canUseWorkbenchDevTools],
  );

  const resetTunedLayout = useCallback(() => {
    setTunedLayout(workbenchLayout);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(WORKBENCH_TUNING_LAYOUT_STORAGE_KEY);
    } catch {
      // dev-only tuning
    }
  }, []);

  useEffect(() => {
    if (!canUseWorkbenchDevTools) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      const direction =
        event.key === "ArrowLeft"
          ? { x: -1, y: 0 }
          : event.key === "ArrowRight"
            ? { x: 1, y: 0 }
            : event.key === "ArrowUp"
              ? { x: 0, y: -1 }
              : event.key === "ArrowDown"
                ? { x: 0, y: 1 }
                : null;
      if (!direction) return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "select" ||
        tagName === "textarea" ||
        target?.isContentEditable
      ) {
        return;
      }
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      changeLayoutItem(selectedLayoutKey, {
        x: tunedLayout[selectedLayoutKey].x + direction.x * step,
        y: tunedLayout[selectedLayoutKey].y + direction.y * step,
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canUseWorkbenchDevTools, changeLayoutItem, selectedLayoutKey, tunedLayout]);

  const visibleRecipes = useMemo(
    () =>
      mockRecipes.filter(
        (recipe) =>
          selectedCategory === "all" || recipe.category === selectedCategory,
      ),
    [selectedCategory],
  );

  useEffect(() => {
    if (!visibleRecipes.some((recipe) => recipe.id === selectedRecipeId)) {
      setSelectedRecipeId(visibleRecipes[0]?.id ?? mockRecipes[0].id);
    }
  }, [selectedRecipeId, visibleRecipes]);

  const selectedRecipe =
    mockRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? mockRecipes[0];

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#d9efff]">
      <main className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-gradient-to-b from-[#f4efe7] to-[#efe5d5]">
        <WorkbenchLayoutSlot item={tunedLayout.topBar}>
          <div className="h-full rounded-[1.5rem] border border-white/45 bg-[#f7f2e8]/92 p-3 shadow-[0_12px_28px_rgb(62_47_35_/_0.14)] ring-1 ring-coffee-600/10">
            <div className="flex items-start justify-between gap-3">
              <Link
                href="/lobby"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coffee-900/90 text-2xl font-bold text-cream-50 ring-1 ring-black/10"
              >
                ←
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coffee-600/60">
                  Workbench
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-coffee-900">
                  음료 제작대
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-coffee-700/80">
                  오늘의 레시피를 골라보세요
                </p>
              </div>
            </div>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.currencyBar}>
          <div className="grid h-full grid-cols-3 gap-1.5">
            <StatCapsule label="코인" value={player.coins} />
            <StatCapsule label="원두" value={player.beans} />
            <StatCapsule label="하트" value={player.hearts} />
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.categoryTabs}>
          <div className="h-full rounded-[1.3rem] border border-white/45 bg-cream-50/92 p-2 shadow-card ring-1 ring-coffee-600/10">
            <div className="grid h-full grid-cols-6 gap-1">
              {categories.map((category) => {
                const active = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    className={cn(
                      "rounded-xl border text-[11px] font-semibold transition-colors",
                      active
                        ? "border-[#84aee8]/45 bg-[#dce8f8] text-coffee-900"
                        : "border-coffee-600/10 bg-cream-100/80 text-coffee-700/80",
                    )}
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.recipeFilterBar}>
          <div className="flex h-full items-center justify-between rounded-2xl border border-white/40 bg-cream-50/95 px-3 shadow-sm ring-1 ring-coffee-600/10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dbe8f9] px-2.5 py-1 text-[11px] font-semibold text-coffee-800">
              제작 가능
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-coffee-700">
              기본순
            </div>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.recipeGrid}>
          <div className="h-full overflow-y-auto rounded-[1.45rem] border border-white/45 bg-cream-50/88 p-2.5 ring-1 ring-coffee-600/10">
            <div className="grid grid-cols-2 gap-2.5 pb-2">
              {visibleRecipes.map((recipe) => {
                const selected = recipe.id === selectedRecipeId;
                return (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={cn(
                      "rounded-2xl border p-2 text-left ring-1 transition-[transform_box-shadow]",
                      selected
                        ? "border-[#84aee8]/45 bg-[#f9fcff] ring-[#84aee8]/35 shadow-[0_8px_20px_rgb(78_56_40_/_0.12)]"
                        : "border-coffee-600/10 bg-cream-50/92 ring-coffee-600/10",
                    )}
                  >
                    <div className="h-24 rounded-xl bg-gradient-to-b from-[#f4ece0] to-[#e8dcc8]" />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-coffee-900">
                        {recipe.name}
                      </h3>
                      <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-semibold text-coffee-700">
                        {recipe.tag}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-[11px] text-coffee-700/80">
                      {recipe.materials.slice(0, 2).map((material) => (
                        <p key={material.name}>
                          {material.name} {material.have}/{material.need}
                        </p>
                      ))}
                    </div>
                    <div
                      className={cn(
                        "mt-2 rounded-xl py-1.5 text-center text-xs font-semibold ring-1",
                        recipe.stockReady
                          ? "bg-[#dce8f8] text-coffee-900 ring-[#84aee8]/35"
                          : "bg-[#f6ede3] text-coffee-700 ring-accent-soft/20",
                      )}
                    >
                      제작하기
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.bottomPanel}>
          <div className="h-full rounded-t-[1.5rem] border border-white/40 bg-[#f5eadb]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3 ring-1 ring-coffee-600/10">
            <p className="text-[11px] font-semibold text-coffee-600/70">선택 레시피</p>
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold tracking-tight text-coffee-900">
                  {selectedRecipe.name}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
                  부드러운 밸런스를 가진 시그니처 레시피입니다.
                </p>
              </div>
              <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-semibold text-coffee-700">
                {selectedRecipe.tag}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px]">
              {selectedRecipe.materials.map((material) => (
                <div
                  key={material.name}
                  className="rounded-xl bg-cream-50/85 px-2 py-1.5 text-center ring-1 ring-coffee-600/10"
                >
                  <p className="font-semibold text-coffee-700">{material.name}</p>
                  <p className="mt-0.5 font-bold tabular-nums text-coffee-900">
                    {material.have}/{material.need}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.quantityStepper}>
          <div className="flex h-full items-center justify-between rounded-2xl bg-cream-50/95 px-3 ring-1 ring-coffee-600/12">
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-cream-200 text-xl font-bold text-coffee-900 ring-1 ring-coffee-600/15"
              onClick={() => setCraftCount((v) => Math.max(1, v - 1))}
            >
              −
            </button>
            <span className="text-lg font-bold tabular-nums text-coffee-900">
              {craftCount}
            </span>
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-cream-200 text-xl font-bold text-coffee-900 ring-1 ring-coffee-600/15"
              onClick={() => setCraftCount((v) => Math.min(99, v + 1))}
            >
              +
            </button>
          </div>
        </WorkbenchLayoutSlot>

        <WorkbenchLayoutSlot item={tunedLayout.craftCta}>
          <button
            type="button"
            className="h-full w-full rounded-2xl bg-gradient-to-b from-[#d7a86a] to-[#b98958] text-lg font-bold text-cream-50 shadow-lift ring-1 ring-[#d7b47a]/60 transition-transform active:scale-[0.98]"
          >
            제작
          </button>
        </WorkbenchLayoutSlot>

        {canUseWorkbenchDevTools ? (
          <button
            data-visual-test-hidden="true"
            type="button"
            onClick={() => setShowTuningPanel((v) => !v)}
            className="absolute left-3 z-[120] rounded-full bg-coffee-950/70 px-3 py-1.5 text-[11px] font-semibold text-cream-50 shadow-md backdrop-blur"
            style={{ top: "calc(env(safe-area-inset-top) + 5rem)" }}
          >
            {showTuningPanel ? "Tune Off" : "Tune On"}
          </button>
        ) : null}
      </main>

      {canUseWorkbenchDevTools && showTuningPanel && tuningPanelClientReady ? (
        <WorkbenchTuningPanel
          layout={tunedLayout}
          selectedKey={selectedLayoutKey}
          onSelectedKeyChange={setSelectedLayoutKey}
          onLayoutItemChange={changeLayoutItem}
          onResetLayout={resetTunedLayout}
        />
      ) : null}

      <p
        data-visual-test-hidden="true"
        className={cn(
          "pointer-events-none fixed bottom-2 left-1/2 z-[140] -translate-x-1/2 rounded-full bg-coffee-900/45 px-2 py-0.5 text-[10px] font-medium text-cream-50/80 backdrop-blur-sm",
          reduceMotion && "opacity-90",
        )}
      >
        Workbench base {WORKBENCH_LAYOUT_BASE.width}×{WORKBENCH_LAYOUT_BASE.height}
      </p>
    </div>
  );
}

function StatCapsule({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-flex items-center justify-between rounded-full bg-cream-50/95 px-3 py-1.5 text-xs font-semibold text-coffee-900 ring-1 ring-coffee-600/15">
      <span className="text-coffee-700/80">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function WorkbenchLayoutSlot({
  item,
  className,
  children,
}: {
  item: WorkbenchLayoutItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute", className)} style={layoutItemStyle(item)}>
      {children}
    </div>
  );
}
