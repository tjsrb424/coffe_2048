"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import { CAFE_ECONOMY, MENU_ORDER } from "@/features/meta/balance/cafeEconomy";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import type { LobbySheetId } from "@/features/lobby/config/lobbyHotspots";
import {
  LOBBY_SHEET_BODY_INTRO,
  LOBBY_SHEET_DESCRIPTION,
  LOBBY_SHEET_TAGLINE,
  LOBBY_SHEET_TITLE,
} from "@/features/lobby/config/lobbySheetCopy";
import { buildLobbySheetSummary } from "@/features/lobby/lib/lobbySheetSummary";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/stores/useAppStore";
import {
  CafeLoopSection,
  type CafeLoopSectionKey,
} from "./CafeLoopSection";
import { LastRunCard } from "./LastRunCard";
import { LobbyBottomSheet } from "./LobbyBottomSheet";
import { CafeSellPulseCard } from "./CafeSellPulseCard";
import { LobbyMainCard } from "./LobbyMainCard";
import { OfflineSalesCard } from "./OfflineSalesCard";
import { ResourceBar } from "./ResourceBar";

type OpenSheet = {
  sheet: LobbySheetId;
  cafeSections?: CafeLoopSectionKey[];
} | null;

export function LobbyScreen() {
  useResetDocumentScrollOnMount();
  const searchParams = useSearchParams();
  const lobbyOnboardingSeen = useAppStore(
    (s) => s.settings?.lobbyOnboardingSeen ?? false,
  );
  const patchSettings = useAppStore((s) => s.patchSettings);
  const playerResources = useAppStore((s) => s.playerResources);
  const puzzleProgress = useAppStore((s) => s.puzzleProgress);
  const cafeState = useAppStore((s) => s.cafeState);

  const [open, setOpen] = useState<OpenSheet>(null);

  useEffect(() => {
    if (searchParams.get("panel") === "cafe") {
      setOpen({ sheet: "showcase", cafeSections: ["craft", "display"] });
      if (typeof window !== "undefined") {
        const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
          /\/$/,
          "",
        );
        window.history.replaceState(null, "", `${base}/lobby/`);
      }
    }
  }, [searchParams]);

  const openSheet = useCallback(
    (sheet: LobbySheetId, cafeSections?: CafeLoopSectionKey[]) =>
      setOpen({ sheet, cafeSections }),
    [],
  );

  const closeSheet = useCallback(() => setOpen(null), []);

  const title = open ? LOBBY_SHEET_TITLE[open.sheet] : "";
  const tagline = open ? LOBBY_SHEET_TAGLINE[open.sheet] : undefined;
  const description = open ? LOBBY_SHEET_DESCRIPTION[open.sheet] : undefined;

  const summary = useMemo(() => {
    if (!open) return "";
    return buildLobbySheetSummary(open.sheet, {
      playerResources,
      puzzleProgress,
      cafeState,
    });
  }, [open, playerResources, puzzleProgress, cafeState]);

  const menuTotalStock = useMemo(
    () =>
      cafeState.menuStock.americano +
      cafeState.menuStock.latte +
      cafeState.menuStock.affogato,
    [cafeState.menuStock],
  );

  const craftableHint = useMemo(() => {
    const beans = playerResources.beans;
    const shots = cafeState.espressoShots;
    for (const id of MENU_ORDER) {
      const r = CAFE_ECONOMY.recipe[id];
      if (shots >= r.shots && beans >= r.beans) return "제작 가능";
    }
    return shots < 1 ? "베이스 부족" : "자원 부족";
  }, [cafeState.espressoShots, playerResources.beans]);

  return (
    <>
      <AppShell>
        <header className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="relative h-14 w-[240px] sm:h-16 sm:w-[280px]">
              <Image
                src="/images/brand/cafe-2048-title-2.png"
                alt="Cafe 2048"
                fill
                priority
                sizes="280px"
                className="object-contain"
              />
            </div>
            <h1 className="sr-only">오늘의 매장</h1>
          </div>
          <nav className="flex shrink-0 justify-end gap-1.5 text-[11px] font-semibold text-coffee-700">
            <Link
              href="/settings"
              className="rounded-full bg-cream-200/80 px-2.5 py-1 ring-1 ring-coffee-600/10 hover:bg-cream-200"
            >
              설정
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-cream-200/80 px-2.5 py-1 ring-1 ring-coffee-600/10 hover:bg-cream-200"
            >
              상점
            </Link>
            <Link
              href="/menu"
              className="rounded-full bg-cream-200/80 px-2.5 py-1 ring-1 ring-coffee-600/10 hover:bg-cream-200"
            >
              메뉴
            </Link>
          </nav>
        </header>

        {!lobbyOnboardingSeen ? (
          <div className="mb-2 flex items-start gap-2 rounded-2xl bg-cream-200/50 px-3 py-2.5 ring-1 ring-accent-soft/25">
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-coffee-800">
              아래 카드에서 로스터·쇼케이스·카운터·퍼즐을 바로 열 수 있어요.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="shrink-0 px-2 py-1 text-xs"
              onClick={() => patchSettings({ lobbyOnboardingSeen: true })}
            >
              알겠어요
            </Button>
          </div>
        ) : null}

        <ResourceBar variant="compact" />

        <LobbyOpsDashboard
          beans={playerResources.beans}
          hearts={playerResources.hearts}
          bestTile={puzzleProgress.bestTile}
          shots={cafeState.espressoShots}
          menuTotalStock={menuTotalStock}
          autoSellIntervalMs={getCafeRuntimeModifiers(cafeState).autoSellIntervalMs}
          craftHint={craftableHint}
          lastOfflineCoins={cafeState.lastOfflineSaleCoins}
          onOpenRoast={() => openSheet("roast", ["roast"])}
          onOpenShowcase={() => openSheet("showcase", ["craft", "display"])}
          onOpenCounter={() => openSheet("counter")}
          onOpenPuzzle={() => openSheet("puzzle")}
        />
      </AppShell>

      <LobbyBottomSheet
        open={open !== null}
        title={title}
        tagline={tagline}
        summary={summary}
        description={description}
        onClose={closeSheet}
      >
        {open?.sheet === "roast" && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-coffee-800">
              {LOBBY_SHEET_BODY_INTRO.roast}
            </p>
            <CafeLoopSection sections={open.cafeSections ?? ["roast"]} />
          </>
        )}
        {open?.sheet === "showcase" && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-coffee-800">
              {LOBBY_SHEET_BODY_INTRO.showcase}
            </p>
            <CafeLoopSection
              sections={open.cafeSections ?? ["craft", "display"]}
            />
          </>
        )}
        {open?.sheet === "counter" && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-coffee-800">
              {LOBBY_SHEET_BODY_INTRO.counter}
            </p>
            {menuTotalStock === 0 ? (
              <Card className="mb-4 border border-accent-soft/25 bg-cream-50/95 p-4 ring-1 ring-coffee-600/8">
                <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
                  진열이 비어 있어요
                </div>
                <p className="mt-2 text-sm leading-relaxed text-coffee-800">
                  손님이 가져갈 잔이 없으면 코인이 들어오지 않아요. 쇼케이스에서
                  메뉴를 먼저 만들어 주세요.
                </p>
                <Link
                  href="/lobby?panel=cafe"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-cream-200/90 px-3 py-2.5 text-center text-xs font-semibold text-coffee-900 ring-1 ring-accent-soft/30 hover:bg-cream-200"
                  onClick={closeSheet}
                >
                  쇼케이스에서 메뉴 만들기
                </Link>
              </Card>
            ) : null}
            <div className="space-y-4">
              <CafeSellPulseCard />
              <OfflineSalesCard />
              <LastRunCard />
            </div>
          </>
        )}
        {open?.sheet === "puzzle" && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-coffee-800">
              {LOBBY_SHEET_BODY_INTRO.puzzle}
            </p>
            <LobbyMainCard onBeforeNavigateToPuzzle={closeSheet} />
          </>
        )}
        {open && open.sheet !== "puzzle" ? (
          <p className="mt-4 text-center text-xs text-coffee-600/70">
            <Link
              href="/cafe"
              className="font-semibold underline-offset-2 hover:underline"
              onClick={closeSheet}
            >
              카페(스크롤형 운영)
            </Link>
            에서도 같은 작업을 할 수 있어요.
          </p>
        ) : null}
      </LobbyBottomSheet>
    </>
  );
}

function LobbyOpsDashboard({
  beans,
  hearts,
  bestTile,
  shots,
  menuTotalStock,
  autoSellIntervalMs,
  craftHint,
  lastOfflineCoins,
  onOpenRoast,
  onOpenShowcase,
  onOpenCounter,
  onOpenPuzzle,
}: {
  beans: number;
  hearts: number;
  bestTile: number;
  shots: number;
  menuTotalStock: number;
  autoSellIntervalMs: number;
  craftHint: string;
  lastOfflineCoins: number;
  onOpenRoast: () => void;
  onOpenShowcase: () => void;
  onOpenCounter: () => void;
  onOpenPuzzle: () => void;
}) {
  const sellSec = (autoSellIntervalMs / 1000).toFixed(1);
  const showcaseStatus =
    menuTotalStock > 0 ? `진열 ${menuTotalStock}잔` : `진열 0잔 · ${craftHint}`;
  const counterStatus =
    menuTotalStock > 0
      ? `판매 주기 ${sellSec}s`
      : `진열 0잔 · 쇼케이스로 복구`;
  const offline =
    lastOfflineCoins > 0 ? `직전 오프라인 +${lastOfflineCoins}코인` : "오늘 기록 없음";

  return (
    <section className="mb-1">
      <div className="grid grid-cols-2 gap-3">
        <Card className="col-span-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
                퍼즐
              </div>
              <p className="mt-2 text-sm font-semibold text-coffee-900">
                하트 {hearts} · 베스트 타일 {bestTile}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
                원두를 모으러 한 판 들어가요.
              </p>
            </div>
            <Button type="button" variant="soft" className="h-10" onClick={onOpenPuzzle}>
              퍼즐 하기
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            로스터
          </div>
          <p className="mt-2 text-sm font-semibold text-coffee-900">
            원두 {beans}단 · 베이스 {shots}샷
          </p>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
            원두를 샷으로 바꿔 제작 준비를 해요.
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 h-10 w-full text-xs font-semibold text-coffee-900"
            onClick={onOpenRoast}
          >
            로스터 열기
          </Button>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            쇼케이스
          </div>
          <p className="mt-2 text-sm font-semibold text-coffee-900">{showcaseStatus}</p>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
            가능한 카드부터 눌러 재고를 채워요.
          </p>
          <Button
            type="button"
            variant="soft"
            className="mt-3 h-10 w-full text-xs font-semibold"
            onClick={onOpenShowcase}
          >
            메뉴 제작
          </Button>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            카운터
          </div>
          <p className="mt-2 text-sm font-semibold text-coffee-900">{counterStatus}</p>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">{offline}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 h-10 w-full text-xs font-semibold text-coffee-900"
            onClick={onOpenCounter}
          >
            카운터 보기
          </Button>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            안내
          </div>
          <p className="mt-2 text-sm font-semibold text-coffee-900">
            {menuTotalStock > 0 ? "자동 판매 진행 중" : "진열이 비어 있어요"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-coffee-700/80">
            {menuTotalStock > 0
              ? `약 ${sellSec}s마다 한 잔씩 조용히 나가요.`
              : "쇼케이스에서 1잔만 만들어도 바로 팔리기 시작해요."}
          </p>
        </Card>
      </div>
    </section>
  );
}
