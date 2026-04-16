"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
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
            스크롤형 운영
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            같은 루프를 로비의 고정 씬·핫존에서도 열 수 있어요. 집중해서 길게
            손볼 때는 이 탭을 쓰면 돼요.
          </p>
        </header>

        <Card className="mb-4 border border-accent-soft/25 bg-cream-100/80 p-4">
          <p className="text-sm font-semibold text-coffee-900">
            빠른 진입은 로비
          </p>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700">
            로스터·쇼케이스·카운터·퍼즐은 로비 전경을 탭하면 바텀시트로 열려요.
          </p>
          <Link
            href="/lobby"
            className="mt-3 inline-block text-sm font-semibold text-coffee-800 underline-offset-2 hover:underline"
          >
            로비로 이동
          </Link>
        </Card>

        <ResourceBar variant="compact" />

        <CafeLoopSection />
      </AppShell>
    </>
  );
}
