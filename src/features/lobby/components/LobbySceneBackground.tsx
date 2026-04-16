"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LobbySceneDefinition } from "@/features/lobby/config/lobbySceneDefinition";

type Props = {
  definition: LobbySceneDefinition;
};

/** L0 배경 + 선택적 이미지 + 비네트 */
export function LobbySceneBackground({ definition }: Props) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b",
          definition.backgroundGradientClass,
        )}
      />
      {definition.backgroundImageSrc ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={definition.backgroundImageSrc}
            alt=""
            fill
            className="object-cover"
            style={{
              objectPosition: definition.backgroundImagePosition ?? "50% 50%",
            }}
            sizes="(max-width: 448px) 100vw, 448px"
            priority={false}
          />
        </div>
      ) : null}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          definition.vignetteTopClass,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          definition.vignetteBottomClass,
        )}
      />
    </>
  );
}
