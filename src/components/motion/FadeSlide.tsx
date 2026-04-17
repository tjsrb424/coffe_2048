"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * 라우트 전환용 래퍼.
 * SSR·하이드레이션 직후에도 콘텐츠가 보이도록 `initial={false}`를 쓴다.
 * (initial을 opacity 0으로 두면 클라이언트 JS가 깨지면 화면이 영구 투명으로 남을 수 있음)
 */
export function FadeSlide({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="min-h-[100dvh] w-full"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
