import type { LobbyHotspotId } from "@/features/lobby/config/lobbyHotspots";
import { lobbySceneClass } from "@/features/lobby/lib/lobbyThemeStyles";

/** 핫존 주변 은은한 글로우(이미지 없을 때) */
export type LobbyHotspotVisualHint = {
  idleGlow?: boolean;
};

/**
 * 테마별 로비 씬 정의(저장 불필요).
 * 배경 이미지는 optional — 없으면 그라데이션 + 실루엣만 사용.
 */
export type LobbySceneDefinition = {
  themeId: string;
  backgroundGradientClass: string;
  /** public 경로 이미지가 생기면 설정 */
  backgroundImageSrc?: string;
  backgroundImagePosition?: string;
  /** 상단·하단 비네트 */
  vignetteTopClass: string;
  vignetteBottomClass: string;
  hotspotVisuals: Partial<Record<LobbyHotspotId, LobbyHotspotVisualHint>>;
};

export function getLobbySceneDefinition(themeId: string): LobbySceneDefinition {
  return {
    themeId,
    backgroundGradientClass: lobbySceneClass(themeId),
    vignetteTopClass:
      "bg-gradient-to-b from-coffee-900/15 via-transparent to-transparent",
    vignetteBottomClass:
      "bg-gradient-to-t from-coffee-900/20 via-transparent to-transparent",
    hotspotVisuals: {
      roast: { idleGlow: true },
      showcase: { idleGlow: true },
      counter: { idleGlow: true },
      puzzle: { idleGlow: true },
    },
  };
}
