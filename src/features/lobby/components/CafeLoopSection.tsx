"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import {
  CAFE_ECONOMY,
  MENU_LABEL,
  MENU_ORDER,
  MENU_UNLOCK_CAFE_LEVEL,
} from "@/features/meta/balance/cafeEconomy";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import { useAppStore } from "@/stores/useAppStore";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { cn } from "@/lib/utils";

export type CafeLoopSectionKey = "roast" | "craft" | "display";

export function CafeLoopSection({
  sections = ["roast", "craft", "display"],
}: {
  /** 기본값은 전체. 로비 시트 등에서 일부만 표시할 때 사용 */
  sections?: CafeLoopSectionKey[];
}) {
  const beans = useAppStore((s) => s.playerResources.beans);
  const cafe = useAppStore((s) => s.cafeState);
  const shots = useAppStore((s) => s.cafeState.espressoShots);
  const menuStock = useAppStore((s) => s.cafeState.menuStock);
  const lastAuto = useAppStore((s) => s.cafeState.lastAutoSellAtMs);
  const roastOnce = useAppStore((s) => s.roastOnce);
  const craftDrink = useAppStore((s) => s.craftDrink);
  const { lightTap } = useGameFeedback();

  const m = getCafeRuntimeModifiers(cafe);
  const canRoast = beans >= m.roastBeanCost && shots < m.maxShots;
  const totalStock =
    menuStock.americano + menuStock.latte + menuStock.affogato;
  const reduceMotion = !!useReducedMotion();

  const roastBlockReason =
    shots >= m.maxShots
      ? "베이스가 가득 찼어요. 판매로 샷을 비운 뒤 다시 로스팅해요."
      : beans < m.roastBeanCost
        ? `원두가 ${m.roastBeanCost - beans}단 더 필요해요.`
        : null;

  const show = (k: CafeLoopSectionKey) => sections.includes(k);

  const scrollToCraft = () => {
    const el = document.getElementById("lobby-cafe-craft");
    el?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-4">
      {show("roast") && (
      <Card className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          로스터
        </div>
        <p className="mt-2 text-sm text-coffee-800">
          원두 {m.roastBeanCost}단 → 베이스 {m.shotYield}샷. (최대 {m.maxShots}샷)
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-coffee-900">
            베이스{" "}
            <span className="tabular-nums text-coffee-700">{shots}</span>
            샷
          </div>
          <Button
            type="button"
            variant="soft"
            disabled={!canRoast}
            onClick={() => {
              lightTap();
              roastOnce();
            }}
          >
            로스팅
          </Button>
        </div>
        <p
          className={cn(
            "mt-2 text-xs leading-relaxed",
            canRoast ? "text-coffee-600/55" : "text-coffee-700/85",
          )}
        >
          {canRoast
            ? "베이스를 채우고 쇼케이스에서 잔을 만들어 진열해요."
            : roastBlockReason}
        </p>
      </Card>
      )}

      {show("craft") && (
      <Card id="lobby-cafe-craft" className="scroll-mt-4 p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
              메뉴 제작
            </div>
            <p className="mt-2 text-sm text-coffee-800">
              가능한 카드부터 눌러 진열 재고를 채워요.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream-200/50 px-3 py-2 ring-1 ring-coffee-600/5">
          <span className="text-[11px] font-semibold text-coffee-600/75">
            지금 자원
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold tabular-nums text-coffee-900">
            <span>
              샷{" "}
              <span className="text-coffee-800">{shots}</span>
            </span>
            <span>
              원두{" "}
              <span className="text-coffee-800">{beans}</span>
              단
            </span>
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-3">
          {MENU_ORDER.map((id) => (
            <MenuCraftCard
              key={id}
              id={id}
              stock={menuStock[id]}
              locked={cafe.cafeLevel < (MENU_UNLOCK_CAFE_LEVEL[id] ?? 1)}
              requiredCafeLevel={MENU_UNLOCK_CAFE_LEVEL[id] ?? 1}
              shotsOk={shots >= CAFE_ECONOMY.recipe[id].shots}
              beansOk={beans >= CAFE_ECONOMY.recipe[id].beans}
              shots={shots}
              beans={beans}
              onCraft={() => {
                lightTap();
                craftDrink(id);
              }}
            />
          ))}
        </ul>
      </Card>
      )}

      {show("display") && (
      <Card id="lobby-cafe-display" className="scroll-mt-4 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          진열 · 자동 판매
        </div>
        <p className="mt-2 text-sm text-coffee-800">
          약 {(m.autoSellIntervalMs / 1000).toFixed(1)}초마다 손님이 한 잔
          가져가요. 아메 → 라떼 → 아포 순으로 비어 있는 잔을 집어요.
        </p>
        {totalStock === 0 && show("craft") ? (
          <div className="mt-3 rounded-2xl border border-accent-soft/25 bg-cream-50/90 px-3 py-3 ring-1 ring-coffee-600/8">
            <p className="text-xs font-semibold text-coffee-900">
              진열이 비어 있어요
            </p>
            <p className="mt-1 text-xs leading-relaxed text-coffee-700/85">
              위 메뉴 제작에서 1잔만 만들어도 자동 판매가 시작돼요.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="mt-2 h-9 w-full text-xs font-semibold text-coffee-900"
              onClick={() => {
                lightTap();
                scrollToCraft();
              }}
            >
              메뉴 제작으로 이동
            </Button>
          </div>
        ) : null}
        {totalStock === 0 && !show("craft") ? (
          <div className="mt-3 rounded-2xl border border-accent-soft/20 bg-cream-50/90 px-3 py-2.5 ring-1 ring-coffee-600/8">
            <p className="text-xs leading-relaxed text-coffee-700/85">
              진열이 비어 있어요. 쇼케이스에서 메뉴를 제작해 주세요.
            </p>
          </div>
        ) : null}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {MENU_ORDER.map((id) => (
            <div
              key={id}
              className={cn(
                "rounded-2xl px-2 py-3 ring-1",
                menuStock[id] > 0
                  ? "bg-cream-50/95 ring-accent-soft/25 shadow-[inset_0_0_0_1px_rgba(196,154,108,0.12)]"
                  : "bg-cream-200/45 opacity-60 ring-coffee-600/5",
              )}
            >
              <div className="text-[11px] font-semibold text-coffee-600/70">
                {MENU_LABEL[id]}
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-coffee-900">
                {menuStock[id]}
              </div>
              <div className="mt-1 text-[10px] text-coffee-600/60">
                +{CAFE_ECONOMY.sellPrice[id] + m.sellBonus}코인
              </div>
            </div>
          ))}
        </div>
        <motion.p
          className="mt-3 text-center text-xs text-coffee-600/70"
          key={lastAuto + totalStock}
          initial={reduceMotion ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
        >
          진열 합계{" "}
          <span className="font-semibold tabular-nums text-coffee-800">
            {totalStock}
          </span>
          잔
        </motion.p>
      </Card>
      )}
    </div>
  );
}

function menuMiniDesc(id: DrinkMenuId): string {
  switch (id) {
    case "americano":
      return "가볍고 깔끔한 한 잔. 기본으로 가장 잘 나가요.";
    case "latte":
      return "부드러운 바디감. 원두를 조금 더 써요.";
    case "affogato":
      return "진하고 달콤한 마무리. 특별한 한 잔이에요.";
    default:
      return "";
  }
}

function menuEmoji(id: DrinkMenuId): string {
  switch (id) {
    case "americano":
      return "☕";
    case "latte":
      return "🥛";
    case "affogato":
      return "🍨";
    default:
      return "☕";
  }
}

function MenuCraftCard({
  id,
  stock,
  locked,
  requiredCafeLevel,
  shotsOk,
  beansOk,
  shots,
  beans,
  onCraft,
}: {
  id: DrinkMenuId;
  stock: number;
  locked: boolean;
  requiredCafeLevel: number;
  shotsOk: boolean;
  beansOk: boolean;
  shots: number;
  beans: number;
  onCraft: () => void;
}) {
  const rec = CAFE_ECONOMY.recipe[id];
  const can = !locked && shotsOk && beansOk;
  const needsBeans = rec.beans > 0;

  const blockLine = locked
    ? `카페 Lv.${requiredCafeLevel}에서 열려요`
    : !shotsOk
      ? `샷이 부족해요 · ${shots}/${rec.shots}`
      : !beansOk && needsBeans
        ? `원두가 부족해요 · ${beans}/${rec.beans}단`
        : "지금은 만들 수 없어요";

  return (
    <li
      className={cn(
        "rounded-3xl p-3 ring-1 transition-colors",
        can
          ? cn(
              "bg-cream-50/95 ring-accent-soft/35",
              "shadow-[inset_0_0_0_1px_rgba(196,154,108,0.14),0_10px_26px_-18px_rgba(90,61,43,0.45)]",
            )
          : "bg-cream-200/45 ring-coffee-600/5",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl ring-1",
            can
              ? "bg-gradient-to-br from-cream-50 to-cream-200/70 ring-accent-soft/22"
              : "bg-cream-50/70 ring-coffee-600/10 opacity-80",
          )}
          aria-hidden
        >
          <span className="text-xl">{menuEmoji(id)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-coffee-900">
              {MENU_LABEL[id]}
            </h3>
            {can ? (
              <span className="rounded-full bg-accent-soft/14 px-2 py-0.5 text-[10px] font-semibold text-coffee-800 ring-1 ring-accent-soft/22">
                제작 가능
              </span>
            ) : (
              <span className="rounded-full bg-coffee-900/5 px-2 py-0.5 text-[10px] font-semibold text-coffee-600/70 ring-1 ring-coffee-600/10">
                {locked ? "잠김" : "제작 불가"}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
            {menuMiniDesc(id)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold tabular-nums">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 ring-1",
                shotsOk
                  ? "bg-cream-50/80 text-coffee-800 ring-coffee-600/10"
                  : "bg-[#f6ede3] text-coffee-900 ring-accent-soft/22",
              )}
            >
              샷 {shots}/{rec.shots}
            </span>
            {needsBeans ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 ring-1",
                  beansOk
                    ? "bg-cream-50/80 text-coffee-800 ring-coffee-600/10"
                    : "bg-[#f6ede3] text-coffee-900 ring-accent-soft/22",
                )}
              >
                원두 {beans}/{rec.beans}단
              </span>
            ) : null}
          </div>

          {!can ? (
            <p className="mt-2 text-[11px] leading-relaxed text-coffee-700/90">
              {blockLine}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-coffee-600/70">
              재고
            </div>
            <div className="mt-0.5 text-sm font-bold tabular-nums text-coffee-900">
              {stock}
            </div>
          </div>
          <Button
            type="button"
            variant={can ? "soft" : "ghost"}
            className={cn(
              "h-11 px-3 text-xs font-semibold",
              can && "min-w-[72px]",
              !can && "opacity-70",
            )}
            disabled={!can}
            onClick={onCraft}
          >
            제작하기
          </Button>
        </div>
      </div>
    </li>
  );
}
