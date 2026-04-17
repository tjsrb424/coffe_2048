"use client";

import { useEffect } from "react";

/**
 * 세그먼트 오류 시 표시. Next.js App Router에서 권장되는 error boundary.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-5 px-6 pb-16 pt-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-coffee-600/60">
        문제가 생겼어요
      </p>
      <p className="text-sm leading-relaxed text-coffee-800">
        잠깐 멈췄어요. 다시 시도하거나 페이지를 새로고침해 주세요.
      </p>
      {error.digest ? (
        <p className="text-[10px] tabular-nums text-coffee-600/50">
          ref: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-2xl bg-cream-200 px-5 py-2.5 text-sm font-semibold text-coffee-900 ring-1 ring-coffee-600/15 hover:bg-cream-300"
      >
        다시 시도
      </button>
    </div>
  );
}
