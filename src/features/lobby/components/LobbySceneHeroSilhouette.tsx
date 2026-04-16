"use client";

import { cn } from "@/lib/utils";

/**
 * 단일 히어로 실루엣 — 배경 이미지가 들어오기 전에도 ‘한 장면’으로 읽히게 함.
 * 테마별 틴트만 조정.
 */
export function LobbySceneHeroSilhouette({ themeId }: { themeId: string }) {
  const tint =
    themeId === "night_jazz"
      ? "text-violet-200/25"
      : themeId === "sakura"
        ? "text-rose-300/30"
        : "text-coffee-700/20";

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", tint)}
      viewBox="0 0 400 300"
      fill="currentColor"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* 카운터대 */}
      <path
        opacity={0.9}
        d="M40 210 L360 210 L360 255 L40 255 Z"
        fill="url(#hero-fade)"
      />
      {/* 쇼케이스 유리 느낌 */}
      <path
        opacity={0.55}
        d="M230 125 L360 125 L360 200 L230 200 Z"
        fill="currentColor"
      />
      {/* 로스터 실루엣 */}
      <path
        opacity={0.7}
        d="M55 115 L115 115 L120 195 L50 195 Z"
        fill="currentColor"
      />
      <ellipse cx="85" cy="110" rx="28" ry="12" opacity={0.5} />
      {/* 창 / 빛 */}
      <path
        opacity={0.15}
        d="M140 40 L260 40 L250 100 L150 100 Z"
        fill="currentColor"
      />
    </svg>
  );
}
