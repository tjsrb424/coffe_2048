"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/stores/useAppStore";
import { LiveOpsDevTools } from "./LiveOpsDevTools";

/**
 * 시즌·손님·이벤트 저장 슬롯(표시 중심).
 * 실제 보상 룰은 후속 연결.
 */
export function LiveOpsPlaceholderSection() {
  const pass = useAppStore((s) => s.passProgress);
  const liveOps = useAppStore((s) => s.liveOps);

  return (
    <div className="space-y-5">
      <section aria-labelledby="liveops-season">
        <h2
          id="liveops-season"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60"
        >
          시즌 일지
        </h2>
        <Card className="border border-coffee-600/8 bg-cream-50/90 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-coffee-800">
            오늘의 작은 목표를 쌓아 두는 곳이에요. 티어와 XP는 저장만 해 두고,
            보상은 천천히 연결할 예정이에요.
          </p>
          <p className="mt-3 text-sm tabular-nums text-coffee-900">
            시즌 {pass.seasonId} · 티어 {pass.tier} · XP {pass.xp}
            {pass.premiumUnlocked ? (
              <span className="ml-2 text-xs font-semibold text-accent-soft">
                프리미엄 트랙
              </span>
            ) : null}
          </p>
        </Card>
      </section>

      <section aria-labelledby="liveops-guests">
        <h2
          id="liveops-guests"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60"
        >
          단골과 특별 손님
        </h2>
        <Card className="border border-coffee-600/8 bg-cream-50/90 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-coffee-800">
            매장이 익숙해질수록 남는 이야기를 모아 둘 거예요.
          </p>
          <p className="mt-2 text-xs text-coffee-700">
            {liveOps.unlockedGuestIds.length > 0
              ? liveOps.unlockedGuestIds.join(" · ")
              : "아직 열린 인연 없음"}
          </p>
        </Card>
      </section>

      <section aria-labelledby="liveops-events">
        <h2
          id="liveops-events"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60"
        >
          계절 이벤트
        </h2>
        <Card className="border border-coffee-600/8 bg-cream-50/90 p-4 shadow-card">
          <p className="text-sm leading-relaxed text-coffee-800">
            벚꽃이든 여름이든, 잠깐 들르는 작은 축제를 여기에 걸어 둘게요.
          </p>
          <p className="mt-2 text-xs text-coffee-700">
            {liveOps.activeEventIds.length > 0
              ? liveOps.activeEventIds.join(" · ")
              : "예정된 이벤트 없음"}
          </p>
        </Card>
      </section>

      <p className="text-center text-xs leading-relaxed text-coffee-600/75">
        테마와 감성 소비는{" "}
        <Link
          href="/shop"
          className="font-semibold text-coffee-800 underline-offset-2 hover:underline"
        >
          상점
        </Link>
        에서 만나요.
      </p>

      <LiveOpsDevTools />
    </div>
  );
}
