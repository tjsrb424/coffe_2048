"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { CafeUpgradesCard } from "@/features/menu/components/CafeUpgradesCard";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";

export function ExtensionHubScreen() {
  useResetDocumentScrollOnMount();

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Extend
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
            확장
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            코인으로 설비를 올리면 로스팅·진열·분위기가 함께 살아나요. 매장
            레벨은 세 트랙 합으로 자동 반영돼요.
          </p>
        </header>

        <ResourceBar />

        <CafeUpgradesCard />
      </AppShell>
      <BottomNav />
    </>
  );
}
