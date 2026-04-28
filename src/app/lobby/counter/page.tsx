"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";
import { CounterSheetTodayGuestHint } from "@/features/customers/components/CustomerPresenceHints";
import { CafeLoopSection } from "@/features/lobby/components/CafeLoopSection";
import { totalMenuStock } from "@/features/meta/balance/cafeEconomy";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useAppStore } from "@/stores/useAppStore";

export default function LobbyCounterPage() {
  useResetDocumentScrollOnMount();
  const menuStock = useAppStore((s) => s.cafeState.menuStock);
  const menuTotalStock = totalMenuStock(menuStock);

  return (
    <AppShell>
      <header className="mb-5">
        <Link
          href="/lobby"
          className="inline-flex items-center rounded-full bg-cream-200/70 px-3 py-1.5 text-xs font-bold text-coffee-900 ring-1 ring-coffee-600/8 hover:bg-cream-50"
        >
          ← 로비로
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-coffee-900">
          계산대
        </h1>
      </header>

      <ResourceBar variant="compact" />

      <CounterSheetTodayGuestHint />

      {menuTotalStock === 0 ? (
        <Card className="mb-4 border border-accent-soft/25 bg-cream-50/95 p-4 ring-1 ring-coffee-600/8">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            진열할 음료가 없어요
          </div>
          <p className="mt-2 text-sm leading-relaxed text-coffee-800">
            먼저 음료를 제작해 진열해보세요.
          </p>
          <Link
            href="/lobby/workbench"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-cream-200/90 px-3 py-2.5 text-center text-xs font-semibold text-coffee-900 ring-1 ring-accent-soft/30 hover:bg-cream-200"
          >
            음료 제작대로 이동
          </Link>
        </Card>
      ) : null}

      <CafeLoopSection sections={["display"]} />
    </AppShell>
  );
}
