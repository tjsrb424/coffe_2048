"use client";

import { MotionConfig } from "framer-motion";
import { DevDebugPanel } from "@/components/dev/DevDebugPanel";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionPreference();
  const forceDebug = process.env.NEXT_PUBLIC_ENABLE_DEV_DEBUG === "true";
  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <div className="min-h-[100dvh] w-full">
        {children}
        {(forceDebug || process.env.NODE_ENV !== "production") && <DevDebugPanel />}
      </div>
    </MotionConfig>
  );
}
