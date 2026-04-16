"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import {
  CAFE_ECONOMY,
  MENU_LABEL,
  MENU_ORDER,
} from "@/features/meta/balance/cafeEconomy";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useAppStore } from "@/stores/useAppStore";

/** /menu — 진열 재고·단가 요약(쇼케이스 탭 역할) */
export function ShowcaseMenuScreen() {
  useResetDocumentScrollOnMount();
  const cafe = useAppStore((s) => s.cafeState);
  const menuStock = useAppStore((s) => s.cafeState.menuStock);
  const m = getCafeRuntimeModifiers(cafe);

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Menu / Showcase
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
            쇼케이스
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            진열 잔 수와 손님이 가져갈 때의 단가를 한눈에 볼 수 있어요. 제작과
            로스팅은 로비 핫존이나{" "}
            <Link href="/cafe" className="font-semibold underline-offset-2 hover:underline">
              카페
            </Link>
            탭에서 이어가요.
          </p>
        </header>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            진열 재고
          </div>
          <ul className="mt-4 space-y-3">
            {MENU_ORDER.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between rounded-2xl bg-cream-200/60 px-3 py-3 ring-1 ring-coffee-600/5"
              >
                <span className="text-sm font-semibold text-coffee-900">
                  {MENU_LABEL[id]}
                </span>
                <span className="tabular-nums text-sm text-coffee-700">
                  {menuStock[id]}잔 · 판매{" "}
                  <span className="font-semibold text-coffee-900">
                    +{CAFE_ECONOMY.sellPrice[id] + m.sellBonus}
                  </span>
                  코인
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </AppShell>
    </>
  );
}
