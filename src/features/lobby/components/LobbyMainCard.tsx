"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/locale/i18n";
import { useAppStore } from "@/stores/useAppStore";
import { useGameFeedback } from "@/hooks/useGameFeedback";

export function LobbyMainCard({
  onBeforeNavigateToPuzzle,
}: {
  /** 퍼즐로 떠나기 직전(예: 로비 시트 닫기) */
  onBeforeNavigateToPuzzle?: () => void;
} = {}) {
  const router = useRouter();
  const cafe = useAppStore((s) => s.cafeState);
  const beans = useAppStore((s) => s.playerResources.beans);
  const hearts = useAppStore((s) => s.playerResources.hearts);
  const consumeHeart = useAppStore((s) => s.consumePuzzleHeart);
  const { lightTap } = useGameFeedback();
  const reduceMotion = useReducedMotion();

  return (
    <Card className="relative mb-5 overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-soft/20 blur-2xl"
        animate={
          reduceMotion ? { opacity: 0.6 } : { opacity: [0.45, 0.75, 0.45] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
          {t("lobby.mainCard.kicker")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-coffee-900">
          {t("lobby.mainCard.shopLevel", { level: cafe.cafeLevel })}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-coffee-700">
          {t("lobby.mainCard.summary", { beans })}
        </p>
        <div className="mt-5">
          <Button
            type="button"
            className="w-full"
            disabled={hearts <= 0}
            onClick={() => {
              lightTap();
              if (!consumeHeart()) return;
              onBeforeNavigateToPuzzle?.();
              // 퍼즐 진입은 BGM이 감성적으로 페이드아웃되도록 살짝 텀을 둠
              window.dispatchEvent(
                new CustomEvent("coffee:request-bgm-fadeout", { detail: { ms: 1200 } }),
              );
              router.push("/puzzle");
            }}
          >
            {t("lobby.mainCard.cta")}
          </Button>
          {hearts <= 0 && (
            <p className="mt-2 text-center text-xs text-coffee-600/70">
              {t("lobby.mainCard.heartsEmpty")}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
