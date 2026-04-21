import type { Page } from "@playwright/test";

const MENU_IDS = [
  "americano",
  "latte",
  "affogato",
  "morning_mist_latte",
  "dawn_honey_shot",
  "noon_citrus_coffee",
  "traveler_blend",
  "evening_caramel_crema",
  "sunset_tea_latte",
  "night_velvet_mocha",
  "midnight_tonic",
] as const;

const DEFAULT_MENU_STOCK = Object.fromEntries(
  MENU_IDS.map((id) => [id, 0]),
);

const DEFAULT_MATERIALS = {
  milk: 10,
  cream: 10,
  vanillaSyrup: 10,
  caramelSyrup: 10,
  hazelnutSyrup: 10,
  mochaSauce: 10,
  honey: 10,
  matchaPowder: 10,
  blackTeaBase: 10,
  fruitBase: 10,
  sparklingWater: 10,
  rareIngredient: 10,
};

type SeedInput = {
  level: number;
  coins?: number;
  beans?: number;
  unlockedRecipeIds: string[];
  purchasedRecipeIds: string[];
  purchasedTimeRecipeIds?: string[];
  espressoShots?: number;
};

export async function installFixedClock(
  page: Page,
  dateString = "2026-04-21T12:00:00",
) {
  await page.clock.install({ time: new Date(dateString).getTime() });
}

export async function seedGameState(page: Page, input: SeedInput) {
  await page.goto("/lobby");
  const now = new Date().getTime();
  const bundle = {
    format: "coffee2048-debug-save-bundle",
    app: {
      playerResources: {
        coins: input.coins ?? 5000,
        beans: input.beans ?? 500,
        hearts: 3,
      },
      puzzleProgress: {
        bestScore: 0,
        bestTile: 0,
        lastRunScore: 0,
        lastRunTile: 0,
        lastRunCoins: 0,
        lastRunBeans: 0,
        lastRunHearts: 0,
        totalRuns: 0,
      },
      cafeState: {
        cafeLevel: 1,
        roastLevel: 1,
        displayLevel: 1,
        ambianceLevel: 1,
        espressoShots: input.espressoShots ?? 24,
        menuStock: DEFAULT_MENU_STOCK,
        materialInventory: DEFAULT_MATERIALS,
        craftedDrinkIds: [],
        displaySellingActive: false,
        lastAutoSellAtMs: 0,
        lastOfflineSaleAtMs: 0,
        lastOfflineSaleCoins: 0,
        lastOfflineSaleSoldCount: 0,
      },
      accountLevel: {
        level: input.level,
        tierIndex: 0,
        currentLevelCompleted: false,
        levelStartedAtMs: now,
        lastLevelUpAtMs: 0,
        missionSlots: [],
        missionProgress: {},
        unlockedRecipeIds: input.unlockedRecipeIds,
        purchasedRecipeIds: input.purchasedRecipeIds,
      },
      beverageCodex: {
        entries: {},
        purchasedTimeRecipeIds: input.purchasedTimeRecipeIds ?? [],
      },
      meta: { lastHeartRegenAtMs: now },
      settings: {
        soundOn: false,
        vibrationOn: false,
        reducedMotion: true,
        lobbyOnboardingSeen: true,
      },
      bm: { adFree: false, supporterTier: 0 },
      cosmetics: {
        equippedThemeId: "default",
        ownedThemeIds: ["default"],
        equippedPuzzleBackgroundSkinId: "cafe_default_bg",
        equippedPuzzleBlockSkinId: "cream_default_blocks",
        ownedPuzzleSkinIds: ["cafe_default_bg", "cream_default_blocks"],
      },
      passProgress: {
        seasonId: "s0",
        tier: 0,
        xp: 0,
        premiumUnlocked: false,
      },
      liveOps: {
        unlockedGuestIds: [],
        activeEventIds: [],
      },
      ownedProductIds: [],
    },
  };

  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (node) => node.textContent?.trim() === "DEV",
    );
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error("DEV button not found");
    }
    button.click();
  });
  const saveTextarea = page.getByPlaceholder(
    "여기에 앱/손님 세이브 JSON을 붙여넣고 '세이브 불러오기'를 누르세요.",
  );
  await saveTextarea.waitFor();
  await saveTextarea.fill(JSON.stringify(bundle));
  await page.getByRole("button", { name: "세이브 불러오기" }).click();
  await page.getByText("세이브를 불러왔어요.").waitFor();
  await page.getByRole("button", { name: "닫기" }).click();
}

export async function openLobbyShop(page: Page) {
  await page.goto("/lobby");
  await page.getByTestId("lobby-reference-tile-shop").click();
}
