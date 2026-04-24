import { expect, test, type Page } from "@playwright/test";
import {
  REWARDED_AD_GPT_OFFLINE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY,
  REWARDED_AD_GPT_PUZZLE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY,
  REWARDED_AD_LAST_RESULT_STORAGE_KEY,
  REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY,
} from "../../src/lib/ads/rewardedAds";
import {
  buildDebugSaveBundle,
  exportDebugSaveBundle,
  importDebugSaveBundle,
  installFixedClock,
} from "./ownershipTestUtils";

const FIXED_TIME = "2026-04-23T16:00:00";

async function installFakeGoogletag(
  page: Page,
  outcome: "rewarded" | "cancelled" | "error" | "no_fill" | "unsupported",
  options?: { omitCmd?: boolean },
) {
  await page.addInitScript(({ nextOutcome, omitCmd }) => {
    type FakeSlot = {
      __id: string;
      addService: () => FakeSlot;
      getSlotElementId: () => string;
      setTargeting: () => FakeSlot;
    };

    const listeners: Record<string, Array<(event: unknown) => void>> = {
      rewardedSlotReady: [],
      rewardedSlotGranted: [],
      rewardedSlotClosed: [],
      slotRenderEnded: [],
    };

    let slotSeq = 0;
    const slots = new Set<FakeSlot>();
    const service = {
      addEventListener(type: string, listener: (event: unknown) => void) {
        listeners[type] ??= [];
        listeners[type].push(listener);
      },
      removeEventListener(type: string, listener: (event: unknown) => void) {
        listeners[type] = (listeners[type] ?? []).filter((candidate) => candidate !== listener);
      },
    };

    const emit = (type: string, event: unknown) => {
      for (const listener of listeners[type] ?? []) {
        listener(event);
      }
    };

    const createSlot = (): FakeSlot => {
      const slot: FakeSlot = {
        __id: `fake-gpt-slot-${++slotSeq}`,
        addService: () => slot,
        getSlotElementId: () => slot.__id,
        setTargeting: () => slot,
      };
      slots.add(slot);
      return slot;
    };

    const fakeGoogletag = {
      apiReady: true,
      enums: {
        OutOfPageFormat: {
          REWARDED: "REWARDED",
        },
      },
      pubads: () => service,
      enableServices: () => {},
      defineOutOfPageSlot: () => {
        if (nextOutcome === "unsupported") return null;
        return createSlot();
      },
      display: (slot: FakeSlot) => {
        if (nextOutcome === "no_fill") {
          window.setTimeout(() => {
            emit("slotRenderEnded", { slot, isEmpty: true });
          }, 20);
          return;
        }

        window.setTimeout(() => {
          emit("slotRenderEnded", { slot, isEmpty: false });
        }, 10);

        window.setTimeout(() => {
          emit("rewardedSlotReady", {
            slot,
            makeRewardedVisible: () => {
              if (nextOutcome === "error") return false;
              window.setTimeout(() => {
                if (nextOutcome === "rewarded") {
                  emit("rewardedSlotGranted", {
                    slot,
                    payload: { type: "coins", amount: 1 },
                  });
                }
                emit("rewardedSlotClosed", { slot });
              }, 20);
              return true;
            },
          });
        }, 20);
      },
      destroySlots: (targets?: FakeSlot[]) => {
        for (const target of targets ?? []) {
          slots.delete(target);
        }
        return true;
      },
    };
    if (!omitCmd) {
      (fakeGoogletag as { cmd?: Array<() => void> }).cmd = [];
    }
    (window as typeof window & { googletag?: unknown }).googletag = fakeGoogletag;
  }, { nextOutcome: outcome, omitCmd: options?.omitCmd ?? false });
}

async function forceWebGptRewarded(page: Page) {
  await page.evaluate(
    ([providerKey, offlinePathKey, puzzlePathKey]) => {
      window.localStorage.setItem(providerKey, "web-gpt-rewarded");
      window.localStorage.setItem(offlinePathKey, "/6355419/Travel/Europe/France/Paris");
      window.localStorage.setItem(puzzlePathKey, "/6355419/Travel/Europe/France/Lyon");
    },
    [
      REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY,
      REWARDED_AD_GPT_OFFLINE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY,
      REWARDED_AD_GPT_PUZZLE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY,
    ] as const,
  );
}

test.describe.configure({ mode: "serial" });

test("web GPT rewarded success drives offline x2 claim", async ({ page }) => {
  test.setTimeout(120_000);
  const nowMs = new Date(FIXED_TIME).getTime();
  const offlineStartedAtMs = nowMs - 30 * 60 * 1000;

  await installFixedClock(page, FIXED_TIME);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installFakeGoogletag(page, "rewarded");

  await importDebugSaveBundle(
    page,
    buildDebugSaveBundle({
      nowMs,
      app: {
        playerResources: {
          coins: 1_000,
        },
        cafeState: {
          displaySellingActive: true,
          lastAutoSellAtMs: offlineStartedAtMs,
          menuStock: {
            americano: 3,
          },
          pendingOfflineReward: null,
        },
        meta: {
          lastHeartRegenAtMs: nowMs,
          lastSeenAtMs: offlineStartedAtMs,
        },
      },
    }),
  );

  await forceWebGptRewarded(page);

  const beforeClaim = await exportDebugSaveBundle(page);
  const pendingCoins = beforeClaim.app.cafeState.pendingOfflineReward?.pendingCoins ?? 0;

  await page.getByRole("button", { name: "광고 보고 2배" }).click();
  await page.waitForTimeout(120);

  const afterClaim = await exportDebugSaveBundle(page);
  expect(afterClaim.app.playerResources.coins).toBe(1_000 + pendingCoins * 2);
  expect(afterClaim.app.cafeState.pendingOfflineReward).toBeNull();
  expect(afterClaim.app.cafeState.lastOfflineSaleCoins).toBe(pendingCoins * 2);
});

test("web GPT rewarded succeeds even when cmd queue is missing", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const nowMs = new Date(FIXED_TIME).getTime();

  await installFixedClock(page, FIXED_TIME);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installFakeGoogletag(page, "rewarded", { omitCmd: true });

  await importDebugSaveBundle(
    page,
    buildDebugSaveBundle({
      nowMs,
      app: {
        playerResources: {
          coins: 100,
          beans: 40,
          hearts: 2,
        },
        meta: {
          lastHeartRegenAtMs: nowMs,
          lastSeenAtMs: nowMs,
          pendingPuzzleRewardClaim: {
            claimId: `puzzle-${nowMs}-640-512-16`,
            generatedAtMs: nowMs,
            score: 640,
            highestTile: 512,
            mergeCount: 16,
            baseCoins: 64,
            baseBeans: 16,
            baseHearts: 1,
          },
        },
      },
    }),
  );

  await forceWebGptRewarded(page);
  await page.goto("/puzzle");

  const resultDialog = page.getByRole("dialog", { name: "수고했어요" });
  await expect(resultDialog).toBeVisible();
  await resultDialog
    .getByRole("button", { name: "광고 보고 코인+원두 x2" })
    .click();
  await expect(page).toHaveURL(/\/lobby\/?$/);

  const lastAttempt = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, REWARDED_AD_LAST_RESULT_STORAGE_KEY);
  expect(lastAttempt?.status).toBe("rewarded");
  expect(lastAttempt?.debug?.failureStage ?? null).toBeNull();
  expect(lastAttempt?.debug?.slotAttempted).toBe(true);
  expect(lastAttempt?.debug?.slotReturnedNull).toBe(false);
  expect(lastAttempt?.debug?.gptAtSlotAttempt?.servicesEnabledByApp).toBe(true);
});

test("web GPT cancelled keeps puzzle claim pending", async ({ page }) => {
  test.setTimeout(120_000);
  const nowMs = new Date(FIXED_TIME).getTime();

  await installFixedClock(page, FIXED_TIME);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installFakeGoogletag(page, "cancelled");

  await importDebugSaveBundle(
    page,
    buildDebugSaveBundle({
      nowMs,
      app: {
        playerResources: {
          coins: 100,
          beans: 40,
          hearts: 2,
        },
        meta: {
          lastHeartRegenAtMs: nowMs,
          lastSeenAtMs: nowMs,
          pendingPuzzleRewardClaim: {
            claimId: `puzzle-${nowMs}-320-256-12`,
            generatedAtMs: nowMs,
            score: 320,
            highestTile: 256,
            mergeCount: 12,
            baseCoins: 32,
            baseBeans: 8,
            baseHearts: 1,
          },
        },
      },
    }),
  );

  await forceWebGptRewarded(page);
  await page.goto("/puzzle");

  const resultDialog = page.getByRole("dialog", { name: "수고했어요" });
  await expect(resultDialog).toBeVisible();

  await resultDialog
    .getByRole("button", { name: "광고 보고 코인+원두 x2" })
    .click();
  await expect(
    resultDialog.getByText("광고 보상을 끝까지 받지 못했어요. 기본 보상은 바로 받을 수 있어요."),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/puzzle\/?$/);
  await page.reload();
  await expect(page.getByRole("dialog", { name: "수고했어요" })).toBeVisible();
});

test("web GPT no fill and unsupported fallback keep reward unclaimed", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const nowMs = new Date(FIXED_TIME).getTime();

  await installFixedClock(page, FIXED_TIME);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installFakeGoogletag(page, "no_fill");

  await importDebugSaveBundle(
    page,
    buildDebugSaveBundle({
      nowMs,
      app: {
        playerResources: {
          coins: 100,
          beans: 40,
          hearts: 2,
        },
        meta: {
          lastHeartRegenAtMs: nowMs,
          lastSeenAtMs: nowMs,
          pendingPuzzleRewardClaim: {
            claimId: `puzzle-${nowMs}-320-256-12`,
            generatedAtMs: nowMs,
            score: 320,
            highestTile: 256,
            mergeCount: 12,
            baseCoins: 32,
            baseBeans: 8,
            baseHearts: 1,
          },
        },
      },
    }),
  );

  await forceWebGptRewarded(page);
  await page.goto("/puzzle");

  const resultDialog = page.getByRole("dialog", { name: "수고했어요" });
  await resultDialog
    .getByRole("button", { name: "광고 보고 코인+원두 x2" })
    .click();
  await expect(
    resultDialog.getByText("지금은 볼 수 있는 광고가 없어요. 기본 보상은 바로 받을 수 있어요."),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/puzzle\/?$/);
  await page.reload();
  await expect(page.getByRole("dialog", { name: "수고했어요" })).toBeVisible();

  const unsupportedPage = await page.context().newPage();
  await installFixedClock(unsupportedPage, FIXED_TIME);
  await unsupportedPage.emulateMedia({ reducedMotion: "reduce" });
  await installFakeGoogletag(unsupportedPage, "unsupported");
  await importDebugSaveBundle(
    unsupportedPage,
    buildDebugSaveBundle({
      nowMs,
      app: {
        playerResources: {
          coins: 100,
          beans: 40,
          hearts: 2,
        },
        meta: {
          lastHeartRegenAtMs: nowMs,
          lastSeenAtMs: nowMs,
          pendingPuzzleRewardClaim: {
            claimId: `puzzle-${nowMs}-320-256-12-u`,
            generatedAtMs: nowMs,
            score: 320,
            highestTile: 256,
            mergeCount: 12,
            baseCoins: 32,
            baseBeans: 8,
            baseHearts: 1,
          },
        },
      },
    }),
  );
  await forceWebGptRewarded(unsupportedPage);
  await unsupportedPage.goto("/puzzle");
  const unsupportedDialog = unsupportedPage.getByRole("dialog", { name: "수고했어요" });
  await unsupportedDialog
    .getByRole("button", { name: "광고 보고 코인+원두 x2" })
    .click();
  await expect(
    unsupportedDialog.getByText(
      "이번 요청에서는 보상형 광고를 열지 못했어요. 잠시 뒤 다시 시도하거나 기본 보상을 받아주세요.",
    ),
  ).toBeVisible();
  await expect(
    unsupportedDialog.getByRole("button", { name: "광고 보고 코인+원두 x2" }),
  ).toBeEnabled();
  const unsupportedAttempt = await unsupportedPage.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, REWARDED_AD_LAST_RESULT_STORAGE_KEY);
  expect(unsupportedAttempt?.details).toContain("defineOutOfPageSlot returned null");
  expect(unsupportedAttempt?.debug?.slotReturnedNull).toBe(true);
  expect(unsupportedAttempt?.debug?.notes).toContain("slot_creation_returned_null");
  await expect(unsupportedPage).toHaveURL(/\/puzzle\/?$/);
  await unsupportedPage.reload();
  const unsupportedDialogAfterReload = unsupportedPage.getByRole("dialog", {
    name: "수고했어요",
  });
  await expect(unsupportedDialogAfterReload).toBeVisible();
  await expect(
    unsupportedDialogAfterReload.getByRole("button", { name: "광고 보고 코인+원두 x2" }),
  ).toBeEnabled();
  await expect(
    unsupportedDialogAfterReload.getByText(
      "광고 x2는 코인과 원두만 2배예요. 하트와 다른 메타 진척은 그대로예요.",
    ),
  ).toBeVisible();
  await unsupportedPage.close();
});
