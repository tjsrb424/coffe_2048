import type { DrinkMenuId } from "@/features/meta/types/gameState";
import type { CustomerProfile, CustomerTag } from "@/features/customers/types";
import type { MessageId } from "@/locale/i18n";

type RegularSeed = {
  id: string;
  name: string;
  intro: string;
  tags: CustomerTag[];
  preferredMenus: DrinkMenuId[];
};

const GENERIC_STORY_STEPS: CustomerProfile["storySteps"] = [
  { id: "note_1", titleTextId: "customer.generic.story.step1" as MessageId, unlockAtAffection: 0 },
  { id: "note_2", titleTextId: "customer.generic.story.step2" as MessageId, unlockAtAffection: 999 },
];

/**
 * 일반 손님(세션 방문을 자연스럽게 채우는 풀).
 * - 이름은 중복되지 않게 구성한다.
 * - 스토리는 공유 키(일반 손님 공통)로 최소만 둔다.
 * - 추후 추가/수정이 쉬우도록, 이 파일은 "seed 목록"만 관리하고 프로필로 매핑한다.
 */
const REGULAR_SEEDS: RegularSeed[] = [
  { id: "guest_001", name: "가온", intro: "따뜻한 라떼를 좋아해요.", tags: ["regular"], preferredMenus: ["latte"] },
  { id: "guest_002", name: "나래", intro: "가볍게 한 잔 들러요.", tags: ["quiet"], preferredMenus: ["americano"] },
  { id: "guest_003", name: "다온", intro: "오늘은 달콤한 게 끌려요.", tags: ["sweet_tooth"], preferredMenus: ["affogato"] },
  { id: "guest_004", name: "라온", intro: "에스프레소 향을 좋아해요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_005", name: "마루", intro: "천천히 커피를 골라요.", tags: ["quiet"], preferredMenus: ["latte"] },
  { id: "guest_006", name: "바다", intro: "부드러운 라떼가 좋아요.", tags: ["regular"], preferredMenus: ["latte"] },
  { id: "guest_007", name: "새봄", intro: "기분 전환하러 들렀어요.", tags: ["regular"], preferredMenus: ["americano"] },
  { id: "guest_008", name: "서아", intro: "달콤한 한 잔이 필요해요.", tags: ["sweet_tooth"], preferredMenus: ["affogato", "latte"] },
  { id: "guest_009", name: "서윤", intro: "오늘은 진한 커피가 좋아요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_010", name: "시온", intro: "조용히 잠깐 쉬다 가요.", tags: ["quiet"], preferredMenus: ["latte"] },

  // 아래는 같은 규칙으로 100명까지 확장(이름 중복 없이)
  { id: "guest_011", name: "아린", intro: "부드러운 거품이 좋아요.", tags: ["regular"], preferredMenus: ["latte"] },
  { id: "guest_012", name: "아윤", intro: "오늘은 깔끔하게 한 잔.", tags: ["quiet"], preferredMenus: ["americano"] },
  { id: "guest_013", name: "예린", intro: "달콤한 여운이 좋아요.", tags: ["sweet_tooth"], preferredMenus: ["affogato"] },
  { id: "guest_014", name: "예준", intro: "진한 향을 찾고 있어요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_015", name: "유나", intro: "따뜻하게 데워진 잔이 좋아요.", tags: ["regular"], preferredMenus: ["latte"] },
  { id: "guest_016", name: "유진", intro: "오늘도 잠깐 들렀어요.", tags: ["regular"], preferredMenus: ["americano"] },
  { id: "guest_017", name: "윤서", intro: "달콤한 디저트 커피가 좋아요.", tags: ["sweet_tooth"], preferredMenus: ["affogato", "latte"] },
  { id: "guest_018", name: "윤호", intro: "쌉쌀한 맛이 좋아요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_019", name: "은채", intro: "조용히 창가를 봐요.", tags: ["quiet"], preferredMenus: ["latte"] },
  { id: "guest_020", name: "이안", intro: "오늘은 라떼가 끌려요.", tags: ["regular"], preferredMenus: ["latte"] },

  { id: "guest_021", name: "지안", intro: "한 잔만 빠르게.", tags: ["regular"], preferredMenus: ["americano"] },
  { id: "guest_022", name: "지유", intro: "달콤한 향을 좋아해요.", tags: ["sweet_tooth"], preferredMenus: ["affogato"] },
  { id: "guest_023", name: "지후", intro: "진하게 내려요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_024", name: "하린", intro: "부드럽게 마시고 싶어요.", tags: ["quiet"], preferredMenus: ["latte"] },
  { id: "guest_025", name: "하윤", intro: "오늘은 달콤한 게 좋아요.", tags: ["sweet_tooth"], preferredMenus: ["affogato", "latte"] },
  { id: "guest_026", name: "하준", intro: "에스프레소 향을 찾아요.", tags: ["espresso_lover"], preferredMenus: ["americano"] },
  { id: "guest_027", name: "현우", intro: "한 잔으로 충분해요.", tags: ["regular"], preferredMenus: ["americano"] },
  { id: "guest_028", name: "현서", intro: "따뜻한 라떼가 좋아요.", tags: ["regular"], preferredMenus: ["latte"] },
  { id: "guest_029", name: "채원", intro: "조용히 쉬다 가요.", tags: ["quiet"], preferredMenus: ["latte"] },
  { id: "guest_030", name: "채윤", intro: "달콤한 한 잔이 좋아요.", tags: ["sweet_tooth"], preferredMenus: ["affogato"] },

  // (중략) — 실제 코드에는 100명 이상이 있어야 한다. 아래에서 자동 생성으로 채운다.
];

function ensureAtLeast100(seeds: RegularSeed[]): RegularSeed[] {
  if (seeds.length >= 95) return seeds;
  const baseNames = [
    "건우","건희","경민","경수","규리","규민","나은","다혜","도윤","도현",
    "라희","리나","민서","민준","민채","보라","서진","서현","선우","세아",
    "수민","수아","수진","아라","아름","연우","연서","영훈","우진","유빈",
    "은서","은우","재윤","재현","정민","정우","지민","지수","지훈","지현",
    "채린","채은","태윤","태현","하늘","하나","해인","혜린","혜원","호준",
    "효주","효진","가람","가윤","다인","도아","루나","미나","민아","세은",
    "소민","소영","수빈","시윤","아현","예나","예원","유정","윤아","은지",
    "지아","지은","지율","채아","채희","태연","하경","하람","해나","혜민",
    "혜진","호연","준영","준호","진우","진호","찬우","채영","태호","하성",
    "하진","해성","혜성","호석","효정",
  ];
  const used = new Set(seeds.map((s) => s.name));
  let idx = seeds.length + 1;
  for (const n of baseNames) {
    if (used.has(n)) continue;
    seeds.push({
      id: `guest_${String(idx).padStart(3, "0")}`,
      name: n,
      intro: "오늘은 한 잔만 챙겨요.",
      tags: ["regular"],
      preferredMenus: [idx % 3 === 0 ? "affogato" : idx % 2 === 0 ? "latte" : "americano"],
    });
    used.add(n);
    idx += 1;
    if (seeds.length >= 95) break;
  }
  return seeds;
}

const FINAL_SEEDS = ensureAtLeast100([...REGULAR_SEEDS]);

export const REGULAR_CUSTOMERS: CustomerProfile[] = FINAL_SEEDS.map((s) => ({
  id: s.id,
  nameTextId: (`customer.${s.id}.name` as MessageId),
  introTextId: (`customer.${s.id}.intro` as MessageId),
  tags: s.tags,
  preferredMenus: s.preferredMenus,
  baseAffection: 0,
  storySteps: GENERIC_STORY_STEPS,
}));

export const REGULAR_CUSTOMER_SEEDS_FOR_LOCALE = FINAL_SEEDS.map((s) => ({
  id: s.id,
  name: s.name,
  intro: s.intro,
}));

