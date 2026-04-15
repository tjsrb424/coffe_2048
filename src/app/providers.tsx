"use client";

import { MotionConfig } from "framer-motion";
import { GlobalBgm } from "@/components/audio/GlobalBgm";
import { GlobalCafeSellToast } from "@/components/economy/GlobalCafeSellToast";
import { useHeartRegenTicker } from "@/hooks/useHeartRegenTicker";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionPreference();
  useHeartRegenTicker();

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <GlobalBgm />
      <GlobalCafeSellToast />
      {children}
    </MotionConfig>
  );
}

