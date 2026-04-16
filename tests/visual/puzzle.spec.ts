import { test, expect } from "@playwright/test";
import { prepareVisualPage } from "./visualTestUtils";

test("puzzle visual snapshot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/puzzle");

  await prepareVisualPage(page, { lockDocumentScroll: true });

  const boardMask = page.getByTestId("puzzle-board-visual-mask");
  await boardMask.waitFor({ state: "visible" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );
  });

  /**
   * fullPage는 문서 높이가 흔들릴 수 있어 viewport가 더 안정적이다.
   * 초기 타일 배치는 RNG라 실행마다 달라지므로, 보드 영역은 mask로 비교에서 제외한다
   * (레이아웃·HUD·크롬 회귀는 유지, 숫자 타일 픽셀 비교는 제외).
   */
  await expect(page).toHaveScreenshot("puzzle-page.png", {
    fullPage: false,
    animations: "disabled",
    mask: [boardMask],
  });
});
