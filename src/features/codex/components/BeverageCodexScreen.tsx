"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LobbyReturnButton } from "@/components/navigation/LobbyReturnButton";
import { Card } from "@/components/ui/Card";
import {
  BEVERAGE_CATEGORIES,
  BEVERAGE_CATEGORY_ORDER,
  BEVERAGE_DEFINITIONS,
} from "@/features/meta/content/beverages";
import { codexStageFor } from "@/features/meta/content/codex";
import { normalizeAccountLevelState } from "@/features/meta/progression/missionEngine";
import type {
  BeverageCategoryId,
  BeverageDefinition,
  BeverageRarity,
  CodexEntryStage,
} from "@/features/meta/types/gameState";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";

type FilterId = "all" | BeverageCategoryId;

export function BeverageCodexScreen() {
  useResetDocumentScrollOnMount();
  const [filter, setFilter] = useState<FilterId>("all");
  const account = normalizeAccountLevelState(useAppStore((s) => s.accountLevel));
  const codex = useAppStore((s) => s.beverageCodex);

  const beverages = useMemo(
    () =>
      filter === "all"
        ? BEVERAGE_DEFINITIONS
        : BEVERAGE_DEFINITIONS.filter(
            (beverage) => beverage.categoryId === filter,
          ),
    [filter],
  );

  const summary = useMemo(() => {
    const counts: Record<CodexEntryStage, number> = {
      locked: 0,
      unlocked: 0,
      purchased: 0,
      crafted: 0,
      sold: 0,
    };
    for (const beverage of BEVERAGE_DEFINITIONS) {
      counts[codexStageFor({ beverage, account, codex })] += 1;
    }
    return counts;
  }, [account, codex]);

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          Beverage Codex
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
          음료 도감
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-coffee-700">
          해금하고, 레시피를 담고, 처음 만들고 판매한 기록이 여기에 남아요.
        </p>
      </header>

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {(["unlocked", "purchased", "crafted", "sold", "locked"] as const).map(
            (stage) => (
              <div
                key={stage}
                className="rounded-2xl bg-cream-200/55 px-1.5 py-2 ring-1 ring-coffee-600/6"
              >
                <div className="text-[10px] font-semibold text-coffee-600/70">
                  {stageLabel(stage)}
                </div>
                <div className="mt-0.5 text-sm font-black tabular-nums text-coffee-950">
                  {summary[stage]}
                </div>
              </div>
            ),
          )}
        </div>
      </Card>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          전체
        </FilterButton>
        {BEVERAGE_CATEGORY_ORDER.map((categoryId) => (
          <FilterButton
            key={categoryId}
            active={filter === categoryId}
            onClick={() => setFilter(categoryId)}
          >
            {BEVERAGE_CATEGORIES[categoryId].shortTitle}
          </FilterButton>
        ))}
      </div>

      <ul className="space-y-3">
        {beverages.map((beverage) => {
          const entry = codex.entries[beverage.id];
          const stage = codexStageFor({ beverage, account, codex });
          return (
            <li key={beverage.id}>
              <BeverageCodexCard
                beverage={beverage}
                stage={stage}
                totalSold={entry?.totalSold ?? 0}
                crafted={Boolean(entry?.firstCraftedAtMs)}
                sold={Boolean(entry?.firstSoldAtMs)}
              />
            </li>
          );
        })}
      </ul>

      <LobbyReturnButton />
    </AppShell>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-2 text-xs font-bold transition-colors",
        active
          ? "bg-coffee-900 text-cream-50 shadow-card"
          : "bg-cream-50/88 text-coffee-800 ring-1 ring-coffee-600/10",
      )}
    >
      {children}
    </button>
  );
}

function BeverageCodexCard({
  beverage,
  stage,
  totalSold,
  crafted,
  sold,
}: {
  beverage: BeverageDefinition;
  stage: CodexEntryStage;
  totalSold: number;
  crafted: boolean;
  sold: boolean;
}) {
  const locked = stage === "locked";
  return (
    <Card
      className={cn(
        "p-4",
        locked ? "bg-cream-200/55" : "bg-cream-50/94",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={cn("text-sm font-black", locked ? "text-coffee-700/65" : "text-coffee-950")}>
              {locked ? "아직 비어 있는 기록" : beverage.name}
            </h2>
            <span className={rarityClassName(beverage.rarity)}>
              {rarityLabel(beverage.rarity)}
            </span>
            <span className={stageClassName(stage)}>{stageLabel(stage)}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700/78">
            {locked
              ? `Lv.${beverage.unlockLevel}에 기록이 열려요.`
              : beverage.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold text-coffee-700/80">
            <span className="rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
              {BEVERAGE_CATEGORIES[beverage.categoryId].shortTitle}
            </span>
            <span className="rounded-full bg-cream-200/60 px-2 py-0.5 ring-1 ring-coffee-600/7">
              Lv.{beverage.unlockLevel}
            </span>
            {beverage.timeLimited ? (
              <span className="rounded-full bg-accent-soft/14 px-2 py-0.5 ring-1 ring-accent-soft/22">
                시간대
              </span>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-semibold text-coffee-600/65">
            판매
          </div>
          <div className="mt-0.5 text-lg font-black tabular-nums text-coffee-950">
            {totalSold}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
        <div
          className={cn(
            "rounded-2xl px-2 py-2 ring-1",
            crafted
              ? "bg-accent-mint/20 text-coffee-900 ring-accent-mint/35"
              : "bg-cream-200/45 text-coffee-600/70 ring-coffee-600/7",
          )}
        >
          최초 제작 {crafted ? "완료" : "대기"}
        </div>
        <div
          className={cn(
            "rounded-2xl px-2 py-2 ring-1",
            sold
              ? "bg-accent-soft/18 text-coffee-900 ring-accent-soft/30"
              : "bg-cream-200/45 text-coffee-600/70 ring-coffee-600/7",
          )}
        >
          최초 판매 {sold ? "완료" : "대기"}
        </div>
      </div>
    </Card>
  );
}

function stageLabel(stage: CodexEntryStage): string {
  switch (stage) {
    case "locked":
      return "잠김";
    case "unlocked":
      return "해금";
    case "purchased":
      return "구매";
    case "crafted":
      return "제작";
    case "sold":
      return "판매";
    default:
      return "기록";
  }
}

function rarityLabel(rarity: BeverageRarity): string {
  switch (rarity) {
    case "common":
      return "일반";
    case "uncommon":
      return "고급";
    case "rare":
      return "희귀";
    case "signature":
      return "시그니처";
    case "legendary":
      return "전설";
    default:
      return "일반";
  }
}

function rarityClassName(rarity: BeverageRarity): string {
  return cn(
    "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
    rarity === "legendary"
      ? "bg-coffee-950/10 text-coffee-950 ring-coffee-700/20"
      : rarity === "signature"
        ? "bg-accent-soft/20 text-coffee-950 ring-accent-soft/30"
        : rarity === "rare"
          ? "bg-[#f1dfc5] text-coffee-900 ring-accent-soft/22"
          : "bg-cream-200/70 text-coffee-700 ring-coffee-600/8",
  );
}

function stageClassName(stage: CodexEntryStage): string {
  return cn(
    "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
    stage === "sold"
      ? "bg-accent-soft/22 text-coffee-950 ring-accent-soft/35"
      : stage === "crafted"
        ? "bg-accent-mint/22 text-coffee-950 ring-accent-mint/35"
        : stage === "purchased"
          ? "bg-cream-50 text-coffee-900 ring-coffee-600/10"
          : stage === "unlocked"
            ? "bg-cream-200/70 text-coffee-800 ring-coffee-600/8"
            : "bg-coffee-900/5 text-coffee-700/65 ring-coffee-600/8",
  );
}
