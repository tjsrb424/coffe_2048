import { MENU_ORDER } from "@/features/meta/balance/cafeEconomy";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import type { CustomerProfile } from "@/features/customers/types";

/**
 * 자동 판매 배치 기준 애정도 증가량.
 * - 기본: 판매 1잔당 +1
 * - 선호 메뉴인 잔: 추가 +1 (선호 1잔당 총 +2)
 */
export function affectionGainFromCafeSales(
  profile: CustomerProfile,
  soldCount: number,
  soldByMenu?: Partial<Record<DrinkMenuId, number>>,
): { gainedAffection: number; preferredBonus: number } {
  if (soldCount <= 0) return { gainedAffection: 0, preferredBonus: 0 };

  if (soldByMenu) {
    let sum = 0;
    let base = 0;
    let prefExtra = 0;
    for (const mid of MENU_ORDER) {
      const n = soldByMenu[mid] ?? 0;
      if (n <= 0) continue;
      sum += n;
      base += n;
      if (profile.preferredMenus.includes(mid)) {
        prefExtra += n;
      }
    }
    if (sum !== soldCount) {
      return { gainedAffection: soldCount, preferredBonus: 0 };
    }
    return { gainedAffection: base + prefExtra, preferredBonus: prefExtra };
  }

  return { gainedAffection: soldCount, preferredBonus: 0 };
}
