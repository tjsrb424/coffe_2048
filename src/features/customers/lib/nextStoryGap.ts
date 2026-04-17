import type { CustomerProfile } from "@/features/customers/types";

/**
 * 다음 스토리 단계 해금에 필요한 애정이 더 필요한 경우, 그만큼의 남은 수치.
 * 현재 애정이 곧 다음 임계치 미만이면 (임계치 - 현재)을 반환.
 * 더 열 임계치가 없으면 null.
 */
export function affectionRemainingToNextStoryUnlock(
  profile: CustomerProfile,
  currentAffection: number,
): number | null {
  const thresholds = profile.storySteps.map((s) => s.unlockAtAffection);
  const above = thresholds.filter((t) => t > currentAffection);
  if (above.length === 0) return null;
  return Math.min(...above) - currentAffection;
}
