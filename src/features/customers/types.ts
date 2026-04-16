import type { DrinkMenuId } from "@/features/meta/types/gameState";

export type CustomerId = string;

export type CustomerTag =
  | "quiet"
  | "regular"
  | "sweet_tooth"
  | "espresso_lover"
  | "late_night";

export type CustomerStoryStep = {
  /** 고유 노드 id (콘텐츠 확장 대비) */
  id: string;
  /** 짧은 제목 */
  title: string;
  /** 해금 기준(애정도 누적) — MVP에서는 0/몇 단계만 사용 */
  unlockAtAffection: number;
};

export type CustomerProfile = {
  id: CustomerId;
  name: string;
  tags: CustomerTag[];
  preferredMenus: DrinkMenuId[];
  /** 초기 애정도(세이브/밸런스) */
  baseAffection: number;
  /** 스토리 단계(최소 2개) */
  storySteps: CustomerStoryStep[];
};

export type CustomerRuntimeState = {
  affection: number;
  /** 단골 여부(애정도 임계치 기반) */
  isRegular: boolean;
  /** 현재 해금된 스토리 단계 index (0..n-1) */
  storyIndex: number;
  /** 마지막 판매로 애정도 갱신 시각 */
  lastAffectionAtMs: number;
};

