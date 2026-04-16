"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** 감성 한 줄 */
  tagline?: string;
  /** 상태 요약(숫자 한 줄) */
  summary?: string;
  /** 시트 내부 상단 설명(선택) */
  description?: string;
};

export function LobbyBottomSheet({
  open,
  title,
  onClose,
  children,
  tagline,
  summary,
  description,
}: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-coffee-900/35 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <motion.div
        initial={reduce ? false : { y: 28, opacity: 0.96 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 36 }
        }
        className={cn(
          "relative mx-auto mb-[max(0.5rem,env(safe-area-inset-bottom))] w-full max-w-md",
          "max-h-[min(78vh,32rem)] overflow-hidden rounded-3xl border border-white/40",
          "bg-cream-50/95 shadow-lift ring-1 ring-coffee-600/10 backdrop-blur-md",
        )}
      >
        <div className="flex max-h-[min(78vh,32rem)] flex-col">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-coffee-600/10 px-4 py-3">
            <div className="min-w-0 pr-2">
              <h2 className="text-base font-bold text-coffee-900">{title}</h2>
              {tagline ? (
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-accent-soft/95">
                  {tagline}
                </p>
              ) : null}
              {summary ? (
                <p className="mt-1 text-sm font-semibold tabular-nums text-coffee-800">
                  {summary}
                </p>
              ) : null}
              {description ? (
                <p className="mt-1 text-xs leading-relaxed text-coffee-600/75">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-1.5 text-sm font-semibold text-coffee-600/80 hover:bg-cream-200/80 hover:text-coffee-900"
            >
              닫기
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
