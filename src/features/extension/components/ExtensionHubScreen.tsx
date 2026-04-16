"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { CafeUpgradesCard } from "@/features/menu/components/CafeUpgradesCard";
import { ResourceBar } from "@/features/lobby/components/ResourceBar";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { LiveOpsPlaceholderSection } from "./LiveOpsPlaceholderSection";

export function ExtensionHubScreen() {
  useResetDocumentScrollOnMount();

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Grow
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-coffee-900">
            매장이 자라는 방식
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            로비에서 모은 코인으로 설비를 다듬고, 시즌과 손님 이야기는 천천히
            쌓여 가요. 바쁜 시트 대신, 여긴 조금 느린 메모장 같은 곳이에요.
          </p>
          <p className="mt-2 text-xs text-coffee-600/75">
            <Link
              href="/lobby"
              className="font-semibold underline-offset-2 hover:underline"
            >
              로비로
            </Link>
          </p>
        </header>

        <ResourceBar variant="compact" />

        <LiveOpsPlaceholderSection />

        <div className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            설비 성장
          </p>
          <CafeUpgradesCard />
        </div>
      </AppShell>
    </>
  );
}
