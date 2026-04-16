# Playwright 시각 회귀 검수

## 목적

주요 화면(로비, 퍼즐)의 UI가 의도치 않게 바뀌지 않았는지 **픽셀 스냅샷**으로 잡아두고, 변경 시 diff로 확인한다. 기능 테스트가 아니라 **레이아웃·스타일 회귀** 검수용이다.

## 사전 요구

- `npm install` ( `@playwright/test` 포함 )
- 브라우저 바이너리: `npx playwright install` (최초 1회 또는 버전 업 후)

## 포트·서버 전략

| 환경 | 동작 |
|------|------|
| **로컬** | `playwright.config.ts`가 `next dev`를 **기본 포트 `3005`** (`127.0.0.1`)으로 띄운다. 평소 `npm run dev`(3000)와 **동시에** 써도 충돌하지 않는다. 이미 같은 URL에 응답하는 서버가 있으면 `reuseExistingServer`로 재사용할 수 있다. |
| **포트 변경** | 환경 변수 `PLAYWRIGHT_TEST_PORT` (예: `3010`). `baseURL`과 `webServer.command`가 함께 바뀐다. |
| **CI** | 환경에 `CI`가 있으면 `reuseExistingServer`가 꺼지므로 **매번** Playwright가 지정 포트에서 dev 서버를 기동한다. |

## npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `npm run test:visual` | 스냅샷과 현재 화면을 비교해 통과/실패 |
| `npm run test:visual:update` | 기준 스냅샷을 **현재 렌더링으로 덮어쓰기** (UI 의도 변경 후 실행) |
| `npm run test:visual:ui` | Playwright UI 모드 |
| `npm run test:visual:headed` | 브라우저 창을 띄워 실행 |
| `npm run test:visual:report` | 마지막 HTML 리포트 열기 |

## 기준 스냅샷 파일 위치

스펙 파일 옆 `-snapshots` 폴더에 **프로젝트·OS별** PNG가 기준(Expected)이다.

```
tests/visual/
  lobby.spec.ts
  lobby.spec.ts-snapshots/
    lobby-page-desktop-chromium-win32.png
    lobby-page-mobile-chromium-win32.png
  puzzle.spec.ts
  puzzle.spec.ts-snapshots/
    puzzle-page-desktop-chromium-win32.png
    puzzle-page-mobile-chromium-win32.png
```

- **실패 시**: `test-results/` 아래에 actual / diff / trace·video가 남을 수 있음.

프로젝트 이름(`desktop-chromium`, `mobile-chromium`)과 OS(`win32`, `linux`, `darwin`)가 파일명에 포함된다. **다른 OS에서 CI**를 돌리면 해당 환경에서 한 번 `test:visual:update`로 스냅샷을 맞추거나, CI 러너 OS를 고정한다.

## 안정화 전략 요약

### 공통 (`playwright.config.ts`)

- **`workers: 1`**: 시각 비교는 타이밍에 민감해 병렬 워커를 쓰지 않는다.
- **`expect`는 설정 최상위**에 둔다 (`use` 안에 두면 스크린샷 옵션이 적용되지 않음).
  - `expect.timeout: 15000` — 스크린샷 안정화 대기
  - `expect.toHaveScreenshot.maxDiffPixelRatio: 0.02` — 구조적 안정화 **이후** 남는 폰트·안티앨리어싱 차이 상한

### 로비 (`lobby.spec.ts`)

- **`page.clock.install`**: 하트 회복 카운트다운 등 **시간 의존 텍스트**를 고정.
- **`page.emulateMedia({ reducedMotion: 'reduce' })`**: CSS `animation: none`만으로는 멈추지 않는 **framer-motion** 무한 연출·손님 스폰·레이아웃 보간을 끄기 위해 사용 (앱 쪽은 `useReducedMotion`·접근성 훅과 대응).
- **`prepareVisualPage`**: 애니메이션/트랜지션 비활성화.

### 퍼즐 (`puzzle.spec.ts`)

- **`fullPage: false`**: 문서 전체 높이(`svh`/`dvh` 등)에 덜 의존하도록 **뷰포트**만 캡처.
- **`mask: [puzzle-board-visual-mask]`**: 초기 타일은 **RNG**라 픽셀이 매번 달라지므로, 보드 컨테이너(`data-testid="puzzle-board-visual-mask"`)는 비교에서 제외. **보드 테두리·그리드·HUD·헤더** 변경은 여전히 잡힌다.
- **`lockDocumentScroll`**: 스크롤바 유무로 가로 폭이 흔들이는 것을 줄임.

### 앱 코드와의 연동 (기능 추가 아님)

- **`useReducedMotionPreference`**: `matchMedia` 초기값을 **첫 렌더**에서도 맞춤 (이전에는 `useEffect` 이후에만 반영되어 스냅샷 첫 프레임에 숫자 애니메이션이 남을 수 있었음).
- **로비**: `LobbyMainCard` 무한 opacity, `LobbyAmbientCustomers` 스폰, `ResourceBar` `layout` 애니메이션이 **감소된 모션** 설정에서 멈추거나 생략되도록 정리 (접근성과 스냅샷 모두에 유리).

## 회귀 검수 시 무엇을 보면 되는가

1. **`npm run test:visual` 결과** — 전부 통과면 기준과 동일하게 렌더된 것으로 본다.
2. **실패 시** — HTML 리포트 또는 `test-results/*/diff.png`로 **어느 영역이 달라졌는지** 확인한다.
3. **의도된 UI 변경** — 디자인/카피 반영 후 **`npm run test:visual:update`**로 기준 PNG를 갱신하고, PR에 스냅샷 diff를 포함한다.
4. **의도하지 않은 변경** — 레이아웃 버그 가능성이 있으므로 코드를 고친 뒤 다시 `test:visual`로 확인한다.

## 관련 코드

- `playwright.config.ts` — 포트, `webServer`, `workers`, `expect`, 프로젝트
- `tests/visual/*.spec.ts` — 페이지별 스크린샷 조건
- `tests/visual/visualTestUtils.ts` — 스냅샷 전처리

## 전달 문서와의 관계

고수준 작업 전달·기획 맥락은 `14_cursor_handoff_update.md`를 본다. **시각 회귀만** 이어받을 때는 이 문서만 읽어도 된다.
