import type { CustomerProfile } from "@/features/customers/types";

/**
 * 샘플 손님 3명 (콘텐츠 대량 작성 금지)
 * - 이름/태그/선호 메뉴/기본 애정도/스토리 단계 2개만 제공
 */
export const SAMPLE_CUSTOMERS: CustomerProfile[] = [
  {
    id: "han_eun",
    name: "한은",
    tags: ["quiet", "espresso_lover"],
    preferredMenus: ["americano"],
    baseAffection: 0,
    storySteps: [
      { id: "han_eun_1", title: "창가 자리", unlockAtAffection: 0 },
      { id: "han_eun_2", title: "첫 인사", unlockAtAffection: 6 },
    ],
  },
  {
    id: "min_ji",
    name: "민지",
    tags: ["sweet_tooth"],
    preferredMenus: ["affogato", "latte"],
    baseAffection: 1,
    storySteps: [
      { id: "min_ji_1", title: "달콤한 취향", unlockAtAffection: 0 },
      { id: "min_ji_2", title: "작은 선물", unlockAtAffection: 8 },
    ],
  },
  {
    id: "seo_jun",
    name: "서준",
    tags: ["late_night"],
    preferredMenus: ["latte"],
    baseAffection: 0,
    storySteps: [
      { id: "seo_jun_1", title: "늦은 저녁", unlockAtAffection: 0 },
      { id: "seo_jun_2", title: "단골의 리듬", unlockAtAffection: 10 },
    ],
  },
];

