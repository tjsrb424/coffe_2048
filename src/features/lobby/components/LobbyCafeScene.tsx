"use client";

import { cn } from "@/lib/utils";
import { LOBBY_HOTSPOTS } from "@/features/lobby/config/lobbyHotspots";
import type { LobbyHotspotConfig } from "@/features/lobby/config/lobbyHotspots";
import { getLobbySceneDefinition } from "@/features/lobby/config/lobbySceneDefinition";
import { LobbyAmbientCustomers } from "./LobbyAmbientCustomers";
import { LobbyHotspotLayer } from "./LobbyHotspotLayer";
import { LobbySceneBackground } from "./LobbySceneBackground";
import { LobbySceneMidground } from "./LobbySceneMidground";

type Props = {
  themeId: string;
  purchasePulse: number;
  purchaseKind: "online" | "offline";
  /** 로비 메인 조작을 카드형으로 전환할 때: 핫존 오버레이를 끈다 */
  enableHotspots?: boolean;
  pulseHotspotIds?: Partial<Record<LobbyHotspotConfig["id"], boolean>>;
  hotspotStatusChips?: Partial<Record<LobbyHotspotConfig["id"], string>>;
  onHotspot?: (hotspot: LobbyHotspotConfig) => void;
};

/** 고정 카메라 비율의 카페 디오라마 + 핫존 — 레이어: Background → Midground → FX → Hotspot */
export function LobbyCafeScene({
  themeId,
  purchasePulse,
  purchaseKind,
  enableHotspots = true,
  pulseHotspotIds,
  hotspotStatusChips,
  onHotspot,
}: Props) {
  const definition = getLobbySceneDefinition(themeId);

  return (
    <div
      className={cn(
        "relative mx-auto mb-4 w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-coffee-600/10",
        "aspect-[4/3] shadow-card",
      )}
    >
      <LobbySceneBackground definition={definition} />
      <LobbySceneMidground themeId={themeId} />

      <div className="pointer-events-none absolute inset-x-0 top-[8%] flex justify-center">
        <LobbyAmbientCustomers
          className="h-24 w-[88%] max-w-sm opacity-90"
          density={3}
          purchasePulse={purchasePulse}
          purchaseKind={purchaseKind}
        />
      </div>

      {enableHotspots ? (
        <LobbyHotspotLayer
          hotspots={LOBBY_HOTSPOTS}
          themeId={themeId}
          pulseIds={pulseHotspotIds}
          hotspotVisuals={definition.hotspotVisuals}
          statusChips={hotspotStatusChips}
          onActivate={(h) => onHotspot?.(h)}
        />
      ) : null}
    </div>
  );
}
