"use client";

import { Button } from "@/components/ui/Button";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { useAppStore } from "@/stores/useAppStore";

/** 개발 전용 — 프로덕션에서는 렌더만 생략 */
export function LiveOpsDevTools() {
  const { lightTap } = useGameFeedback();
  const pass = useAppStore((s) => s.passProgress);
  const liveOps = useAppStore((s) => s.liveOps);
  const patchPassProgress = useAppStore((s) => s.patchPassProgress);
  const patchLiveOps = useAppStore((s) => s.patchLiveOps);

  if (process.env.NODE_ENV !== "development") return null;

  const bumpPassXp = () => {
    lightTap();
    patchPassProgress({ xp: pass.xp + 120 });
  };

  const togglePremium = () => {
    lightTap();
    patchPassProgress({ premiumUnlocked: !pass.premiumUnlocked });
  };

  const addDemoGuest = () => {
    lightTap();
    if (liveOps.unlockedGuestIds.includes("guest_demo")) return;
    patchLiveOps({
      unlockedGuestIds: [...liveOps.unlockedGuestIds, "guest_demo"],
    });
  };

  const toggleDemoEvent = () => {
    lightTap();
    const id = "event_demo_spring";
    const has = liveOps.activeEventIds.includes(id);
    patchLiveOps({
      activeEventIds: has
        ? liveOps.activeEventIds.filter((x) => x !== id)
        : [...liveOps.activeEventIds, id],
    });
  };

  return (
    <details className="rounded-2xl border border-dashed border-coffee-600/25 bg-cream-100/40 p-3">
      <summary className="cursor-pointer list-none text-xs font-semibold text-coffee-600/80 [&::-webkit-details-marker]:hidden">
        개발자 도구
      </summary>
      <div className="mt-3 space-y-3 border-t border-coffee-600/10 pt-3">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="soft" onClick={bumpPassXp}>
            XP +120
          </Button>
          <Button type="button" variant="ghost" onClick={togglePremium}>
            프리미엄 토글
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="soft" onClick={addDemoGuest}>
            데모 손님
          </Button>
          <Button type="button" variant="ghost" onClick={toggleDemoEvent}>
            데모 이벤트
          </Button>
        </div>
      </div>
    </details>
  );
}
