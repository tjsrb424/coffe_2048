"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useAppStore } from "@/stores/useAppStore";
import { useLobbyFxStore } from "@/stores/useLobbyFxStore";
import { LastRunCard } from "./LastRunCard";
import { LobbyMainCard } from "./LobbyMainCard";
import { LobbyAmbientCustomers } from "./LobbyAmbientCustomers";
import { OfflineSalesCard } from "./OfflineSalesCard";
import { ResourceBar } from "./ResourceBar";
import { publicAssetPath } from "@/lib/publicAssetPath";

export function LobbyScreen() {
  useResetDocumentScrollOnMount();
  const soundOn = useAppStore((s) => s.settings.soundOn);
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);
  const purchasePulse = useLobbyFxStore((s) => s.purchasePulse);
  const purchaseKind = useLobbyFxStore((s) => s.purchaseKind);

  useEffect(() => {
    const audio = new Audio(publicAssetPath("/bgm/lobby.mp3"));
    audio.loop = true;
    audio.preload = "auto";
    const targetVolume = reducedMotion ? 0.22 : 0.28;
    audio.volume = 0;
    let raf = 0;

    const cancelFade = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const fadeTo = (to: number, ms: number, onDone?: () => void) => {
      cancelFade();
      const from = audio.volume;
      const startAt = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startAt) / ms);
        audio.volume = from + (to - from) * t;
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          raf = 0;
          onDone?.();
        }
      };
      raf = requestAnimationFrame(step);
    };

    const start = async () => {
      if (!soundOn) return;
      try {
        await audio.play();
        fadeTo(targetVolume, 900);
      } catch {
        // Chrome/iOS/Safari: 사용자 제스처 전에는 실패할 수 있음
      }
    };

    const onFirstGesture = () => {
      void start();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
    };

    // 1) 즉시 재생 시도 (될 수 있는 브라우저에서는 바로 BGM)
    void start();
    // 2) 실패 대비: 첫 제스처로 재시도
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });
    window.addEventListener("touchstart", onFirstGesture, { passive: true });

    // 설정 토글 반영
    if (!soundOn) {
      fadeTo(0, 250, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    }

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      cancelFade();
      fadeTo(0, 220, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [reducedMotion, soundOn]);

  return (
    <>
      <AppShell>
        <header className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Lobby
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">
            따뜻한 로비
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            퍼즐 한 판이 곧 매장의 온도를 바꿔요. 로스팅·메뉴 제작·진열 판매는
            하단 카페 탭에서 이어가요.
          </p>
        </header>

        <div className="relative mb-5">
          <LobbyAmbientCustomers
            purchasePulse={purchasePulse}
            purchaseKind={purchaseKind}
          />
          <ResourceBar />
        </div>
        <OfflineSalesCard />
        <LastRunCard />
        <LobbyMainCard />
      </AppShell>
      <BottomNav />
    </>
  );
}
