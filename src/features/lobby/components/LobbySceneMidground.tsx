"use client";

import { LobbySceneHeroSilhouette } from "./LobbySceneHeroSilhouette";

/** L1 가구·실루엣 레이어 — 이후 스프라이트/오브젝트 이미지로 교체 용이 */
export function LobbySceneMidground({ themeId }: { themeId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <LobbySceneHeroSilhouette themeId={themeId} />
    </div>
  );
}
