"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";
import { CafeLoopSection } from "@/features/lobby/components/CafeLoopSection";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";

export default function LobbyRoasterPage() {
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
          로스터
        </h1>
      </header>

      <ResourceBar variant="compact" />

      <Card className="mb-4 border border-white/40 bg-cream-50/80 p-4 ring-1 ring-coffee-600/10">
        <p className="text-sm font-semibold text-coffee-900">
          원두를 태워 샷을 만들어요.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
          (임시 화면) 다음 단계에서 “로스터 전용 공간 레이아웃”으로 교체합니다.
        </p>
      </Card>

      <CafeLoopSection sections={["roast"]} />
    </AppShell>
  );
}
