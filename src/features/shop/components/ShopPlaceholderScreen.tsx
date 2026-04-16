"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { useAppStore } from "@/stores/useAppStore";

const PRODUCTS = [
  {
    id: "ad_free",
    title: "광고 제거 패스",
    blurb: "전면·선택 광고 완화(웹 1차 목표)",
    action: "adFree" as const,
  },
  {
    id: "starter_pack",
    title: "스타터 팩",
    blurb: "코인·원두·장식(실결제 전 placeholder)",
    action: "starter" as const,
  },
  {
    id: "theme_sakura",
    title: "벚꽃 카페 테마",
    blurb: "로비 씬 팔레트만 변경 · 퍼즐 공정성 무관",
    action: "theme" as const,
    themeId: "sakura",
  },
  {
    id: "theme_night_jazz",
    title: "야간 재즈 테마",
    blurb: "로비 야간 톤",
    action: "theme" as const,
    themeId: "night_jazz",
  },
];

/** 실결제 없음 — 로컬 entitlements / 소장만 갱신 */
export function ShopPlaceholderScreen() {
  useResetDocumentScrollOnMount();
  const { lightTap } = useGameFeedback();
  const bm = useAppStore((s) => s.bm);
  const ownedProductIds = useAppStore((s) => s.ownedProductIds);
  const cosmetics = useAppStore((s) => s.cosmetics);
  const patchBm = useAppStore((s) => s.patchBm);
  const grantPlaceholderProduct = useAppStore((s) => s.grantPlaceholderProduct);
  const equipThemeIfOwned = useAppStore((s) => s.equipThemeIfOwned);
  const patchPlayerResources = useAppStore((s) => s.patchPlayerResources);

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Shop
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-coffee-900">
            작은 지원과 꾸밈
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            웹 우선 상점(데모)이에요. 실제 결제는 연결하지 않았고, 버튼으로만
            저장 데이터를 채워 둡니다. 퍼즐 공정성은 건드리지 않아요.
          </p>
        </header>

        <Card className="mb-4 space-y-2 border border-coffee-600/8 bg-cream-50/95 p-4 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            나의 보유
          </div>
          <p className="text-sm text-coffee-800">
            광고 제거: {bm.adFree ? "예" : "아니오"} · 서포터 티어:{" "}
            {bm.supporterTier}
          </p>
          <p className="text-sm text-coffee-800">
            장착 테마:{" "}
            <span className="font-semibold tabular-nums">
              {cosmetics.equippedThemeId}
            </span>
          </p>
          <p className="text-xs text-coffee-600/70">
            소장 테마: {cosmetics.ownedThemeIds.join(", ")}
          </p>
        </Card>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          감성 소비 · 데모
        </p>
        <ul className="space-y-3">
          {PRODUCTS.map((p) => {
            const owned = ownedProductIds.includes(p.id);
            return (
              <li key={p.id}>
                <Card className="border border-coffee-600/8 bg-cream-50/95 p-4 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-coffee-900">
                        {p.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-coffee-700">
                        {p.blurb}
                      </p>
                      {owned ? (
                        <p className="mt-2 text-xs font-semibold text-accent-soft">
                          담아 둠 · 로컬 저장
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="soft"
                      className="shrink-0"
                      disabled={owned}
                      onClick={() => {
                        lightTap();
                        if (p.action === "adFree") {
                          grantPlaceholderProduct({ productId: p.id });
                          patchBm({ adFree: true });
                        } else if (p.action === "starter") {
                          grantPlaceholderProduct({ productId: p.id });
                          patchPlayerResources({ coins: 200, beans: 20 });
                        } else if (p.action === "theme" && p.themeId) {
                          grantPlaceholderProduct({
                            productId: p.id,
                            unlockThemeIds: [p.themeId],
                          });
                          equipThemeIfOwned(p.themeId);
                        }
                      }}
                    >
                      {owned ? "보유" : "데모로 담기"}
                    </Button>
                  </div>
                  {p.action === "theme" && p.themeId && cosmetics.ownedThemeIds.includes(p.themeId) ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs"
                        disabled={cosmetics.equippedThemeId === p.themeId}
                        onClick={() => {
                          lightTap();
                          equipThemeIfOwned(p.themeId!);
                        }}
                      >
                        장착
                      </Button>
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-xs text-coffee-600/70">
          <Link href="/lobby" className="font-semibold underline-offset-2 hover:underline">
            로비로
          </Link>
        </p>
      </AppShell>
    </>
  );
}
