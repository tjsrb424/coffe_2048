import type { DrinkMenuId } from "@/features/meta/types/gameState";
import { beverageForRecipeId } from "@/features/meta/content/beverages";
import type { MessageId } from "@locale/messages/ko";
import type { CustomerProfile } from "@/features/customers/types";

const DRINK_DISPLAY_NAME: Partial<Record<DrinkMenuId, MessageId>> = {
  americano: "menu.drink.americano.name",
  latte: "menu.drink.latte.name",
  affogato: "menu.drink.affogato.name",
};

/** 선호 메뉴 id 목록을 메뉴 표기명 문자열로 (구분 ·) */
export function formatPreferredMenuNames(
  profile: CustomerProfile,
  translate: (id: MessageId) => string,
): string {
  return profile.preferredMenus
    .map((id) => {
      const labelId = DRINK_DISPLAY_NAME[id];
      return labelId ? translate(labelId) : beverageForRecipeId(id).name;
    })
    .join(" · ");
}
