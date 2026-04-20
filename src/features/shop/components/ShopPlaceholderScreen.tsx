"use client";

import { AppShell } from "@/components/layout/AppShell";
import { LobbyReturnButton } from "@/components/navigation/LobbyReturnButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { puzzleSkinsByKind } from "@/features/meta/cosmetics/puzzleSkins";
import { normalizeAccountLevelState } from "@/features/meta/progression/missionEngine";
import type {
  PuzzleSkinDefinition,
  PuzzleSkinId,
} from "@/features/meta/types/gameState";
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
  const coins = useAppStore((s) => s.playerResources.coins);
  const account = normalizeAccountLevelState(useAppStore((s) => s.accountLevel));
  const ownedProductIds = useAppStore((s) => s.ownedProductIds);
  const cosmetics = useAppStore((s) => s.cosmetics);
  const patchBm = useAppStore((s) => s.patchBm);
  const grantPlaceholderProduct = useAppStore((s) => s.grantPlaceholderProduct);
  const equipThemeIfOwned = useAppStore((s) => s.equipThemeIfOwned);
  const patchPlayerResources = useAppStore((s) => s.patchPlayerResources);
  const purchasePuzzleSkin = useAppStore((s) => s.purchasePuzzleSkin);
  const equipPuzzleSkin = useAppStore((s) => s.equipPuzzleSkin);

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
          2048 스킨
        </p>
        <Card className="mb-4 space-y-4 border border-coffee-600/8 bg-cream-50/95 p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-coffee-900">
                퍼즐 감성 바꾸기
              </div>
              <p className="mt-1 text-xs leading-relaxed text-coffee-700">
                코인으로 보드와 블록 스킨을 담고 바로 장착해요.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-cream-200/70 px-3 py-1.5 text-sm font-bold tabular-nums text-coffee-900 ring-1 ring-coffee-600/8">
              <CoinIcon size={17} className="opacity-95" />
              {coins}
            </div>
          </div>
          <SkinShopGroup
            title="배경 스킨"
            skins={puzzleSkinsByKind("background")}
            accountLevel={account.level}
            coins={coins}
            ownedIds={cosmetics.ownedPuzzleSkinIds}
            equippedId={cosmetics.equippedPuzzleBackgroundSkinId}
            onBuy={(id) => {
              lightTap();
              purchasePuzzleSkin(id);
            }}
            onEquip={(id) => {
              lightTap();
              equipPuzzleSkin(id);
            }}
          />
          <SkinShopGroup
            title="블록 스킨"
            skins={puzzleSkinsByKind("blocks")}
            accountLevel={account.level}
            coins={coins}
            ownedIds={cosmetics.ownedPuzzleSkinIds}
            equippedId={cosmetics.equippedPuzzleBlockSkinId}
            onBuy={(id) => {
              lightTap();
              purchasePuzzleSkin(id);
            }}
            onEquip={(id) => {
              lightTap();
              equipPuzzleSkin(id);
            }}
          />
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

        <LobbyReturnButton />
      </AppShell>
    </>
  );
}

function SkinShopGroup({
  title,
  skins,
  accountLevel,
  coins,
  ownedIds,
  equippedId,
  onBuy,
  onEquip,
}: {
  title: string;
  skins: PuzzleSkinDefinition[];
  accountLevel: number;
  coins: number;
  ownedIds: PuzzleSkinId[];
  equippedId: PuzzleSkinId;
  onBuy: (id: PuzzleSkinId) => void;
  onEquip: (id: PuzzleSkinId) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
        {title}
      </div>
      <ul className="space-y-2">
        {skins.map((skin) => {
          const owned = ownedIds.includes(skin.id);
          const equipped = equippedId === skin.id;
          const levelOk = accountLevel >= skin.requiredLevel;
          const coinOk = coins >= skin.coinCost;
          const canBuy = !owned && levelOk && coinOk;
          const status = owned
            ? equipped
              ? "장착 중"
              : "보유"
            : !levelOk
              ? `Lv.${skin.requiredLevel}`
              : !coinOk
                ? "코인 부족"
                : "구매 가능";
          return (
            <li
              key={skin.id}
              className="rounded-2xl bg-cream-200/50 px-3 py-3 ring-1 ring-coffee-600/6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold text-coffee-900">
                      {skin.title}
                    </div>
                    <span className="rounded-full bg-cream-50/80 px-2 py-0.5 text-[10px] font-bold text-coffee-700 ring-1 ring-coffee-600/8">
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-coffee-700">
                    {skin.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  {!owned ? (
                    <Button
                      type="button"
                      variant={canBuy ? "soft" : "ghost"}
                      className="h-10 min-h-0 px-3 text-xs"
                      disabled={!canBuy}
                      onClick={() => onBuy(skin.id)}
                    >
                      <span className="inline-flex items-center gap-1">
                        <CoinIcon size={14} className="opacity-95" />
                        {skin.coinCost}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant={equipped ? "ghost" : "soft"}
                      className="h-10 min-h-0 px-3 text-xs"
                      disabled={equipped}
                      onClick={() => onEquip(skin.id)}
                    >
                      {equipped ? "장착" : "장착하기"}
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
