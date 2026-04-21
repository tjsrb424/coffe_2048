import { expect, test } from "@playwright/test";
import {
  installFixedClock,
  openLobbyShop,
  seedGameState,
} from "./ownershipTestUtils";

test.describe.configure({ mode: "serial" });

test("standard recipe ownership purchase flow stays consistent", async ({ page }) => {
  test.setTimeout(90_000);
  await installFixedClock(page, "2026-04-21T12:00:00");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seedGameState(page, {
    level: 3,
    unlockedRecipeIds: ["americano", "latte", "affogato"],
    purchasedRecipeIds: ["americano"],
  });

  await openLobbyShop(page);
  await page.getByRole("button", { name: "레시피상점" }).click();

  const latteShopCard = page.locator("li").filter({ hasText: "카페 라떼" }).first();
  await expect(latteShopCard).toContainText("구매 가능");
  await latteShopCard.getByRole("button").click();
  await expect(latteShopCard).toContainText("구매 완료");
  await expect(latteShopCard).toContainText("완료");

  await page.goto("/cafe");
  const latteCraftCard = page
    .locator("#lobby-cafe-craft li")
    .filter({ hasText: "카페 라떼" })
    .first();
  await expect(latteCraftCard).toContainText("제작 가능");
  await expect(
    latteCraftCard.getByRole("button", { name: "제작하기" }),
  ).toBeEnabled();

  await page.goto("/codex");
  const latteCodexCard = page.locator("li").filter({ hasText: "카페 라떼" }).first();
  await expect(latteCodexCard).toContainText("구매");

  await page.goto("/cafe");
  await page.reload();
  await expect(
    page.locator("#lobby-cafe-craft li").filter({ hasText: "카페 라떼" }).first(),
  ).toContainText("제작 가능");
});

test("time recipe ownership purchase flow stays consistent", async ({ page }) => {
  test.setTimeout(90_000);
  await installFixedClock(page, "2026-04-21T23:30:00");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seedGameState(page, {
    level: 65,
    unlockedRecipeIds: ["americano", "latte", "affogato"],
    purchasedRecipeIds: ["americano", "latte"],
  });

  await page.goto("/time-shop");
  const nightShopCard = page
    .locator("li")
    .filter({ hasText: "나이트 벨벳 모카" })
    .first();
  await expect(nightShopCard).toContainText("250");
  await expect(nightShopCard.getByRole("button")).toBeEnabled();
  await nightShopCard.getByRole("button").click();
  await expect(nightShopCard).toContainText("보유");

  await page.goto("/cafe");
  const nightCraftCard = page
    .locator("#lobby-cafe-craft li")
    .filter({ hasText: "나이트 벨벳 모카" })
    .first();
  await expect(nightCraftCard).toContainText("제작 가능");
  await expect(
    nightCraftCard.getByRole("button", { name: "제작하기" }),
  ).toBeEnabled();

  await page.goto("/codex");
  const nightCodexCard = page
    .locator("li")
    .filter({ hasText: "나이트 벨벳 모카" })
    .first();
  await expect(nightCodexCard).toContainText("구매");

  await page.goto("/time-shop");
  await page.reload();
  await expect(
    page.locator("li").filter({ hasText: "나이트 벨벳 모카" }).first(),
  ).toContainText("보유");
});

test("helper-backed split ownership sources still resolve after reload", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await installFixedClock(page, "2026-04-21T23:30:00");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seedGameState(page, {
    level: 65,
    unlockedRecipeIds: ["americano", "latte", "affogato"],
    purchasedRecipeIds: ["americano", "latte"],
    purchasedTimeRecipeIds: ["night_velvet_mocha"],
  });

  await page.goto("/cafe");
  await expect(
    page.locator("#lobby-cafe-craft li").filter({ hasText: "카페 라떼" }).first(),
  ).toContainText("제작 가능");
  await expect(
    page
      .locator("#lobby-cafe-craft li")
      .filter({ hasText: "나이트 벨벳 모카" })
      .first(),
  ).toContainText("제작 가능");

  await page.goto("/time-shop");
  await expect(
    page.locator("li").filter({ hasText: "나이트 벨벳 모카" }).first(),
  ).toContainText("보유");

  await page.goto("/codex");
  await expect(
    page.locator("li").filter({ hasText: "카페 라떼" }).first(),
  ).toContainText("구매");
  await expect(
    page.locator("li").filter({ hasText: "나이트 벨벳 모카" }).first(),
  ).toContainText("구매");

  await page.goto("/cafe");
  await page.reload();
  await expect(
    page
      .locator("#lobby-cafe-craft li")
      .filter({ hasText: "나이트 벨벳 모카" })
      .first(),
  ).toContainText("제작 가능");
});
