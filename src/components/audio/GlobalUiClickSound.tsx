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
    if (!soundOn) return;

    let lastUiClickAt = 0;
    const onActivateCapture = (e: Event) => {
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
    return () => {
      window.removeEventListener("pointerdown", onActivateCapture, true);
      window.removeEventListener("touchstart", onActivateCapture, true);
    };
  }, [soundOn]);

  return null;
}

