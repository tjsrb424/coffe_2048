"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BeanIcon } from "@/components/ui/BeanIcon";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { EspressoShotIcon } from "@/components/ui/EspressoShotIcon";
import { HeartIcon } from "@/components/ui/HeartIcon";
import {
  BEVERAGE_CATEGORIES,
  beverageForRecipeId,
} from "@/features/meta/content/beverages";
import { validateCraftDrink } from "@/features/meta/economy/crafting";
import { materialDefinition } from "@/features/meta/economy/materials";
import { recipeDefinition } from "@/features/meta/economy/recipes";
import {
  isOwnedRecipe,
  isUnlockedRecipe,
} from "@/features/meta/economy/recipeOwnership";
import {
  canPurchaseRecipe,
  recipePurchaseCost,
} from "@/features/meta/progression/levelBands";
import { normalizeAccountLevelState } from "@/features/meta/progression/missionEngine";
import type {
  DrinkMenuId,
  MaterialId,
  RecipeDefinition,
} from "@/features/meta/types/gameState";
import {
  drinkStationAssets,
  type DrinkStationCategoryKey,
} from "@/features/lobby/config/drinkStationAssets";
import {
  WORKBENCH_BOTTOM_LAYOUT_BASE,
  WORKBENCH_CARD_LAYOUT_BASE,
  WORKBENCH_LAYOUT_BASE,
  mergeWorkbenchLayoutPatch,
  workbenchLayout,
  type WorkbenchLayout,
  type WorkbenchLayoutItem,
  type WorkbenchLayoutKey,
} from "@/features/lobby/config/workbenchLayout";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { WorkbenchTuningPanel } from "./WorkbenchTuningPanel";

const SAMPLE_DRINK_IDS = [
  "americano",
  "latte",
  "vanilla_latte",
  "mocha",
  "matcha_latte",
  "nutty_cloud",
] as const satisfies readonly DrinkMenuId[];

type DrinkStationDrinkId = (typeof SAMPLE_DRINK_IDS)[number];
type DrinkCategory = Exclude<DrinkStationCategoryKey, "all">;

type IngredientRow = {
  key: string;
  label: string;
  have: number;
  need: number;
  kind: "shot" | "bean" | "material";
};

type DrinkCardModel = {
  id: DrinkStationDrinkId;
  recipe: RecipeDefinition;
  category: DrinkCategory;
  categoryLabel: string;
  description: string;
  imageSrc: string;
  ingredients: IngredientRow[];
  unlocked: boolean;
  owned: boolean;
  canReceiveRecipe: boolean;
  canCraft: boolean;
  maxCraft: number;
  isNew: boolean;
  isFavorite: boolean;
  stock: number;
  statusLabel: string;
  actionLabel: string;
};

const CATEGORY_TABS: Array<{ key: DrinkStationCategoryKey; label: string }> = [
  { key: "all", label: "전체" },
  { key: "basic", label: "기본" },
  { key: "milk", label: "우유" },
  { key: "sweet", label: "달콤" },
  { key: "dessert", label: "디저트" },
  { key: "tea", label: "티&청량" },
  { key: "special", label: "스페셜" },
];

const DRINK_CATEGORY: Record<DrinkStationDrinkId, DrinkCategory> = {
  americano: "basic",
  latte: "milk",
  vanilla_latte: "sweet",
  mocha: "sweet",
  matcha_latte: "tea",
  nutty_cloud: "special",
};

const CATEGORY_LABEL: Record<DrinkCategory, string> = {
  basic: "기본",
  milk: "우유",
  sweet: "달콤",
  dessert: "디저트",
  tea: "티&청량",
  special: "스페셜",
};

const DRINK_IMAGE_SRC: Record<DrinkStationDrinkId, string | null> = {
  americano: drinkStationAssets.drinks.americano,
  latte: drinkStationAssets.drinks.cafeLatte,
  vanilla_latte: drinkStationAssets.drinks.vanillaLatte,
  mocha: drinkStationAssets.drinks.cafeMocha,
  matcha_latte: drinkStationAssets.drinks.matchaLatte,
  nutty_cloud: drinkStationAssets.drinks.nuttyCloud,
};

const WORKBENCH_TUNING_LAYOUT_STORAGE_KEY =
  "coffee2048_workbench_tuning_layout_v2" as const;

function recipeIngredientRows(input: {
  recipe: RecipeDefinition;
  espressoShots: number;
  beans: number;
  materialInventory: Partial<Record<MaterialId, number>>;
  quantity?: number;
}): IngredientRow[] {
  const quantity = input.quantity ?? 1;
  const rows: IngredientRow[] = [];

  if (input.recipe.shots > 0) {
    rows.push({
      key: "shot",
      label: "샷",
      have: input.espressoShots,
      need: input.recipe.shots * quantity,
      kind: "shot",
    });
  }

  if (input.recipe.beans > 0) {
    rows.push({
      key: "bean",
      label: "원두",
      have: input.beans,
      need: input.recipe.beans * quantity,
      kind: "bean",
    });
  }

  for (const [rawId, amount] of Object.entries(input.recipe.materials)) {
    const id = rawId as MaterialId;
    const need = amount ?? 0;
    if (need <= 0) continue;
    rows.push({
      key: id,
      label: materialDefinition(id).name,
      have: input.materialInventory[id] ?? 0,
      need: need * quantity,
      kind: "material",
    });
  }

  return rows;
}

function maxCraftQuantity(input: {
  recipe: RecipeDefinition;
  espressoShots: number;
  beans: number;
  materialInventory: Partial<Record<MaterialId, number>>;
  unlocked: boolean;
  owned: boolean;
}): number {
  if (!input.unlocked || !input.owned) return 0;
  const limits: number[] = [];

  if (input.recipe.shots > 0) {
    limits.push(Math.floor(input.espressoShots / input.recipe.shots));
  }
  if (input.recipe.beans > 0) {
    limits.push(Math.floor(input.beans / input.recipe.beans));
  }
  for (const [rawId, amount] of Object.entries(input.recipe.materials)) {
    const need = amount ?? 0;
    if (need <= 0) continue;
    const id = rawId as MaterialId;
    limits.push(Math.floor((input.materialInventory[id] ?? 0) / need));
  }

  if (limits.length === 0) return 99;
  return Math.max(0, Math.min(99, ...limits));
}

function statusLabelFor(input: {
  unlocked: boolean;
  owned: boolean;
  canReceiveRecipe: boolean;
  canCraft: boolean;
  maxCraft: number;
  recipe: RecipeDefinition;
}): string {
  if (!input.unlocked) return `Lv.${input.recipe.levelRequired}`;
  if (!input.owned) {
    return input.canReceiveRecipe ? "노트 받기" : "노트 필요";
  }
  if (input.canCraft) return "제작 가능";
  return input.maxCraft <= 0 ? "재료 부족" : "수량 부족";
}

function actionLabelFor(input: {
  owned: boolean;
  canReceiveRecipe: boolean;
  canCraft: boolean;
  recipe: RecipeDefinition;
}): string {
  if (!input.owned) {
    if (input.canReceiveRecipe) {
      const cost = recipePurchaseCost(input.recipe.id);
      return cost > 0 ? `${cost} 코인` : "노트 받기";
    }
    return `Lv.${input.recipe.levelRequired}`;
  }
  return input.canCraft ? "제작하기" : "재료 부족";
}

function categoryTitleFor(id: DrinkStationDrinkId): string {
  const category = DRINK_CATEGORY[id];
  if (category === "special") return "스페셜";
  return CATEGORY_LABEL[category] ?? BEVERAGE_CATEGORIES.espressoBasic.shortTitle;
}

function drinkImageFor(id: DrinkStationDrinkId): string {
  return DRINK_IMAGE_SRC[id] ?? drinkStationAssets.card.drinkFallback;
}

function visibleByCategory(
  card: DrinkCardModel,
  selectedCategory: DrinkStationCategoryKey,
): boolean {
  return selectedCategory === "all" || card.category === selectedCategory;
}

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

function layoutItemStyle(
  item: WorkbenchLayoutItem,
  base: { width: number; height: number },
): CSSProperties {
  return {
    left: `${(item.x / base.width) * 100}%`,
    top: `${(item.y / base.height) * 100}%`,
    width: `${(item.width / base.width) * 100}%`,
    height: `${(item.height / base.height) * 100}%`,
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
  const cafe = useAppStore((s) => s.cafeState);
  const accountState = useAppStore((s) => s.accountLevel);
  const beverageCodex = useAppStore((s) => s.beverageCodex);
  const craftDrink = useAppStore((s) => s.craftDrink);
  const purchaseRecipe = useAppStore((s) => s.purchaseRecipe);

  const [selectedCategory, setSelectedCategory] =
    useState<DrinkStationCategoryKey>("all");
  const [selectedDrinkId, setSelectedDrinkId] =
    useState<DrinkStationDrinkId>("americano");
  const [craftQuantity, setCraftQuantity] = useState(1);
  const [showCraftableOnly, setShowCraftableOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  // TODO: save에 즐겨찾기 필드가 생기면 이 로컬 상태를 영속 데이터로 교체한다.
  const [favoriteDrinkIds, setFavoriteDrinkIds] = useState<
    DrinkStationDrinkId[]
  >([]);
  const isNonProductionBuild = process.env.NODE_ENV !== "production";
  const [canUseWorkbenchDevTools, setCanUseWorkbenchDevTools] =
    useState(isNonProductionBuild);
  const [showTuningPanel, setShowTuningPanel] = useState(false);
  const [tunedLayout, setTunedLayout] =
    useState<WorkbenchLayout>(workbenchLayout);
  const [selectedLayoutKey, setSelectedLayoutKey] =
    useState<WorkbenchLayoutKey>("titleLogo");
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

  const account = useMemo(
    () => normalizeAccountLevelState(accountState),
    [accountState],
  );

  const drinkCards = useMemo<DrinkCardModel[]>(() => {
    return SAMPLE_DRINK_IDS.map((id) => {
      const recipe = recipeDefinition(id);
      const beverage = beverageForRecipeId(id);
      const validation = validateCraftDrink({
        id,
        account,
        beverageCodex,
        cafeState: cafe,
        beans: player.beans,
      });
      const unlocked = isUnlockedRecipe({ id, account, codex: beverageCodex });
      const owned = isOwnedRecipe({ id, account, codex: beverageCodex });
      const canReceiveRecipe = canPurchaseRecipe(
        account,
        id,
        player.coins,
        beverageCodex,
      );
      const maxCraft = maxCraftQuantity({
        recipe,
        espressoShots: cafe.espressoShots,
        beans: player.beans,
        materialInventory: cafe.materialInventory,
        unlocked,
        owned,
      });
      const category = DRINK_CATEGORY[id];
      const canCraft = validation.canCraft && maxCraft > 0;

      return {
        id,
        recipe,
        category,
        categoryLabel: categoryTitleFor(id),
        description: beverage.description,
        imageSrc: drinkImageFor(id),
        ingredients: recipeIngredientRows({
          recipe,
          espressoShots: cafe.espressoShots,
          beans: player.beans,
          materialInventory: cafe.materialInventory,
        }),
        unlocked,
        owned,
        canReceiveRecipe,
        canCraft,
        maxCraft,
        isNew: !cafe.craftedDrinkIds.includes(id),
        isFavorite: favoriteDrinkIds.includes(id),
        stock: cafe.menuStock[id] ?? 0,
        statusLabel: statusLabelFor({
          unlocked,
          owned,
          canReceiveRecipe,
          canCraft,
          maxCraft,
          recipe,
        }),
        actionLabel: actionLabelFor({
          owned,
          canReceiveRecipe,
          canCraft,
          recipe,
        }),
      };
    });
  }, [
    account,
    beverageCodex,
    cafe,
    favoriteDrinkIds,
    player.beans,
    player.coins,
  ]);

  const visibleCards = useMemo(() => {
    return drinkCards.filter((card) => {
      if (!visibleByCategory(card, selectedCategory)) return false;
      if (showCraftableOnly && !card.canCraft) return false;
      if (showNewOnly && !card.isNew) return false;
      if (showFavoriteOnly && !card.isFavorite) return false;
      return true;
    });
  }, [
    drinkCards,
    selectedCategory,
    showCraftableOnly,
    showFavoriteOnly,
    showNewOnly,
  ]);

  useEffect(() => {
    if (visibleCards.length === 0) return;
    if (!visibleCards.some((card) => card.id === selectedDrinkId)) {
      setSelectedDrinkId(visibleCards[0].id);
      setCraftQuantity(1);
    }
  }, [selectedDrinkId, visibleCards]);

  const selectedCard =
    drinkCards.find((card) => card.id === selectedDrinkId) ?? drinkCards[0];

  useEffect(() => {
    if (!selectedCard || selectedCard.maxCraft <= 0) return;
    setCraftQuantity((value) => Math.min(value, selectedCard.maxCraft));
  }, [selectedCard]);

  const canCraftSelected =
    !!selectedCard &&
    selectedCard.owned &&
    selectedCard.unlocked &&
    selectedCard.maxCraft >= craftQuantity;
  const canReceiveSelected =
    !!selectedCard && !selectedCard.owned && selectedCard.canReceiveRecipe;

  const runPrimaryAction = useCallback(
    (card: DrinkCardModel, quantity: number) => {
      if (!card.owned) {
        if (card.canReceiveRecipe) {
          purchaseRecipe(card.id);
        }
        return;
      }

      const targetQuantity = Math.max(1, Math.min(quantity, card.maxCraft));
      for (let i = 0; i < targetQuantity; i += 1) {
        if (!craftDrink(card.id)) break;
      }
    },
    [craftDrink, purchaseRecipe],
  );

  const toggleFavorite = useCallback((id: DrinkStationDrinkId) => {
    setFavoriteDrinkIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  return (
    <>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#d9efff]">
        <main className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-[#f7efe2] text-coffee-900">
          <Image
            src={drinkStationAssets.bg.base}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 28rem"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,248,238,0.16) 31%, rgba(255,248,238,0.08) 100%)",
            }}
          />

          <ScreenLayoutSlot item={tunedLayout.headerHud}>
            <Image
              src={drinkStationAssets.header.topHud}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover object-top"
            />
          </ScreenLayoutSlot>

          <ScreenLayoutSlot item={tunedLayout.backButton}>
            <Link
              href="/lobby"
              aria-label="로비로 돌아가기"
              className="grid h-full w-full place-items-center rounded-[1rem] bg-[#74a7d8] text-3xl font-black leading-none text-white shadow-[0_8px_16px_rgb(76_91_116_/_0.28)] ring-2 ring-[#4d7fad]/35 transition-transform active:scale-95"
            >
              <span className="-mt-1" aria-hidden>
                ←
              </span>
            </Link>
          </ScreenLayoutSlot>

          <ScreenLayoutSlot item={tunedLayout.titleLogo}>
            <Image
              src={drinkStationAssets.header.title}
              alt="음료 제작대"
              fill
              priority
              sizes="(max-width: 768px) 42vw, 12rem"
              className="object-contain drop-shadow-[0_5px_10px_rgb(82_58_43_/_0.12)]"
            />
          </ScreenLayoutSlot>

          <ScreenLayoutSlot item={tunedLayout.currencyBar}>
            <div className="flex h-full w-full items-center justify-end gap-1.5">
              <TopHudStat
                label="코인"
                value={player.coins}
                icon={<CoinIcon size={17} />}
              />
              <TopHudStat
                label="원두"
                value={player.beans}
                icon={<BeanIcon size={17} />}
              />
              <TopHudStat
                label="하트"
                value={player.hearts}
                icon={<HeartIcon size={17} />}
              />
            </div>
          </ScreenLayoutSlot>

          <ScreenLayoutSlot item={tunedLayout.categoryTabs}>
            <nav
              aria-label="음료 카테고리"
              className="flex h-full items-end gap-[0.4%] overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORY_TABS.map((category) => {
                const active = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(category.key)}
                    className="relative h-full min-w-[12.85%] shrink-0 transition-transform duration-150 ease-out active:scale-[0.97]"
                  >
                    <Image
                      src={
                        active
                          ? drinkStationAssets.category[category.key].on
                          : drinkStationAssets.category[category.key].off
                      }
                      alt=""
                      fill
                      sizes="(max-width: 768px) 18vw, 5.1rem"
                      className="object-contain object-bottom drop-shadow-[0_6px_8px_rgb(84_62_43_/_0.12)]"
                    />
                    <span className="sr-only">{category.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScreenLayoutSlot>

          <section className="absolute inset-x-0 top-[19.1%] z-10 h-[80.9%]">
            <Image
              src={drinkStationAssets.bg.cardPanel}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover object-top"
            />
          </section>

          <ScreenLayoutSlot item={tunedLayout.recipeFilterBar}>
            <div className="flex h-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <FilterPill
                  active={showCraftableOnly}
                  label="제작 가능"
                  onClick={() => setShowCraftableOnly((value) => !value)}
                />
                <FilterPill
                  active={showNewOnly}
                  label="신규"
                  onClick={() => setShowNewOnly((value) => !value)}
                />
                <FilterPill
                  active={showFavoriteOnly}
                  label="즐겨찾기"
                  onClick={() => setShowFavoriteOnly((value) => !value)}
                />
              </div>
              <button
                type="button"
                className="shrink-0 rounded-[0.85rem] bg-[#f8f1e6]/86 px-3 py-2 text-xs font-bold text-[#7a5e43] shadow-sm ring-1 ring-[#c7a77e]/30"
              >
                기본순
              </button>
            </div>
          </ScreenLayoutSlot>

          <ScreenLayoutSlot item={tunedLayout.recipeGrid}>
            <section className="h-full overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleCards.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5 pb-5">
                  {visibleCards.map((card) => (
                    <DrinkRecipeCard
                      key={card.id}
                      card={card}
                      layout={tunedLayout}
                      selected={card.id === selectedDrinkId}
                      reduceMotion={reduceMotion}
                      onSelect={() => {
                        setSelectedDrinkId(card.id);
                        setCraftQuantity(1);
                      }}
                      onFavorite={() => toggleFavorite(card.id)}
                      onPrimaryAction={() => runPrimaryAction(card, 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center rounded-[1.2rem] bg-[#fffaf1]/70 px-4 text-center text-sm font-semibold text-[#725941] ring-1 ring-[#c7a77e]/20">
                  조건에 맞는 레시피가 없어요.
                </div>
              )}
            </section>
          </ScreenLayoutSlot>

          {selectedCard ? (
            <ScreenLayoutSlot item={tunedLayout.bottomPanel}>
              <section className="relative h-full w-full">
                <Image
                  src={drinkStationAssets.bottom.hud}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 28rem"
                  className="object-cover object-bottom"
                />
                <BottomLayoutSlot item={tunedLayout.bottomSelectBg}>
                  <Image
                    src={drinkStationAssets.bottom.selectBg}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 96vw, 27rem"
                    className="object-fill"
                  />
                </BottomLayoutSlot>
                <BottomLayoutSlot item={tunedLayout.bottomDrink}>
                  <div className="absolute left-0 top-0 z-10 rounded-r-md bg-[#6e9ed1] px-2.5 py-1 text-[10px] font-black text-white shadow-sm">
                    선택 레시피
                  </div>
                  <Image
                    src={drinkStationAssets.bottom.selectDrink}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 24vw, 7rem"
                    className="object-contain"
                  />
                  <Image
                    src={selectedCard.imageSrc}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 25vw, 7rem"
                    className="object-contain p-2"
                  />
                </BottomLayoutSlot>
                <BottomLayoutSlot item={tunedLayout.bottomInfo}>
                  <div className="flex h-full min-w-0 flex-col justify-center">
                    <div className="flex flex-col items-start gap-1">
                      <h2 className="max-w-full truncate text-lg font-black tracking-tight text-[#5d3f2b]">
                        {selectedCard.recipe.name}
                      </h2>
                      <span className="shrink-0 rounded-md bg-[#78a9da] px-2 py-0.5 text-[10px] font-black leading-none text-white">
                        {selectedCard.categoryLabel}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-[#725941]/86">
                      {selectedCard.description}
                    </p>
                    <p className="mt-1 text-[10px] font-bold tabular-nums text-[#8a6c4e]">
                      재고 {selectedCard.stock}잔
                    </p>
                  </div>
                </BottomLayoutSlot>
                <BottomLayoutSlot item={tunedLayout.bottomControls}>
                  <div className="flex h-full flex-col justify-center gap-2">
                    <QuantityStepper
                      value={craftQuantity}
                      max={Math.max(1, selectedCard.maxCraft)}
                      disabled={selectedCard.maxCraft <= 0}
                      onMinus={() =>
                        setCraftQuantity((value) => Math.max(1, value - 1))
                      }
                      onPlus={() =>
                        setCraftQuantity((value) =>
                          Math.min(Math.max(1, selectedCard.maxCraft), value + 1),
                        )
                      }
                    />
                    <button
                      type="button"
                      disabled={!canCraftSelected && !canReceiveSelected}
                      onClick={() => runPrimaryAction(selectedCard, craftQuantity)}
                      className="relative h-14 min-w-0 overflow-hidden rounded-[0.9rem] transition-transform active:scale-[0.98] disabled:active:scale-100"
                    >
                      <Image
                        src={
                          canCraftSelected || canReceiveSelected
                            ? drinkStationAssets.bottom.makeButton
                            : drinkStationAssets.bottom.makeButtonDisabled
                        }
                        alt=""
                        fill
                        sizes="(max-width: 768px) 28vw, 8rem"
                        className="object-fill"
                      />
                      <span
                        className={cn(
                          "relative z-10 flex h-full items-center justify-center whitespace-nowrap px-1 text-base font-black",
                          canCraftSelected || canReceiveSelected
                            ? "text-[#78461d]"
                            : "text-[#8b7c6d]",
                        )}
                      >
                        {canReceiveSelected
                          ? selectedCard.actionLabel
                          : `${craftQuantity}잔 제작`}
                      </span>
                    </button>
                  </div>
                </BottomLayoutSlot>
              </section>
            </ScreenLayoutSlot>
          ) : null}

          {canUseWorkbenchDevTools ? (
            <button
              data-visual-test-hidden="true"
              type="button"
              onClick={() => setShowTuningPanel((value) => !value)}
              className="absolute left-3 z-[120] rounded-full bg-coffee-950/70 px-3 py-1.5 text-[11px] font-semibold text-cream-50 shadow-md backdrop-blur"
              style={{ top: "calc(env(safe-area-inset-top) + 5rem)" }}
            >
              {showTuningPanel ? "Tune Off" : "Tune On"}
            </button>
          ) : null}
        </main>
      </div>

      {canUseWorkbenchDevTools && showTuningPanel && tuningPanelClientReady ? (
        <WorkbenchTuningPanel
          layout={tunedLayout}
          selectedKey={selectedLayoutKey}
          onSelectedKeyChange={setSelectedLayoutKey}
          onLayoutItemChange={changeLayoutItem}
          onResetLayout={resetTunedLayout}
        />
      ) : null}
    </>
  );
}

function ScreenLayoutSlot({
  item,
  className,
  children,
}: {
  item: WorkbenchLayoutItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("absolute", className)}
      style={layoutItemStyle(item, WORKBENCH_LAYOUT_BASE)}
    >
      {children}
    </div>
  );
}

function BottomLayoutSlot({
  item,
  className,
  children,
}: {
  item: WorkbenchLayoutItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("absolute", className)}
      style={layoutItemStyle(item, WORKBENCH_BOTTOM_LAYOUT_BASE)}
    >
      {children}
    </div>
  );
}

function CardLayoutSlot({
  item,
  className,
  children,
}: {
  item: WorkbenchLayoutItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("absolute", className)}
      style={layoutItemStyle(item, WORKBENCH_CARD_LAYOUT_BASE)}
    >
      {children}
    </div>
  );
}

function TopHudStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex h-9 min-w-[4.2rem] items-center justify-center gap-1 rounded-full bg-[#fff8ee]/86 px-2 shadow-[0_4px_8px_rgb(48_35_28_/_0.16)] ring-1 ring-[#d8bea0]/45 backdrop-blur-sm">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-coffee-800">
        {icon}
      </span>
      <span className="sr-only">
        {label}
      </span>
      <span className="shrink-0 text-sm font-black tabular-nums text-[#5d3f2b]">
        {value}
      </span>
    </div>
  );
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "relative h-10 w-[7.2rem] shrink-0 overflow-hidden rounded-full text-xs font-black shadow-sm transition-transform active:scale-[0.97]",
        !active && "ring-1 ring-[#d4bd9a]/45",
      )}
    >
      <Image
        src={drinkStationAssets.filter.craftableToggle}
        alt=""
        fill
        sizes="7.2rem"
        className={cn(
          "object-fill transition-opacity",
          active ? "opacity-100" : "opacity-30 grayscale",
        )}
      />
      <span
        className={cn(
          "relative z-10 flex h-full items-center justify-center pl-4",
          active ? "text-white" : "text-[#765b40]",
        )}
      >
        {label}
      </span>
    </button>
  );
}

function DrinkRecipeCard({
  card,
  layout,
  selected,
  reduceMotion,
  onSelect,
  onFavorite,
  onPrimaryAction,
}: {
  card: DrinkCardModel;
  layout: WorkbenchLayout;
  selected: boolean;
  reduceMotion: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onPrimaryAction: () => void;
}) {
  const actionEnabled = card.canCraft || card.canReceiveRecipe;

  return (
    <motion.article
      layout={!reduceMotion}
      className={cn(
        "relative aspect-[503/445] min-h-[10.9rem] overflow-hidden rounded-[1rem]",
        selected && "drop-shadow-[0_8px_14px_rgb(66_51_38_/_0.18)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 text-left"
        aria-label={`${card.recipe.name} 선택`}
      >
        <Image
          src={drinkStationAssets.card.base}
          alt=""
          fill
          sizes="(max-width: 768px) 46vw, 12.8rem"
          className="object-fill"
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[1rem] ring-2 ring-transparent",
            selected && "ring-[#74a7d8]/70",
          )}
        />
      </button>

      <CardLayoutSlot item={layout.cardStatusBadge} className="pointer-events-none">
        <Image
          src={
            card.canCraft
              ? drinkStationAssets.card.badgePossible
              : drinkStationAssets.card.badgeShortage
          }
          alt=""
          fill
          sizes="(max-width: 768px) 15vw, 4.4rem"
          className="object-contain object-left"
        />
        <span className="absolute inset-0 flex items-center justify-center pr-1 text-[0.58rem] font-black text-white">
          {card.statusLabel}
        </span>
      </CardLayoutSlot>

      {card.isNew ? (
        <CardLayoutSlot
          item={layout.cardNewBadge}
          className="pointer-events-none"
        >
          <Image
            src={drinkStationAssets.card.badgeNew}
            alt="NEW"
            fill
            sizes="(max-width: 768px) 9vw, 2.7rem"
            className="object-contain"
          />
        </CardLayoutSlot>
      ) : null}

      <CardLayoutSlot item={layout.cardFavorite}>
        <button
          type="button"
          aria-label={
            card.isFavorite
              ? `${card.recipe.name} 즐겨찾기 해제`
              : `${card.recipe.name} 즐겨찾기`
          }
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          className={cn(
            "grid h-full w-full place-items-center rounded-full text-2xl font-black leading-none transition-transform active:scale-90",
            card.isFavorite
              ? "text-[#f2b64f] drop-shadow-[0_2px_0_rgb(139_91_30_/_0.35)]"
              : "text-[#eadcc8]",
          )}
        >
          {card.isFavorite ? "★" : "☆"}
        </button>
      </CardLayoutSlot>

      <CardLayoutSlot
        item={layout.cardDrinkImage}
        className="pointer-events-none"
      >
        <Image
          src={card.imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 20vw, 5.8rem"
          className="object-contain object-center"
        />
      </CardLayoutSlot>

      <CardLayoutSlot item={layout.cardName} className="pointer-events-none">
        <h3 className="flex h-full items-center justify-center truncate text-center text-base font-black tracking-tight text-[#5a3b28]">
          {card.recipe.name}
        </h3>
      </CardLayoutSlot>

      <CardLayoutSlot item={layout.cardType} className="pointer-events-none">
        <Image
          src={drinkStationAssets.card.categoryBadge}
          alt=""
          fill
          sizes="(max-width: 768px) 13vw, 3.6rem"
          className="object-fill"
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
          {card.categoryLabel}
        </span>
      </CardLayoutSlot>

      <CardLayoutSlot item={layout.cardMaterials} className="pointer-events-none">
        <div className="grid h-full grid-cols-3 gap-1">
        {card.ingredients.slice(0, 3).map((ingredient) => (
          <CardIngredientSlot key={ingredient.key} ingredient={ingredient} />
        ))}
        </div>
      </CardLayoutSlot>

      <CardLayoutSlot item={layout.cardButton}>
        <button
          type="button"
          disabled={!actionEnabled}
          onClick={(event) => {
            event.stopPropagation();
            onPrimaryAction();
          }}
          className="relative h-full w-full overflow-hidden rounded-[0.65rem] transition-transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          <Image
            src={drinkStationAssets.card.makeButton}
            alt=""
            fill
            sizes="(max-width: 768px) 22vw, 6rem"
            className="object-fill"
          />
          <span className="relative z-10 flex h-full items-center justify-center whitespace-nowrap px-1 text-xs font-black text-white">
            제작하기
          </span>
        </button>
      </CardLayoutSlot>
    </motion.article>
  );
}

function CardIngredientSlot({ ingredient }: { ingredient: IngredientRow }) {
  const enough = ingredient.have >= ingredient.need;

  return (
    <div className="relative aspect-[75/113] min-w-0 overflow-hidden rounded-[0.4rem] text-center">
      <Image
        src={drinkStationAssets.card.materialSlot}
        alt=""
        fill
        sizes="(max-width: 768px) 7vw, 2rem"
        className="object-fill"
      />
      <div className="absolute inset-x-1 top-[10%] flex justify-center">
        <MaterialGlyph ingredient={ingredient} size="sm" />
      </div>
      <div className="absolute inset-x-1 bottom-[9%]">
        <p className="truncate text-[9px] font-bold leading-tight text-[#69513a]">
          {ingredient.label}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[10px] font-black tabular-nums leading-none",
            enough ? "text-[#3f2a1c]" : "text-[#d05d55]",
          )}
        >
          {ingredient.have}/{ingredient.need}
        </p>
      </div>
    </div>
  );
}

function MaterialGlyph({
  ingredient,
  size,
}: {
  ingredient: IngredientRow;
  size: "sm" | "md";
}) {
  const iconSize = size === "sm" ? 19 : 22;
  const textSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  if (ingredient.kind === "shot") {
    return <EspressoShotIcon size={iconSize} className="opacity-95" />;
  }
  if (ingredient.kind === "bean") {
    return <BeanIcon size={iconSize} className="opacity-95" />;
  }

  return (
    <span
      className={cn(
        "grid rounded-full bg-[#f7e5c9] font-black text-[#71533c] ring-1 ring-[#d6bc92]/55",
        textSize,
      )}
      style={{ width: iconSize, height: iconSize }}
    >
      <span className="m-auto">{ingredient.label.slice(0, 1)}</span>
    </span>
  );
}

function QuantityStepper({
  value,
  max,
  disabled,
  onMinus,
  onPlus,
}: {
  value: number;
  max: number;
  disabled: boolean;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-full bg-[#f8f0e3]/90 px-1.5 shadow-sm ring-1 ring-[#c7a77e]/35">
      <button
        type="button"
        disabled={value <= 1}
        onClick={onMinus}
        className="grid h-8 w-8 place-items-center rounded-full bg-[#e8d4bb] text-lg font-black leading-none text-[#7b5b3e] ring-1 ring-[#c4a57c]/50 disabled:opacity-45"
      >
        -
      </button>
      <span className="min-w-5 text-center text-lg font-black tabular-nums text-[#4d3526]">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={onPlus}
        className="grid h-8 w-8 place-items-center rounded-full bg-[#e8d4bb] text-lg font-black leading-none text-[#7b5b3e] ring-1 ring-[#c4a57c]/50 disabled:opacity-45"
      >
        +
      </button>
    </div>
  );
}
