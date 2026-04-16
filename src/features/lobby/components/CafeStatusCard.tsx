"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import { MENU_LABEL, MENU_ORDER } from "@/features/meta/balance/cafeEconomy";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

export function CafeStatusCard() {
  const cafe = useAppStore((s) => s.cafeState);
  const beans = useAppStore((s) => s.playerResources.beans);
  const stock = useAppStore((s) => s.cafeState.menuStock);
  const m = getCafeRuntimeModifiers(cafe);
  const total = stock.americano + stock.latte + stock.affogato;
  const hasAny = total > 0;

  return (
    <Card className="mb-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            오늘의 운영
          </div>
          <p className="mt-2 text-sm leading-relaxed text-coffee-800">
            원두를 로스팅해 베이스 샷을 만들고, 메뉴를 진열하면 손님이 조용히 가져가요.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-semibold text-coffee-600/70">
            자동 판매
          </div>
          <div className="mt-1 text-sm font-bold tabular-nums text-coffee-900">
            {(m.autoSellIntervalMs / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-cream-200/60 px-2 py-2 ring-1 ring-coffee-600/5">
          <div className="text-[10px] font-semibold text-coffee-600/70">원두</div>
          <div className="mt-0.5 text-base font-bold tabular-nums text-coffee-900">
            {beans}
          </div>
        </div>
        <div className="rounded-2xl bg-cream-200/60 px-2 py-2 ring-1 ring-coffee-600/5">
          <div className="text-[10px] font-semibold text-coffee-600/70">베이스</div>
          <div className="mt-0.5 text-base font-bold tabular-nums text-coffee-900">
            {cafe.espressoShots}
          </div>
        </div>
        <div className="rounded-2xl bg-cream-200/60 px-2 py-2 ring-1 ring-coffee-600/5">
          <div className="text-[10px] font-semibold text-coffee-600/70">진열</div>
          <div className="mt-0.5 text-base font-bold tabular-nums text-coffee-900">
            {total}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-coffee-600/75">
          {hasAny
            ? `지금 진열 중: ${MENU_ORDER.filter((id) => stock[id] > 0)
                .map((id) => MENU_LABEL[id])
                .join(", ")}`
            : "진열이 비어 있어요. 쇼케이스에서 1잔만 만들어도 바로 팔리기 시작해요."}
        </p>
        <Link
          href="/lobby?panel=cafe"
          className={cn(
            "shrink-0 text-xs font-semibold text-coffee-900",
            !hasAny
              ? "rounded-full bg-cream-200/90 px-3 py-1.5 ring-1 ring-accent-soft/30 hover:bg-cream-200"
              : "underline-offset-2 hover:underline",
          )}
        >
          쇼케이스 열기
        </Link>
      </div>
    </Card>
  );
}

