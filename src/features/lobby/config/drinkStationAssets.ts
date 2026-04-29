import { publicAssetPath } from "@/lib/publicAssetPath";

function asset(path: string): string {
  return publicAssetPath(path);
}

export const drinkStationAssets = {
  reference: {
    final: asset(
      "/assets/drinkstation/reference/drinkstation_final_reference.png",
    ),
    notes: asset(
      "/assets/drinkstation/reference/drinkstation_asset_notes.md",
    ),
  },
  bg: {
    base: asset("/assets/drinkstation/drinkstation_bg_base.png"),
    cardPanel: asset("/assets/drinkstation/drinkstation_bg_card.png"),
  },
  header: {
    topHud: asset("/assets/drinkstation/drinkstation_hud_top.png"),
    title: asset("/assets/drinkstation/drinkstation_title.png"),
    backButton: null,
  },
  category: {
    all: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_all_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_all_off.png"),
    },
    basic: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_basic_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_basic_off.png"),
    },
    milk: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_milk_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_milk_off.png"),
    },
    sweet: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_sweet_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_sweet_off.png"),
    },
    dessert: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_dessert_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_dessert_off.png"),
    },
    tea: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_tea_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_tea_off.png"),
    },
    special: {
      on: asset("/assets/drinkstation/drinkstation_btn_ type_special_on.png"),
      off: asset("/assets/drinkstation/drinkstation_btn_ type_special_off.png"),
    },
  },
  filter: {
    craftableToggle: asset(
      "/assets/drinkstation/drinkstation_btn_possible_toggle.png",
    ),
  },
  card: {
    base: asset("/assets/drinkstation/drinkstation_card_base.png"),
    categoryBadge: asset("/assets/drinkstation/drinkstation_card_ category.png"),
    badgePossible: asset("/assets/drinkstation/drinkstation_card_ possible.png"),
    badgeShortage: asset("/assets/drinkstation/drinkstation_card_ shortage.png"),
    badgeNew: asset("/assets/drinkstation/drinkstation_card_ new.png"),
    favoriteOn: null,
    favoriteOff: null,
    materialSlot: asset("/assets/drinkstation/drinkstation_card_material.png"),
    drinkFallback: asset("/assets/drinkstation/drinkstation_card_drink.png"),
    makeButton: asset("/assets/drinkstation/drinkstation_card_btn.png"),
    makeButtonDisabled: asset(
      "/assets/drinkstation/drinkstation_btn_making_disabled.png",
    ),
  },
  bottom: {
    hud: asset("/assets/drinkstation/drinkstation_botttom_hud.png"),
    selectBg: asset("/assets/drinkstation/drinkstation_bottom_select_bg.png"),
    selectDrink: asset(
      "/assets/drinkstation/drinkstation_bottom_select_drink.png",
    ),
    materialHeading: asset(
      "/assets/drinkstation/drinkstation_bottom_hud_meterial.png",
    ),
    materialSlot: asset("/assets/drinkstation/drinkstation_bottom_meterial.png"),
    makeButton: asset("/assets/drinkstation/drinkstation_btn_ making.png"),
    makeButtonDisabled: asset(
      "/assets/drinkstation/drinkstation_btn_making_disabled.png",
    ),
    qtyMinus: null,
    qtyPlus: null,
  },
  drinks: {
    americano: asset("/images/optimized/drink/아메리카노.webp"),
    cafeLatte: asset("/images/optimized/drink/카페라떼.webp"),
    affogato: asset("/images/optimized/drink/아포가토.webp"),
    vanillaLatte: null,
    cafeMocha: null,
    matchaLatte: null,
    nuttyCloud: null,
  },
} as const;

export type DrinkStationCategoryKey = keyof typeof drinkStationAssets.category;
