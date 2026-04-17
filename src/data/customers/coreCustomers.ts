import type { CustomerProfile } from "@/features/customers/types";

/**
 * 핵심 손님(스토리/선호/개성이 강한 손님).
 * - 이름/소개/스토리 제목은 메시지 id로만 연결한다.
 * - 콘텐츠를 직접 다루기 쉽게, 여기서는 수동으로 관리한다.
 */
export const CORE_CUSTOMERS: CustomerProfile[] = [
  {
    id: "han_eun",
    nameTextId: "customer.han_eun.name",
    introTextId: "customer.han_eun.intro",
    tags: ["quiet", "espresso_lover"],
    preferredMenus: ["americano"],
    baseAffection: 0,
    storySteps: [
      {
        id: "han_eun_1",
        titleTextId: "customer.han_eun.story.step1",
        unlockAtAffection: 0,
      },
      {
        id: "han_eun_2",
        titleTextId: "customer.han_eun.story.step2",
        unlockAtAffection: 6,
      },
    ],
  },
  {
    id: "hyo_im",
    nameTextId: "customer.hyo_im.name",
    introTextId: "customer.hyo_im.intro",
    tags: ["sweet_tooth"],
    preferredMenus: ["affogato", "latte"],
    baseAffection: 1,
    storySteps: [
      {
        id: "hyo_im_1",
        titleTextId: "customer.hyo_im.story.step1",
        unlockAtAffection: 0,
      },
      {
        id: "hyo_im_2",
        titleTextId: "customer.hyo_im.story.step2",
        unlockAtAffection: 8,
      },
    ],
  },
  {
    id: "seo_jun",
    nameTextId: "customer.seo_jun.name",
    introTextId: "customer.seo_jun.intro",
    tags: ["late_night"],
    preferredMenus: ["latte"],
    baseAffection: 0,
    storySteps: [
      {
        id: "seo_jun_1",
        titleTextId: "customer.seo_jun.story.step1",
        unlockAtAffection: 0,
      },
      {
        id: "seo_jun_2",
        titleTextId: "customer.seo_jun.story.step2",
        unlockAtAffection: 10,
      },
    ],
  },
  {
    id: "so_yeon",
    nameTextId: "customer.so_yeon.name",
    introTextId: "customer.so_yeon.intro",
    tags: ["regular"],
    preferredMenus: ["latte"],
    baseAffection: 0,
    storySteps: [
      {
        id: "so_yeon_1",
        titleTextId: "customer.so_yeon.story.step1",
        unlockAtAffection: 0,
      },
      {
        id: "so_yeon_2",
        titleTextId: "customer.so_yeon.story.step2",
        unlockAtAffection: 7,
      },
    ],
  },
  {
    id: "dong_hyun",
    nameTextId: "customer.dong_hyun.name",
    introTextId: "customer.dong_hyun.intro",
    tags: ["regular", "espresso_lover"],
    preferredMenus: ["americano", "affogato"],
    baseAffection: 0,
    storySteps: [
      {
        id: "dong_hyun_1",
        titleTextId: "customer.dong_hyun.story.step1",
        unlockAtAffection: 0,
      },
      {
        id: "dong_hyun_2",
        titleTextId: "customer.dong_hyun.story.step2",
        unlockAtAffection: 9,
      },
    ],
  },
];

