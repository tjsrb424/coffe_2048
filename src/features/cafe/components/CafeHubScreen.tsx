"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { CafeLoopSection } from "@/features/lobby/components/CafeLoopSection";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";

export function CafeHubScreen() {
  useResetDocumentScrollOnMount();

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Cafe
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
            카페 운영
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            로스팅부터 진열·자동 판매까지, 오늘 매장의 손길이 닿는 곳이에요.
          </p>
        </header>

        <ResourceBar />

        <CafeLoopSection />
      </AppShell>
      <BottomNav />
    </>
  );
}
