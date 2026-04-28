"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { playUiClick } from "@/lib/sfx";

function isDisabledEl(el: Element): boolean {
  if (el instanceof HTMLButtonElement) return el.disabled;
  if (el instanceof HTMLInputElement) return el.disabled;
  if (el instanceof HTMLAnchorElement) return el.getAttribute("aria-disabled") === "true";
  return el.getAttribute("aria-disabled") === "true";
}

export function GlobalUiClickSound() {
  const soundOn = useAppStore((s) => s.settings.soundOn);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastUiClickAt = 0;
    const onActivateCapture = (e: Event) => {
      // 설정 토글 직후에도 리스너를 다시 붙일 필요 없이 즉시 반영
      if (!useAppStore.getState().settings.soundOn) return;

      const target = e.target as Element | null;
      if (!target) return;
      const el = target.closest(
        "button, a, [role='button'], [role='switch'], [data-ui-click]",
      );
      if (!el) return;
      if (el.closest("[data-no-ui-click='true']")) return;
      if (isDisabledEl(el)) return;
      const now = Date.now();
      if (now - lastUiClickAt < 55) return;
      lastUiClickAt = now;
      playUiClick();
    };

    window.addEventListener("pointerdown", onActivateCapture, true);
    window.addEventListener("touchstart", onActivateCapture, true);
    // 일부 환경에서 pointer/touch가 누락되는 케이스를 보완
    window.addEventListener("click", onActivateCapture, true);
    // 키보드 활성화(Enter/Space)도 UI 클릭으로 취급
    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      onActivateCapture(e);
    };
    window.addEventListener("keydown", onKeyDownCapture, true);

    return () => {
      window.removeEventListener("pointerdown", onActivateCapture, true);
      window.removeEventListener("touchstart", onActivateCapture, true);
      window.removeEventListener("click", onActivateCapture, true);
      window.removeEventListener("keydown", onKeyDownCapture, true);
    };
  }, [soundOn]);

  return null;
}

