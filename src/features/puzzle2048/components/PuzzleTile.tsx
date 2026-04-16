"use client";

import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { cn } from "@/lib/utils";
import { usePuzzleSessionStore } from "@/features/puzzle2048/store/usePuzzleSessionStore";
import type { PlacedTile } from "../utils/boardToTiles";
import { tileClassForValue, tileFontSize } from "../utils/tileStyle";
import { usePuzzleBoardMetrics } from "./PuzzleBoardMetricsContext";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function PuzzleTile({ tile }: { tile: PlacedTile }) {
  const reduce = useReducedMotionPreference();
  const { side } = usePuzzleBoardMetrics();
  const compact = side > 0 && side < 304;
  const mergeStrength = usePuzzleSessionStore(
    (s) => s.lastMergePulseById[tile.id] ?? 0,
  );
  const shouldPulse = !reduce && mergeStrength > 0;

  return (
    <motion.div
      layout
      layoutId={tile.id}
      initial={reduce ? false : { scale: 0.78, opacity: 0.35, y: 6 }}
      animate={
        shouldPulse
          ? {
              opacity: 1,
              y: 0,
              // “겹침 → 압축 → 팡 → 안정”을 짧게. 고단계일수록 아주 약하게만 더 묵직하게.
              scale: [
                1,
                lerp(0.945, 0.92, mergeStrength),
                lerp(1.04, 1.07, mergeStrength),
                1,
              ],
            }
          : { scale: 1, opacity: 1, y: 0 }
      }
      exit={reduce ? undefined : { scale: 0.9, opacity: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 520, damping: 30, mass: 0.35 },
        // merge 펄스는 layout 이동과 독립적으로 짧게 끊는다.
        scale: shouldPulse
          ? {
              duration: lerp(0.16, 0.2, mergeStrength),
              times: [0, 0.36, 0.74, 1],
              ease: [0.22, 1, 0.36, 1],
            }
          : { type: "spring", stiffness: 520, damping: 30, mass: 0.35 },
        opacity: { type: "spring", stiffness: 520, damping: 34, mass: 0.35 },
        y: { type: "spring", stiffness: 520, damping: 34, mass: 0.35 },
      }}
      style={{
        gridRowStart: tile.r + 1,
        gridColumnStart: tile.c + 1,
      }}
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 select-none items-center justify-center rounded-xl font-bold tabular-nums sm:rounded-2xl",
        tileClassForValue(tile.value),
        tileFontSize(tile.value, compact),
      )}
    >
      {tile.value}
    </motion.div>
  );
}
