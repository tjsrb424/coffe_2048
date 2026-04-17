export type PlayerResources = {
  coins: number;
  beans: number;
  hearts: number;
};

export type PuzzleProgress = {
  bestScore: number;
  bestTile: number;
  lastRunScore: number;
  lastRunTile: number;
  lastRunCoins: number;
  lastRunBeans: number;
  lastRunHearts: number;
  totalRuns: number;
};

export type DrinkMenuId = "americano" | "latte" | "affogato";

export type MenuStock = Record<DrinkMenuId, number>;

export type CafeState = {
  cafeLevel: number;
  roastLevel: number;
  displayLevel: number;
  ambianceLevel: number;
  /** 로스터 추출 베이스(샷). 음료 제작에 소모돼요. */
  espressoShots: number;
  /** 진열 재고 — 판매 개시 후 틱마다 줄며 코인이 들어와요. */
  menuStock: MenuStock;
  /**
   * 진열 판매 세션. true일 때만 `stepAutoSell`이 재고를 줄이며 코인을 올린다.
   * 유저가 쇼케이스에서「판매 개시」를 눌러 켠다.
   */
  displaySellingActive: boolean;
  /** 자동 판매 기준 시각(ms). 0이면 첫 진입 시 현재 시각으로만 초기화 */
  lastAutoSellAtMs: number;
  /** 마지막 오프라인 정산 기록 — 로비에서 요약 표시용 */
  lastOfflineSaleAtMs: number;
  lastOfflineSaleCoins: number;
  lastOfflineSaleSoldCount: number;
};

export type SettingsState = {
  soundOn: boolean;
  vibrationOn: boolean;
  reducedMotion: boolean;
  /** 로비 첫 방문 힌트 배너를 닫았는지(UI 전용) */
  lobbyOnboardingSeen: boolean;
};

export type MetaRuntimeState = {
  /** 하트 회복 기준 시각(ms). 0이면 첫 진입 시 현재 시각으로 초기화 */
  lastHeartRegenAtMs: number;
};

/** 웹 BM 권한(실결제 없음 — placeholder 연동용) */
export type BmEntitlementsState = {
  adFree: boolean;
  supporterTier: number;
};

/** 로비 씬 테마 등 코스메틱(퍼즐 공정성과 무관) */
export type CosmeticsState = {
  equippedThemeId: string;
  ownedThemeIds: string[];
};

/** 시즌 패스 진행(표시·저장 슬롯 — 보상 룰은 후속) */
export type PassProgressState = {
  seasonId: string;
  tier: number;
  xp: number;
  premiumUnlocked: boolean;
};

/** 특별 손님·이벤트 ID만 보관하는 가벼운 슬롯 */
export type LiveOpsSaveState = {
  unlockedGuestIds: string[];
  activeEventIds: string[];
};

export type AppPersistState = {
  playerResources: PlayerResources;
  puzzleProgress: PuzzleProgress;
  cafeState: CafeState;
  meta: MetaRuntimeState;
  settings: SettingsState;
  bm: BmEntitlementsState;
  cosmetics: CosmeticsState;
  passProgress: PassProgressState;
  liveOps: LiveOpsSaveState;
  ownedProductIds: string[];
};
