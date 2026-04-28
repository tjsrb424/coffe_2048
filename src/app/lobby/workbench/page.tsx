"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";
import { CafeLoopSection } from "@/features/lobby/components/CafeLoopSection";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";

export default function LobbyWorkbenchPage() {
  useResetDocumentScrollOnMount();

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
          음료 제작대
        </h1>
      </header>

      <ResourceBar variant="compact" />

      <Card className="mb-4 border border-white/40 bg-cream-50/80 p-4 ring-1 ring-coffee-600/10">
        <p className="text-sm font-semibold text-coffee-900">
          레시피를 고르고, 재료를 써서 음료를 제작해요.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
          (임시 화면) 다음 단계에서 공유해주신 “제작대 레이아웃”으로 교체합니다.
        </p>
      </Card>

      <CafeLoopSection sections={["craft"]} />
    </AppShell>
  );
}
