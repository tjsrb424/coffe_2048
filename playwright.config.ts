import { defineConfig, devices } from "@playwright/test";

/**
 * 시각 스냅샷 전용 설정.
 * - 포트: 기본 3005. 로컬에서 `next dev`가 3000을 쓰는 경우와 겹치지 않게 함.
 *   변경: PLAYWRIGHT_TEST_PORT=3010 등 환경 변수.
 * - CI: reuseExistingServer 미사용(항상 webServer 기동).
 */
const PW_TEST_PORT = process.env.PLAYWRIGHT_TEST_PORT ?? "3005";
const baseURL = `http://127.0.0.1:${PW_TEST_PORT}`;

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  // 스냅샷은 병렬 워커·타이밍에 민감해 로컬/CI 모두 단일 워커로 직렬 실행
  workers: 1,
  retries: process.env.CI ? 0 : 1,
  reporter: [["html", { open: "never" }]],
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      // 마스크·폰트 안티앨리어싱 등 잔여 미세 차이용(구조적 안정화 후 상한)
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: `npx next dev -H 127.0.0.1 -p ${PW_TEST_PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1100 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
