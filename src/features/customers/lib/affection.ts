import type { CustomerProfile, CustomerRuntimeState } from "@/features/customers/types";

export const REGULAR_AFFECTION_THRESHOLD = 12;

export function computeIsRegular(affection: number): boolean {
  return affection >= REGULAR_AFFECTION_THRESHOLD;
}

export function clampStoryIndex(
  profile: CustomerProfile,
  affection: number,
): number {
  // 해금 기준을 만족하는 마지막 step index를 반환 (최소 0)
  let idx = 0;
  for (let i = 0; i < profile.storySteps.length; i += 1) {
    if (affection >= profile.storySteps[i].unlockAtAffection) idx = i;
  }
  return idx;
}

export function nextRuntimeStateOnAffectionGain(input: {
  profile: CustomerProfile;
  prev: CustomerRuntimeState;
  gainedAffection: number;
  nowMs: number;
}): CustomerRuntimeState {
  const affection = Math.max(0, input.prev.affection + input.gainedAffection);
  return {
    affection,
    isRegular: computeIsRegular(affection),
    storyIndex: Math.max(
      input.prev.storyIndex,
      clampStoryIndex(input.profile, affection),
    ),
    lastAffectionAtMs: input.nowMs,
  };
}

