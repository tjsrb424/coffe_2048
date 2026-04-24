# Web 1.0 Rewarded Ad 운영 세팅 체크리스트

## 1) 목적

이 문서는 `Coffee 2048` web 1.0 출시선에서 보상형 광고 운영 세팅을
실수 없이 이어가기 위한 고정 체크리스트다.

범위:
- 코드 기능 추가가 아니라 운영/배포 세팅 정리
- `requestRewardedAd(placement)` 뒤의 기존 adapter 구조를 전제로 함
- placement 2종(`offline_reward_double`, `puzzle_result_double`)만 다룸

비범위:
- BM 표면 확장
- 퍼즐 코어 규칙 변경
- 저장 스키마 변경
- 광고 provider 구조 리라이트

---

## 2) 웹 1.0 rewarded ad 현재 구조 요약

현재 레포 기준 구조:
- 외부 진입점은 `requestRewardedAd(placement)` 단일 함수
- provider 분기:
  - `mock`
  - `web-gpt-rewarded` (GPT + GAM rewarded)
  - `unsupported` fallback
- 결과 상태 분기:
  - `rewarded`
  - `cancelled`
  - `error`
  - `no_fill`
  - `unsupported`

운영상 중요한 원칙:
- UI는 provider 종류를 모름 (status만 해석)
- 광고 reward callback이 와도 즉시 자원 지급하지 않음
- 최종 지급은 store claim 함수에서만 처리
- `claimId` 기반 중복 수령 방지 유지
- web rewarded는 inventory보다 먼저 **페이지 통합 조건**을 만족해야 하며,
  현재 기준 루트 viewport는 `src/app/layout.tsx`에서
  `width=device-width, initial-scale=1, viewport-fit=cover`로 유지한다

관련 코드:
- adapter: `src/lib/ads/rewardedAds.ts`
- 오프라인 x2 UI: `src/features/lobby/components/OfflineSalesCard.tsx`
- 퍼즐 결과 x2 UI: `src/features/puzzle2048/components/PuzzleScreen.tsx`
- 지급/중복방지 로직: `src/stores/useAppStore.ts`

---

## 3) placement 2종 정의

운영 허용 placement는 아래 2개만 사용한다.

- `offline_reward_double`
  - 로비 오프라인 보상 카드의 `광고 보고 2배`
  - 성공 시 해당 오프라인 코인 정산만 x2

- `puzzle_result_double`
  - 퍼즐 결과 모달의 `광고 보고 코인+원두 x2`
  - 성공 시 퍼즐 결과 보상 정책에 따라 일부 항목만 x2

금지:
- 새로운 placement 임의 추가
- 같은 placement를 다른 BM 표면에 재사용

---

## 4) 퍼즐 결과 x2 정책 (고정)

`puzzle_result_double` 성공 시:
- 코인: x2
- 원두: x2

배수 제외(항상 base 유지):
- 하트
- 미션 진행도/레벨 진척
- 도감/해금/시간대 메타 진척
- 손님 메타(애정도/스토리/단골 등)

검증 포인트:
- `useAppStore.claimPuzzleReward`에서 지급/기록 정책 확인
- `tests/visual/rewarded-ad-claims.spec.ts` 회귀 유지

---

## 5) 필요한 env 목록과 설명

아래 env를 배포 환경에 명시한다.

- `NEXT_PUBLIC_REWARDED_AD_PROVIDER`
  - 값: `auto` | `mock` | `web-gpt-rewarded` | `unsupported`
  - 권장:
    - dev: `mock` 또는 `auto`
    - prod: `web-gpt-rewarded` (ad unit 준비 완료 시)

- `NEXT_PUBLIC_GAM_REWARDED_OFFLINE_AD_UNIT_PATH`
  - `offline_reward_double`에 매핑할 GAM rewarded ad unit path
  - 예시 형식: `/network_code/...`

- `NEXT_PUBLIC_GAM_REWARDED_PUZZLE_AD_UNIT_PATH`
  - `puzzle_result_double`에 매핑할 GAM rewarded ad unit path

- `NEXT_PUBLIC_GAM_REWARDED_SCRIPT_URL`
  - 기본값: `https://securepubads.g.doubleclick.net/tag/js/gpt.js`
  - 특별한 이유가 없으면 기본값 유지

- `NEXT_PUBLIC_REWARDED_AD_REQUEST_TIMEOUT_MS`
  - 광고 요청 타임아웃(ms)
  - 기본값: `8000`
  - 운영 권장: 5000~10000 범위에서 네트워크/UX 보고 조정

운영 체크:
- prod에서 provider를 `web-gpt-rewarded`로 두었는데 ad unit path가 비어 있으면 `unsupported`로 떨어짐
- build/배포 파이프라인에서 env 누락 여부를 배포 전 체크

### 5-1. 현재 프로젝트 반영값

이번 기준으로 확정된 값은 아래다.

- `NEXT_PUBLIC_REWARDED_AD_PROVIDER=web-gpt-rewarded`
- `NEXT_PUBLIC_GAM_REWARDED_OFFLINE_AD_UNIT_PATH=/23350518234/rewarded_offline_double`
- `NEXT_PUBLIC_GAM_REWARDED_PUZZLE_AD_UNIT_PATH=/23350518234/rewarded_puzzle_double`
- `NEXT_PUBLIC_GAM_REWARDED_SCRIPT_URL=https://securepubads.g.doubleclick.net/tag/js/gpt.js`
- `NEXT_PUBLIC_REWARDED_AD_REQUEST_TIMEOUT_MS=8000`

### 5-2. 현재 레포에서 어디에 넣는가

- 로컬 실행:
  - `.env.local`
- 커밋 가능한 템플릿:
  - `.env.example`
- GitHub Pages / static export 배포:
  - `.github/workflows/deploy-pages.yml`의 `Build (Next.js export)` step `env`

주의:
- `.env.local`은 `.gitignore`에 의해 커밋되지 않는다
- GitHub Pages 정적 배포는 빌드 시점 env를 읽으므로, workflow build step에 값이 있어야 한다
- PR/시각 테스트용 workflow에는 현재 값을 강제로 넣지 않았다. dev/test 기본 mock 경로를 깨지 않기 위해서다

### 5-3. 페이지 통합 필수 조건

web rewarded는 env만 맞는다고 동작하지 않는다.

- 루트 `<meta name="viewport">`가 모바일 최적화 + neutral zoom 조건을 만족해야 한다
- 현재 프로젝트의 기준 viewport는 아래다
  - `width=device-width`
  - `initial-scale=1`
  - `viewport-fit=cover`
- `maximum-scale=1`, `user-scalable=no`처럼 zoom을 잠그는 값은
  rewarded 지원 판정에 불리할 수 있으므로 기본 설정에서 제거한다
- 실제 지원 판정은 `googletag.defineOutOfPageSlot(..., REWARDED)`가 맡고,
  여기서 `null`이 나오면 inventory 이전에 페이지/기기 조건부터 의심해야 한다

---

## 6) GAM에서 준비해야 할 실제 항목

### 6-1. ad unit 준비
- rewarded용 ad unit 2개 생성(placement별 분리 권장)
  - offline용 1개
  - puzzle용 1개
- 두 ad unit path를 각각 env에 매핑

### 6-2. inventory / line item 준비
- web rewarded 인벤토리 연결
- 테스트 단계:
  - 테스트 크리에이티브/테스트 트래픽 우선
  - 노출/채움(fill)과 이벤트 동작 먼저 확인
- 실광고 단계:
  - 실제 line item으로 전환
  - 빈도/타게팅/우선순위/가격 정책 조정

### 6-3. 테스트 광고와 실광고 구분
- 테스트 단계와 실광고 단계를 반드시 분리 운영
- 배포 전 체크리스트에 아래를 포함:
  - 현재 line item이 test인지 prod인지
  - 테스트 크리에이티브가 실환경에 남아있지 않은지
  - 운영 계정 권한/승인 상태 확인

### 6-4. fill / no-fill 확인 포인트
- 최소 확인 항목:
  - 요청 대비 ready 발생률
  - no_fill 비율
  - placement별 편차(offline vs puzzle)
- no_fill이 높으면:
  - inventory/line item 설정
  - 타게팅/제약
  - 지역/디바이스 지원범위
  - 트래픽 볼륨
  순으로 점검

---

## 7) unsupported / no_fill / cancel / error 대응 정책

정책 목표:
- 광고 실패/미지원에서도 기본 보상 루프가 깨지지 않음
- claim pending이 임의 소모되지 않음

상태별 운영 정책:
- `rewarded`
  - 광고 x2 claim 진행
- `cancelled`
  - 광고 배수 미적용
  - 유저는 기본 수령 경로로 즉시 복귀 가능
- `no_fill`
  - 광고 배수 미적용
  - 기본 수령 경로 유지
- `unsupported`
  - 광고 배수 미적용
  - 기본 수령 경로 유지
- `error`
  - 광고 배수 미적용
  - 기본 수령 경로 유지

현재 코드 기준 진단:
- `defineOutOfPageSlot(..., REWARDED)`가 `null`이면
  `src/lib/ads/rewardedAds.ts`가 단순 heuristic 후보만 남기지 않고 아래를 함께 detail/debug에 기록한다
  - 실제 호출 시점 `path` / `href`
  - `top-level window` 여부
  - `document.readyState` / `visibilityState` / `focus`
  - request 시점과 slot 시점의 `viewport`, `secure`, `mobile`, `touch`
  - GPT script tag 존재 수
  - `window.googletag` 존재 여부
  - `apiReady` / `pubadsReady`
  - `defineOutOfPageSlot` / `display` / rewarded enum availability
  - app 기준 `enableServices()` 실행 여부
  - 실제 `slotReturnedNull` 여부
- `src/components/dev/DevDebugPanel.tsx`에서
  현재 page diagnostics, 현재 GPT 상태, 마지막 광고 시도의 structured debug를 바로 확인할 수 있다
- `getRewardedAdAvailability()`는 이제 `last unsupported` 결과만으로 CTA를 영구 비활성화하지 않는다.
  config가 살아 있으면 재시도를 허용하고, 마지막 unsupported detail은 진단 힌트로만 남긴다
- production 배포판에서는 풀 `DevDebugPanel`을 다시 열지 않고,
  `?ad_debug=1`일 때만 `ReadOnlyAdDebugPanel`이 노출된다
- 이 read-only 패널에서는 rewarded 진단만 볼 수 있고,
  재화 수정 / 세이브 조작 / mock 결과 변경 / provider override는 노출되지 않는다
- 최근 패스에서는 `gpt.js` 로드 경로도 추가로 기록한다
  - script append 시도 여부
  - append target(`head` / `body` / `none`)
  - existing script reuse 여부
  - append 직후 script tag가 DOM에 남았는지
  - `onload` / `onerror` / `timeout` 발생 여부
  - script `src`
  - timeout ms
  - `scriptLoadOutcome` / `scriptLoadClassification`
  - `securitypolicyviolation` 기반 CSP 의심 신호(있을 때만 hint)
- 이번 기준으로는 timeout 진단을 아래 3단계로 분리한다
  - A. script load
  - B. GPT bootstrap / services init
  - C. rewarded slot creation
- 따라서 `googletag=yes`, `apiReady=yes`, `onload=yes`인데도 실패하면
  더 이상 무조건 script load timeout으로 보지 않고,
  `bootstrapStarted` / `bootstrapCompleted` / `servicesEnableAttempted` /
  `servicesEnabledByApp` / `slotAttempted` / `slotReturnedNull`로 실제 정지 지점을 본다
- 실제 모바일 Safari 배포에서 한 번 확인된 케이스는
  `googletag.apiReady === true`와 필수 GPT API surface가 이미 살아 있는데도
  `googletag.cmd` 배열이 없다는 이유만으로 bootstrap을 실패 처리한 경우였다.
  지금은 `cmd`는 진단 신호로만 남기고, bootstrap 완료 조건은
  `apiReady + pubads + enableServices + defineOutOfPageSlot + display + rewarded enum`
  기준으로 본다.
- `ensureWindowGoogletagShell()`도 기존 GPT 객체를 지우지 않고 merge 방식으로
  `cmd`만 보강하도록 수정했다. 따라서 `cmd` 부재 자체가 다시 API surface 손실로
  번지지 않는다.
- 따라서 배포판에서 `web-gpt-rewarded:timeout`이 나더라도,
  이제는 최소한 아래를 구분할 수 있다
  - script stage timeout
  - bootstrap stage timeout
  - services init failure
  - slot stage timeout / `slotReturnedNull`

필수 유지 조건:
- 실패 상태에서 pending claim 삭제 금지
- 성공 상태에서만 x2 claim 함수 호출

---

## 8) dev/mock/test mode 정책

### 8-1. 기본 원칙
- dev 기본은 mock fallback 우선
- 실제 web provider 경로 검증은 명시적으로 전환해서 실행

현재 로컬 `.env.local` 반영값은 `web-gpt-rewarded`다.
즉, 로컬 dev를 그대로 띄우면 실제 web provider 경로를 먼저 타게 된다.

### 8-2. local override (디버그)
- provider override:
  - `coffee2048_rewarded_ad_provider_override`
  - 값: `mock` | `web-gpt-rewarded` | `unsupported` | `auto`
- mock outcome:
  - `coffee2048_mock_rewarded_ad_outcome`
  - 값: `success` | `cancel` | `error` | `no_fill` | `unsupported`
- ad unit override:
  - `coffee2048_rewarded_gpt_offline_ad_unit_path`
  - `coffee2048_rewarded_gpt_puzzle_ad_unit_path`

### 8-3. 테스트 정책
- 기존 회귀:
  - `tests/visual/rewarded-ad-claims.spec.ts`
- web provider 경로 회귀:
  - `tests/visual/web-gpt-rewarded.spec.ts`
  - fake `googletag` 기반으로 success/cancel/no_fill/unsupported 검증

### 8-4. 개발/테스트에서 mock <-> 실광고 전환 방법

- 실광고 provider 경로 확인:
  - `.env.local`의 `NEXT_PUBLIC_REWARDED_AD_PROVIDER=web-gpt-rewarded` 유지
  - 필요한 ad unit path 2종 유지
- mock으로 임시 전환:
  - 브라우저 디버그 패널에서 provider override를 `mock`으로 변경
  - 또는 `.env.local`에서 provider 값을 `mock`으로 바꾼 뒤 dev server 재시작
- 미지원 fallback 확인:
  - 디버그 패널에서 provider override를 `unsupported`로 변경
- mock 결과별 확인:
  - 디버그 패널에서 `success / cancel / error / no_fill / unsupported` 선택

운영 권장:
- 로컬 수동 QA는 `.env.local` + 디버그 override를 사용
- 자동 테스트는 기존 mock/fake provider 기반 회귀를 유지

---

## 9) 실제 출시 전 QA 체크리스트

### 9-1. 사전 설정
- [ ] prod env 5종이 배포 환경에 정확히 주입됨
- [ ] `offline`/`puzzle` ad unit path가 서로 다른 placement에 정확히 연결됨
- [ ] 테스트 line item과 실 line item 구분 상태 확인

### 9-2. 기능/정책
- [ ] `offline_reward_double` 성공 시에만 x2 적용
- [ ] `puzzle_result_double` 성공 시 코인+원두만 x2 적용
- [ ] 퍼즐 하트/미션/도감/손님 메타는 배수되지 않음
- [ ] claim 후 새로고침 시 중복 수령 불가
- [ ] 광고 실패 상태(`cancelled`, `error`, `no_fill`, `unsupported`)에서 기본 수령 가능

### 9-3. 환경/운영
- [ ] 지원 브라우저/디바이스에서 rewarded 노출 가능 여부 확인
- [ ] 미지원 환경에서 `unsupported` fallback이 UX를 깨지 않는지 확인
- [ ] no_fill 비율 모니터링 기준 수립(placement별)
- [ ] `timeout`이 뜨면 `?ad_debug=1` 패널에서
      `scriptLoaded`, `bootstrapStarted`, `bootstrapCompleted`,
      `servicesEnableAttempted`, `servicesEnabledByApp`,
      `slotAttempted`, `slotReturnedNull`을 먼저 확인
- [ ] 같은 패널에서 `cmd length`와 `servicesEnableError`를 함께 보고,
      `cmd` 부재가 실제 blocker인지 이미 우회된 진단 신호인지 구분
- [ ] `unsupported`가 뜨면 inventory보다 먼저 `DevDebugPanel`의
      viewport/mobile/secure 진단과 마지막 detail을 확인
- [ ] page/GPT 상태가 정상인데도 `slotReturnedNull=true`이면 아래 순서로 점검
      1) GAM의 `Block non-instream video ads` 보호 비활성화 여부
      2) rewarded ad unit / line item / inventory 연결
      3) 실제 브라우저/웹뷰 조합 지원 범위

### 9-4. 회귀
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] rewarded 관련 Playwright 타깃 테스트 통과 확인

## 9-5. CSP / headers / preload 점검 메모

현재 레포 기준:
- `next.config.ts`에는 `headers()`나 `Content-Security-Policy` 설정이 없다
- `netlify.toml` 파일이 없다
- `_headers` 파일도 없다
- 즉, 코드 저장소 안에서는 GPT script를 막는 CSP/header 설정이 확인되지 않았다

운영 의미:
- Netlify UI의 custom headers
- 상위 CDN / reverse proxy
- 브라우저 확장 / 콘텐츠 차단기

같이 **레포 밖에서** 주입되는 정책을 따로 확인해야 한다.

GPT 쪽 권장:
- Google 문서 기준 GPT는 고정 allowlist형 CSP보다 **nonce 기반 strict CSP**를 권장한다
- 최소 부트 경로인 `https://securepubads.g.doubleclick.net/tag/js/gpt.js` 로딩은 열려 있어야 한다
- 다만 creative/frame/connect 도메인은 고정 allowlist로 오래 유지하기 어렵다
- 가능하면 `Content-Security-Policy-Report-Only`로 먼저 위반 보고를 수집한다

현재 코드의 preload 전략:
- `src/lib/ads/rewardedAds.ts`에 `preloadRewardedAdRuntime()`를 추가했다
- 이 함수는 `PuzzleScreen`, `OfflineSalesCard`에서 **surface mount 시점**에만 얇게 호출된다
- 선택 이유:
  - 앱 전체 진입 직후 preload보다 과도한 선로딩을 줄일 수 있음
  - 실제 광고 CTA가 있는 화면에서만 먼저 GPT 로딩을 시작할 수 있음
  - 결과 모달 버튼 클릭 직전 lazy load보다 timeout 체감을 줄일 수 있음

대안 비교:
- 앱 진입 후 preload:
  - 장점: 가장 빨리 warm-up 가능
  - 단점: 광고 surface에 진입하지 않아도 모든 세션에서 GPT를 일찍 로드
- 결과 모달 진입 시 preload:
  - 장점: 퍼즐 보상 UX에 더 직접적
  - 단점: 클릭 직전 대비 낫지만 오프라인 보상 surface와 공통화가 약함
- 현재 선택한 surface mount preload:
  - 두 광고 placement에 공통 적용 가능하고, 조기 로드와 과도한 전역 선로딩 사이의 절충안

---

## 10) 1.1 앱 패키징 전환 시 교체 포인트

1.1에서 앱 패키징 + 모바일 SDK로 갈 때의 원칙:
- 유지:
  - `requestRewardedAd(placement)` 외부 계약
  - placement 2종
  - claim/store 최종 권한
  - 퍼즐 x2 정책(코인+원두만)
- 교체:
  - `src/lib/ads/rewardedAds.ts` 내부 provider 구현
  - web-gpt-rewarded 분기를 모바일 SDK adapter로 대체/확장

즉, 운영 전환은 provider 내부 구현 교체 중심으로 하고,
UI/스토어/보상 정책 계약은 유지하는 것이 안전하다.

---

## 11) 운영 인수인계 최소 절차

1) 이 문서 확인  
2) env 5종 주입 확인  
3) GAM ad unit 2개/line item 상태 확인  
4) 지원/미지원/no_fill 시나리오 QA  
5) 배포 후 fill 지표 추적 및 line item 조정
