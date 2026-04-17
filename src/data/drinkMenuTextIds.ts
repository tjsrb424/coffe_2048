import type { DrinkMenuId } from "@/features/meta/types/gameState";
import type { MessageId } from "@/locale/i18n";

/** 음료 메뉴 표시용 텍스트 id — 레시피/가격 등 수치는 cafeEconomy에 둔다. */
export const DRINK_MENU_TEXT_IDS: Record<
  DrinkMenuId,
  { nameTextId: MessageId; descriptionTextId: MessageId }
> = {
  americano: {
    nameTextId: "menu.drink.americano.name",
    descriptionTextId: "menu.drink.americano.description",
  },
  latte: {
    nameTextId: "menu.drink.latte.name",
    descriptionTextId: "menu.drink.latte.description",
  },
  affogato: {
    nameTextId: "menu.drink.affogato.name",
    descriptionTextId: "menu.drink.affogato.description",
  },
};
