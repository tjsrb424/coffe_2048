"use client";

import { MotionConfig } from "framer-motion";
import { FadeSlide } from "@/components/motion/FadeSlide";
import { DevDebugPanel } from "@/components/dev/DevDebugPanel";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionPreference();
  const forceDebug = process.env.NEXT_PUBLIC_ENABLE_DEV_DEBUG === "true";
  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <FadeSlide>
        {children}
        {(forceDebug || process.env.NODE_ENV !== "production") && <DevDebugPanel />}
      </FadeSlide>
    </MotionConfig>
  );
}
