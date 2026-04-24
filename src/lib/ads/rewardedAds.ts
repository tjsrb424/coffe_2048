"use client";

import type {
  RewardedAdMockBehavior,
  RewardedAdPlacement,
} from "@/features/meta/types/gameState";

export type RewardedAdProviderMode =
  | "auto"
  | "mock"
  | "web-gpt-rewarded"
  | "unsupported";

export type RewardedAdProvider = "mock" | "web-gpt-rewarded" | "unsupported";

export type RewardedAdStatus =
  | "rewarded"
  | "cancelled"
  | "error"
  | "timeout"
  | "no_fill"
  | "unsupported";

export type RewardedAdResult = {
  placement: RewardedAdPlacement;
  provider: RewardedAdProvider;
  status: RewardedAdStatus;
  details?: string;
  debug?: RewardedAdDebugSnapshot;
};

export type RewardedAdAttemptSnapshot = RewardedAdResult & {
  requestedAtMs: number;
  finishedAtMs: number;
};

export type RewardedAdAvailability = {
  placement: RewardedAdPlacement;
  isSupported: boolean;
  providerMode: RewardedAdProviderMode;
  provider: RewardedAdProvider;
  source: "config" | "last_result";
  details?: string;
};

export type RewardedAdPageDiagnostics = {
  href: string | null;
  path: string | null;
  origin: string | null;
  referrer: string | null;
  isSecureContext: boolean;
  documentReadyState: string | null;
  visibilityState: string | null;
  hasFocus: boolean;
  isTopLevelWindow: boolean | null;
  canAccessTopWindow: boolean;
  viewportMetaContent: string | null;
  viewportWidthSetting: string | null;
  viewportInitialScale: number | null;
  viewportMaximumScale: number | null;
  viewportUserScalable: string | null;
  hasNeutralZoomViewport: boolean;
  isLikelyMobileDevice: boolean;
  hasTouchSupport: boolean;
  maxTouchPoints: number;
  innerWidth: number | null;
  innerHeight: number | null;
  screenWidth: number | null;
  screenHeight: number | null;
  userAgent: string | null;
  likelyUnsupportedReasons: string[];
};

export type RewardedAdGptDiagnostics = {
  scriptUrl: string;
  matchingScriptTagCount: number;
  matchingScriptPresent: boolean;
  hasWindowGoogletag: boolean;
  cmdLength: number | null;
  apiReady: boolean | null;
  pubadsReady: boolean | null;
  hasPubads: boolean;
  hasEnableServices: boolean;
  hasDefineOutOfPageSlot: boolean;
  hasDisplay: boolean;
  hasDestroySlots: boolean;
  rewardedEnumAvailable: boolean;
  rewardedEnumValue: string | null;
  servicesEnabledByApp: boolean;
};

export type RewardedAdDebugSnapshot = {
  requestedPath: string | null;
  requestedHref: string | null;
  providerMode: RewardedAdProviderMode;
  providerModeOverride: RewardedAdProviderMode | null;
  configuredProviderMode: RewardedAdProviderMode;
  adUnitPath: string | null;
  pageAtRequest: RewardedAdPageDiagnostics | null;
  pageAtSlotAttempt?: RewardedAdPageDiagnostics | null;
  gptBeforeLoad: RewardedAdGptDiagnostics | null;
  gptAfterLoad?: RewardedAdGptDiagnostics | null;
  gptAtSlotAttempt?: RewardedAdGptDiagnostics | null;
  slotFormatRequested?: string | null;
  slotReturnedNull?: boolean;
  notes?: string[];
};

export interface RewardedAdAdapter {
  requestRewardedAd(placement: RewardedAdPlacement): Promise<RewardedAdResult>;
}

type RewardedAdRuntimeConfig = {
  configuredProviderMode: RewardedAdProviderMode;
  providerModeOverride: RewardedAdProviderMode | null;
  resolvedProviderMode: RewardedAdProviderMode;
  gptScriptUrl: string;
  requestTimeoutMs: number;
  adUnitPaths: Record<RewardedAdPlacement, string | null>;
};

type GoogletagSlot = {
  addService(service: GoogletagPubAdsService): GoogletagSlot;
  getSlotElementId(): string;
  setTargeting?(key: string, value: string): GoogletagSlot;
};

type GoogletagRewardedReadyEvent = {
  slot: GoogletagSlot;
  makeRewardedVisible(): boolean;
};

type GoogletagRewardedGrantedEvent = {
  slot: GoogletagSlot;
  payload?: {
    type?: string;
    amount?: number;
  };
};

type GoogletagRewardedClosedEvent = {
  slot: GoogletagSlot;
};

type GoogletagSlotRenderEndedEvent = {
  slot: GoogletagSlot;
  isEmpty: boolean;
};

type GoogletagPubAdsService = {
  addEventListener(
    eventType:
      | "rewardedSlotReady"
      | "rewardedSlotGranted"
      | "rewardedSlotClosed"
      | "slotRenderEnded",
    listener: (
      event:
        | GoogletagRewardedReadyEvent
        | GoogletagRewardedGrantedEvent
        | GoogletagRewardedClosedEvent
        | GoogletagSlotRenderEndedEvent,
    ) => void,
  ): void;
  removeEventListener(
    eventType:
      | "rewardedSlotReady"
      | "rewardedSlotGranted"
      | "rewardedSlotClosed"
      | "slotRenderEnded",
    listener: (
      event:
        | GoogletagRewardedReadyEvent
        | GoogletagRewardedGrantedEvent
        | GoogletagRewardedClosedEvent
        | GoogletagSlotRenderEndedEvent,
    ) => void,
  ): void;
};

type GoogletagApi = {
  apiReady?: boolean;
  cmd: Array<() => void>;
  enums: {
    OutOfPageFormat: {
      REWARDED: string;
    };
  };
  pubads(): GoogletagPubAdsService;
  enableServices(): void;
  defineOutOfPageSlot(
    adUnitPath: string,
    format: string,
  ): GoogletagSlot | null;
  display(slot: GoogletagSlot | string): void;
  destroySlots?(slots?: GoogletagSlot[]): boolean;
};

export const REWARDED_AD_MOCK_OUTCOME_STORAGE_KEY =
  "coffee2048_mock_rewarded_ad_outcome" as const;
export const REWARDED_AD_MOCK_DELAY_STORAGE_KEY =
  "coffee2048_mock_rewarded_ad_delay_ms" as const;
export const REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY =
  "coffee2048_rewarded_ad_provider_override" as const;
export const REWARDED_AD_GPT_OFFLINE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY =
  "coffee2048_rewarded_gpt_offline_ad_unit_path" as const;
export const REWARDED_AD_GPT_PUZZLE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY =
  "coffee2048_rewarded_gpt_puzzle_ad_unit_path" as const;
export const REWARDED_AD_LAST_RESULT_STORAGE_KEY =
  "coffee2048_rewarded_ad_last_result" as const;

const REWARDED_AD_RESULT_EVENT_NAME = "coffee2048:rewarded-ad-result";

const DEFAULT_GPT_SCRIPT_URL =
  "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
const DEFAULT_REQUEST_TIMEOUT_MS = 8_000;

let gptLoadPromise: Promise<GoogletagApi> | null = null;
let gptServicesEnabled = false;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function readMockOutcome(): RewardedAdMockBehavior {
  if (typeof window === "undefined") return "success";
  const raw = window.localStorage.getItem(REWARDED_AD_MOCK_OUTCOME_STORAGE_KEY);
  return raw === "cancel" ||
    raw === "error" ||
    raw === "timeout" ||
    raw === "no_fill" ||
    raw === "unsupported"
    ? raw
    : "success";
}

function readMockDelayMs(): number {
  if (typeof window === "undefined") return 0;
  const raw = Number(window.localStorage.getItem(REWARDED_AD_MOCK_DELAY_STORAGE_KEY) ?? "300");
  if (!Number.isFinite(raw)) return 300;
  return Math.max(0, Math.floor(raw));
}

function readProviderModeOverride(): RewardedAdProviderMode | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY);
  return raw === "auto" ||
    raw === "mock" ||
    raw === "web-gpt-rewarded" ||
    raw === "unsupported"
    ? raw
    : null;
}

function readAdUnitPathOverride(
  placement: RewardedAdPlacement,
): string | null {
  if (typeof window === "undefined") return null;
  const storageKey =
    placement === "offline_reward_double"
      ? REWARDED_AD_GPT_OFFLINE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY
      : REWARDED_AD_GPT_PUZZLE_AD_UNIT_PATH_OVERRIDE_STORAGE_KEY;
  const raw = window.localStorage.getItem(storageKey)?.trim();
  return raw ? raw : null;
}

function readProviderModeFromEnv(): RewardedAdProviderMode {
  const raw = process.env.NEXT_PUBLIC_REWARDED_AD_PROVIDER?.trim();
  return raw === "mock" || raw === "web-gpt-rewarded" || raw === "unsupported"
    ? raw
    : "auto";
}

function readRequestTimeoutMs(): number {
  const raw = Number(
    process.env.NEXT_PUBLIC_REWARDED_AD_REQUEST_TIMEOUT_MS ??
      `${DEFAULT_REQUEST_TIMEOUT_MS}`,
  );
  if (!Number.isFinite(raw)) return DEFAULT_REQUEST_TIMEOUT_MS;
  return Math.max(2_000, Math.floor(raw));
}

function readRuntimeConfig(): RewardedAdRuntimeConfig {
  const configuredProviderMode = readProviderModeFromEnv();
  const providerModeOverride = readProviderModeOverride();
  const adUnitPaths: Record<RewardedAdPlacement, string | null> = {
    offline_reward_double:
      readAdUnitPathOverride("offline_reward_double") ??
      process.env.NEXT_PUBLIC_GAM_REWARDED_OFFLINE_AD_UNIT_PATH?.trim() ??
      null,
    puzzle_result_double:
      readAdUnitPathOverride("puzzle_result_double") ??
      process.env.NEXT_PUBLIC_GAM_REWARDED_PUZZLE_AD_UNIT_PATH?.trim() ??
      null,
  };
  const requestedMode = providerModeOverride ?? configuredProviderMode;
  const hasAtLeastOneAdUnit = Object.values(adUnitPaths).some(Boolean);
  const resolvedProviderMode =
    requestedMode !== "auto"
      ? requestedMode
      : process.env.NODE_ENV !== "production"
        ? "mock"
        : hasAtLeastOneAdUnit
          ? "web-gpt-rewarded"
          : "unsupported";

  return {
    configuredProviderMode,
    providerModeOverride,
    resolvedProviderMode,
    gptScriptUrl:
      process.env.NEXT_PUBLIC_GAM_REWARDED_SCRIPT_URL?.trim() ||
      DEFAULT_GPT_SCRIPT_URL,
    requestTimeoutMs: readRequestTimeoutMs(),
    adUnitPaths,
  };
}

function parseViewportMetaContent(content: string | null) {
  const values = new Map<string, string>();
  if (!content) return values;

  for (const rawPart of content.split(",")) {
    const part = rawPart.trim().toLowerCase();
    if (!part) continue;
    const [rawKey, ...rawValueParts] = part.split("=");
    const key = rawKey?.trim();
    if (!key) continue;
    values.set(key, rawValueParts.join("=").trim());
  }

  return values;
}

function parseNumericViewportValue(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isApproximately(value: number | null, target: number) {
  return value !== null && Math.abs(value - target) < 0.01;
}

function getTopLevelWindowState() {
  if (typeof window === "undefined") {
    return {
      isTopLevelWindow: null,
      canAccessTopWindow: false,
    };
  }

  try {
    return {
      isTopLevelWindow: window.top === window,
      canAccessTopWindow: true,
    };
  } catch {
    return {
      isTopLevelWindow: null,
      canAccessTopWindow: false,
    };
  }
}

export function getRewardedAdPageDiagnostics():
  | RewardedAdPageDiagnostics
  | null {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof navigator === "undefined"
  ) {
    return null;
  }

  const viewportMetaContent =
    document
      .querySelector('meta[name="viewport"]')
      ?.getAttribute("content")
      ?.trim() ?? null;
  const viewportValues = parseViewportMetaContent(viewportMetaContent);
  const viewportWidthSetting = viewportValues.get("width") ?? null;
  const viewportInitialScale = parseNumericViewportValue(
    viewportValues.get("initial-scale"),
  );
  const viewportMaximumScale = parseNumericViewportValue(
    viewportValues.get("maximum-scale"),
  );
  const viewportUserScalable = viewportValues.get("user-scalable") ?? null;
  const topLevelWindowState = getTopLevelWindowState();

  const maxTouchPoints =
    typeof navigator.maxTouchPoints === "number" ? navigator.maxTouchPoints : 0;
  const hasTouchSupport = "ontouchstart" in window || maxTouchPoints > 0;
  const userAgent = navigator.userAgent.toLowerCase();
  const userAgentData = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData;
  const isLikelyMobileDevice =
    userAgentData?.mobile === true ||
    /android|iphone|ipod|ipad|mobile/i.test(userAgent) ||
    (hasTouchSupport &&
      typeof window.screen?.width === "number" &&
      typeof window.screen?.height === "number" &&
      Math.min(window.screen.width, window.screen.height) <= 1024);

  const likelyUnsupportedReasons: string[] = [];
  if (!viewportMetaContent) {
    likelyUnsupportedReasons.push("viewport_meta_missing");
  }
  if (viewportWidthSetting !== "device-width") {
    likelyUnsupportedReasons.push("viewport_width_not_device_width");
  }
  if (!isApproximately(viewportInitialScale, 1)) {
    likelyUnsupportedReasons.push("viewport_initial_scale_not_1");
  }
  if (viewportMaximumScale !== null && viewportMaximumScale <= 1) {
    likelyUnsupportedReasons.push("viewport_zoom_locked");
  }
  if (viewportUserScalable === "no") {
    likelyUnsupportedReasons.push("viewport_user_scalable_disabled");
  }
  if (!window.isSecureContext) {
    likelyUnsupportedReasons.push("insecure_context");
  }
  if (topLevelWindowState.isTopLevelWindow === false) {
    likelyUnsupportedReasons.push("not_top_level_window");
  }
  if (!topLevelWindowState.canAccessTopWindow) {
    likelyUnsupportedReasons.push("top_window_inaccessible");
  }
  if (!isLikelyMobileDevice) {
    likelyUnsupportedReasons.push("device_not_likely_mobile");
  }
  if (!hasTouchSupport) {
    likelyUnsupportedReasons.push("touch_not_detected");
  }

  return {
    href: window.location.href,
    path: window.location.pathname,
    origin: window.location.origin,
    referrer: document.referrer || null,
    isSecureContext: window.isSecureContext,
    documentReadyState: document.readyState,
    visibilityState: document.visibilityState,
    hasFocus:
      typeof document.hasFocus === "function" ? document.hasFocus() : false,
    isTopLevelWindow: topLevelWindowState.isTopLevelWindow,
    canAccessTopWindow: topLevelWindowState.canAccessTopWindow,
    viewportMetaContent,
    viewportWidthSetting,
    viewportInitialScale,
    viewportMaximumScale,
    viewportUserScalable,
    hasNeutralZoomViewport:
      viewportWidthSetting === "device-width" &&
      isApproximately(viewportInitialScale, 1) &&
      (viewportMaximumScale === null || viewportMaximumScale > 1) &&
      viewportUserScalable !== "no",
    isLikelyMobileDevice,
    hasTouchSupport,
    maxTouchPoints,
    innerWidth: typeof window.innerWidth === "number" ? window.innerWidth : null,
    innerHeight:
      typeof window.innerHeight === "number" ? window.innerHeight : null,
    screenWidth:
      typeof window.screen?.width === "number" ? window.screen.width : null,
    screenHeight:
      typeof window.screen?.height === "number" ? window.screen.height : null,
    userAgent: navigator.userAgent,
    likelyUnsupportedReasons,
  };
}

function getRewardedAdGptDiagnostics(
  scriptUrl: string,
): RewardedAdGptDiagnostics | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const googletag = getWindowGoogletag();
  const googletagWithPubadsReady = googletag as
    | (Partial<GoogletagApi> & { pubadsReady?: boolean })
    | undefined;
  const matchingScriptTagCount = document.querySelectorAll(
    `script[src="${scriptUrl}"]`,
  ).length;

  return {
    scriptUrl,
    matchingScriptTagCount,
    matchingScriptPresent: matchingScriptTagCount > 0,
    hasWindowGoogletag: !!googletag,
    cmdLength: Array.isArray(googletag?.cmd) ? googletag.cmd.length : null,
    apiReady:
      typeof googletag?.apiReady === "boolean" ? googletag.apiReady : null,
    pubadsReady:
      typeof googletagWithPubadsReady?.pubadsReady === "boolean"
        ? googletagWithPubadsReady.pubadsReady ?? null
        : null,
    hasPubads: typeof googletag?.pubads === "function",
    hasEnableServices: typeof googletag?.enableServices === "function",
    hasDefineOutOfPageSlot:
      typeof googletag?.defineOutOfPageSlot === "function",
    hasDisplay: typeof googletag?.display === "function",
    hasDestroySlots: typeof googletag?.destroySlots === "function",
    rewardedEnumAvailable: !!googletag?.enums?.OutOfPageFormat?.REWARDED,
    rewardedEnumValue: googletag?.enums?.OutOfPageFormat?.REWARDED ?? null,
    servicesEnabledByApp: gptServicesEnabled,
  };
}

function formatRewardedAdPageDiagnostics(
  diagnostics: RewardedAdPageDiagnostics | null,
): string {
  if (!diagnostics) return "page diagnostics unavailable";

  const size =
    diagnostics.innerWidth !== null && diagnostics.innerHeight !== null
      ? `${diagnostics.innerWidth}x${diagnostics.innerHeight}`
      : "unknown";
  const reasons =
    diagnostics.likelyUnsupportedReasons.length > 0
      ? diagnostics.likelyUnsupportedReasons.join(",")
      : "no_obvious_page_level_issue";

  return [
    `likelyCause=${reasons}`,
    `secure=${diagnostics.isSecureContext}`,
    `topLevel=${diagnostics.isTopLevelWindow}`,
    `mobile=${diagnostics.isLikelyMobileDevice}`,
    `touch=${diagnostics.hasTouchSupport}`,
    `maxTouchPoints=${diagnostics.maxTouchPoints}`,
    `readyState=${diagnostics.documentReadyState ?? "unknown"}`,
    `visibility=${diagnostics.visibilityState ?? "unknown"}`,
    `viewport="${diagnostics.viewportMetaContent ?? "missing"}"`,
    `size=${size}`,
    diagnostics.path ? `path=${diagnostics.path}` : null,
  ]
    .filter(Boolean)
    .join("; ");
}

function formatRewardedAdGptDiagnostics(
  diagnostics: RewardedAdGptDiagnostics | null,
): string {
  if (!diagnostics) return "gpt diagnostics unavailable";

  return [
    `scriptPresent=${diagnostics.matchingScriptPresent}`,
    `scriptCount=${diagnostics.matchingScriptTagCount}`,
    `hasGoogletag=${diagnostics.hasWindowGoogletag}`,
    `apiReady=${diagnostics.apiReady}`,
    `pubadsReady=${diagnostics.pubadsReady}`,
    `hasDefineOutOfPageSlot=${diagnostics.hasDefineOutOfPageSlot}`,
    `rewardedEnum=${diagnostics.rewardedEnumValue ?? "missing"}`,
    `cmdLength=${diagnostics.cmdLength ?? "n/a"}`,
    `servicesEnabledByApp=${diagnostics.servicesEnabledByApp}`,
  ].join("; ");
}

function buildUnsupportedSlotDetail(
  debug: RewardedAdDebugSnapshot,
): string {
  const notes = [...(debug.notes ?? [])];
  if (debug.pageAtSlotAttempt?.likelyUnsupportedReasons.length) {
    notes.push(
      `pageHints=${debug.pageAtSlotAttempt.likelyUnsupportedReasons.join(",")}`,
    );
  } else {
    notes.push(
      "pageHints=no_obvious_page_level_issue",
      "remainingLikelyCauses=browser_or_webview_support_limit,gam_non_instream_block,ad_unit_or_line_item_setup",
    );
  }

  return [
    "defineOutOfPageSlot returned null",
    formatRewardedAdPageDiagnostics(debug.pageAtSlotAttempt ?? debug.pageAtRequest),
    formatRewardedAdGptDiagnostics(debug.gptAtSlotAttempt ?? debug.gptAfterLoad ?? debug.gptBeforeLoad),
    `adUnitPath=${debug.adUnitPath ?? "missing"}`,
    `providerMode=${debug.providerMode}`,
    notes.join("; "),
  ].join("; ");
}

function logRewardedAdDiagnostics(
  message: string,
  diagnostics: RewardedAdPageDiagnostics | null = null,
) {
  if (typeof console === "undefined") return;
  if (diagnostics) {
    console.warn(`[rewardedAds] ${message}`, diagnostics);
    return;
  }
  console.warn(`[rewardedAds] ${message}`);
}

function getWindowGoogletag():
  | (Partial<GoogletagApi> & { cmd?: Array<() => void> })
  | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as typeof window & { googletag?: Partial<GoogletagApi> & { cmd?: Array<() => void> } })
    .googletag;
}

function isGoogletagReady(
  value: Partial<GoogletagApi> | undefined,
): value is GoogletagApi {
  return !!value &&
    Array.isArray(value.cmd) &&
    typeof value.pubads === "function" &&
    typeof value.defineOutOfPageSlot === "function" &&
    typeof value.enableServices === "function" &&
    typeof value.display === "function" &&
    !!value.enums?.OutOfPageFormat?.REWARDED;
}

function ensureWindowGoogletagShell() {
  if (typeof window === "undefined") return;
  const current = getWindowGoogletag();
  if (current?.cmd) return;
  (window as typeof window & { googletag?: { cmd: Array<() => void> } }).googletag = {
    cmd: current?.cmd ?? [],
  };
}

async function ensureGoogletagLoaded(
  scriptUrl: string,
  timeoutMs: number,
): Promise<GoogletagApi> {
  const current = getWindowGoogletag();
  if (isGoogletagReady(current)) return current;
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("rewarded ads require a browser environment");
  }
  if (gptLoadPromise) return gptLoadPromise;

  ensureWindowGoogletagShell();

  gptLoadPromise = new Promise<GoogletagApi>((resolve, reject) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      cleanup();
      gptLoadPromise = null;
      reject(new Error("GPT load timed out"));
    }, timeoutMs);

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`,
    ) as HTMLScriptElement | null;

    const finish = () => {
      if (settled) return;
      const next = getWindowGoogletag();
      if (!isGoogletagReady(next)) return;
      settled = true;
      cleanup();
      resolve(next);
    };

    const pollId = window.setInterval(finish, 50);

    const onLoad = () => {
      finish();
    };

    const onError = () => {
      cleanup();
      gptLoadPromise = null;
      reject(new Error("GPT script failed to load"));
    };

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(pollId);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const script = existingScript ?? document.createElement("script");
    if (!existingScript) {
      script.async = true;
      script.src = scriptUrl;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    finish();
  });

  return gptLoadPromise;
}

function ensureGoogletagServicesEnabled(googletag: GoogletagApi) {
  if (gptServicesEnabled) return;
  googletag.enableServices();
  gptServicesEnabled = true;
}

function recordRewardedAdAttempt(snapshot: RewardedAdAttemptSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      REWARDED_AD_LAST_RESULT_STORAGE_KEY,
      JSON.stringify(snapshot),
    );
    window.dispatchEvent(
      new CustomEvent<RewardedAdAttemptSnapshot>(REWARDED_AD_RESULT_EVENT_NAME, {
        detail: snapshot,
      }),
    );
  } catch {
    // Diagnostics should never block the rewarded flow.
  }
}

function providerFromResolvedMode(
  providerMode: RewardedAdProviderMode,
): RewardedAdProvider {
  if (providerMode === "mock") return "mock";
  if (providerMode === "web-gpt-rewarded") return "web-gpt-rewarded";
  return "unsupported";
}

class MockRewardedAdAdapter implements RewardedAdAdapter {
  async requestRewardedAd(
    placement: RewardedAdPlacement,
  ): Promise<RewardedAdResult> {
    await sleep(readMockDelayMs());
    const outcome = readMockOutcome();
    if (outcome === "cancel") {
      return { placement, provider: "mock", status: "cancelled" };
    }
    if (outcome === "error") {
      return { placement, provider: "mock", status: "error" };
    }
    if (outcome === "timeout") {
      return { placement, provider: "mock", status: "timeout" };
    }
    if (outcome === "no_fill") {
      return { placement, provider: "mock", status: "no_fill" };
    }
    if (outcome === "unsupported") {
      return { placement, provider: "mock", status: "unsupported" };
    }
    return { placement, provider: "mock", status: "rewarded" };
  }
}

class UnsupportedRewardedAdAdapter implements RewardedAdAdapter {
  async requestRewardedAd(
    placement: RewardedAdPlacement,
  ): Promise<RewardedAdResult> {
    return {
      placement,
      provider: "unsupported",
      status: "unsupported",
      details: "rewarded ads are not configured for this environment",
    };
  }
}

class WebGptRewardedAdAdapter implements RewardedAdAdapter {
  constructor(private readonly config: RewardedAdRuntimeConfig) {}

  async requestRewardedAd(
    placement: RewardedAdPlacement,
  ): Promise<RewardedAdResult> {
    const baseDebug: RewardedAdDebugSnapshot = {
      requestedPath:
        typeof window !== "undefined" ? window.location.pathname : null,
      requestedHref:
        typeof window !== "undefined" ? window.location.href : null,
      providerMode: this.config.resolvedProviderMode,
      providerModeOverride: this.config.providerModeOverride,
      configuredProviderMode: this.config.configuredProviderMode,
      adUnitPath: this.config.adUnitPaths[placement],
      pageAtRequest: getRewardedAdPageDiagnostics(),
      gptBeforeLoad: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
      notes: [],
    };
    const adUnitPath = this.config.adUnitPaths[placement];
    if (!adUnitPath) {
      const details = "missing GAM rewarded ad unit path";
      logRewardedAdDiagnostics(`[${placement}] ${details}`);
      return {
        placement,
        provider: "web-gpt-rewarded",
        status: "unsupported",
        details,
        debug: {
          ...baseDebug,
          notes: [...(baseDebug.notes ?? []), "config_missing_ad_unit_path"],
        },
      };
    }

    let googletag: GoogletagApi;
    try {
      googletag = await ensureGoogletagLoaded(
        this.config.gptScriptUrl,
        this.config.requestTimeoutMs,
      );
    } catch (error) {
      const details =
        error instanceof Error ? error.message : "failed to load GPT runtime";
      return {
        placement,
        provider: "web-gpt-rewarded",
        status:
          typeof details === "string" && /timed out/i.test(details)
            ? "timeout"
            : "error",
        details,
        debug: {
          ...baseDebug,
          gptAfterLoad: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
          notes: [
            ...(baseDebug.notes ?? []),
            "gpt_load_failed",
            `gpt_load_error=${details}`,
          ],
        },
      };
    }

    return new Promise<RewardedAdResult>((resolve) => {
      const run = () => {
        const debugAtSlotAttempt: RewardedAdDebugSnapshot = {
          ...baseDebug,
          gptAfterLoad: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
          gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
          pageAtSlotAttempt: getRewardedAdPageDiagnostics(),
          slotFormatRequested: googletag.enums.OutOfPageFormat.REWARDED ?? null,
          notes: [...(baseDebug.notes ?? [])],
        };
        const pubads = googletag.pubads();
        const slot = googletag.defineOutOfPageSlot(
          adUnitPath,
          googletag.enums.OutOfPageFormat.REWARDED,
        );

        if (!slot) {
          const debug = {
            ...debugAtSlotAttempt,
            slotReturnedNull: true,
            notes: [
              ...(debugAtSlotAttempt.notes ?? []),
              "slot_creation_returned_null",
            ],
          };
          logRewardedAdDiagnostics(
            `[${placement}] rewarded slot is unsupported on this page or device`,
            debug.pageAtSlotAttempt ?? debug.pageAtRequest,
          );
          resolve({
            placement,
            provider: "web-gpt-rewarded",
            status: "unsupported",
            details: buildUnsupportedSlotDetail(debug),
            debug,
          });
          return;
        }

        slot.addService(pubads);
        slot.setTargeting?.("coffee2048_rewarded_placement", placement);

        let settled = false;
        let rewardGranted = false;
        const timeoutId = window.setTimeout(() => {
          finalize({
            placement,
            provider: "web-gpt-rewarded",
            status: "timeout",
            details: "rewarded slot timed out before completion",
            debug: {
              ...debugAtSlotAttempt,
              slotReturnedNull: false,
              notes: [
                ...(debugAtSlotAttempt.notes ?? []),
                "slot_request_timeout",
              ],
            },
          });
        }, this.config.requestTimeoutMs);

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          pubads.removeEventListener("rewardedSlotReady", onReady);
          pubads.removeEventListener("rewardedSlotGranted", onGranted);
          pubads.removeEventListener("rewardedSlotClosed", onClosed);
          pubads.removeEventListener("slotRenderEnded", onRenderEnded);
          googletag.destroySlots?.([slot]);
        };

        const finalize = (result: RewardedAdResult) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(result);
        };

        const isTargetSlot = (
          event:
            | GoogletagRewardedReadyEvent
            | GoogletagRewardedGrantedEvent
            | GoogletagRewardedClosedEvent
            | GoogletagSlotRenderEndedEvent,
        ) => event.slot === slot;

        const onReady = (
          event:
            | GoogletagRewardedReadyEvent
            | GoogletagSlotRenderEndedEvent
            | GoogletagRewardedGrantedEvent
            | GoogletagRewardedClosedEvent,
        ) => {
          if (!("makeRewardedVisible" in event) || !isTargetSlot(event)) return;
          const shown = event.makeRewardedVisible();
          if (!shown) {
            finalize({
              placement,
              provider: "web-gpt-rewarded",
              status: "error",
              details: "rewarded slot failed to become visible",
              debug: {
                ...debugAtSlotAttempt,
                slotReturnedNull: false,
                notes: [
                  ...(debugAtSlotAttempt.notes ?? []),
                  "rewarded_visible_failed",
                ],
              },
            });
          }
        };

        const onGranted = (
          event:
            | GoogletagRewardedReadyEvent
            | GoogletagSlotRenderEndedEvent
            | GoogletagRewardedGrantedEvent
            | GoogletagRewardedClosedEvent,
        ) => {
          if (!("payload" in event) || !isTargetSlot(event)) return;
          rewardGranted = true;
        };

        const onClosed = (
          event:
            | GoogletagRewardedReadyEvent
            | GoogletagSlotRenderEndedEvent
            | GoogletagRewardedGrantedEvent
            | GoogletagRewardedClosedEvent,
        ) => {
          if (
            !isTargetSlot(event) ||
            "isEmpty" in event ||
            "payload" in event ||
            "makeRewardedVisible" in event
          ) {
            return;
          }
          finalize({
            placement,
            provider: "web-gpt-rewarded",
            status: rewardGranted ? "rewarded" : "cancelled",
            debug: {
              ...debugAtSlotAttempt,
              slotReturnedNull: false,
              notes: [
                ...(debugAtSlotAttempt.notes ?? []),
                rewardGranted
                  ? "reward_granted_before_close"
                  : "closed_without_reward",
              ],
            },
          });
        };

        const onRenderEnded = (
          event:
            | GoogletagRewardedReadyEvent
            | GoogletagSlotRenderEndedEvent
            | GoogletagRewardedGrantedEvent
            | GoogletagRewardedClosedEvent,
        ) => {
          if (!("isEmpty" in event) || !isTargetSlot(event)) return;
          if (!event.isEmpty) return;
          finalize({
            placement,
            provider: "web-gpt-rewarded",
            status: "no_fill",
            details: "rewarded slot returned no fill",
            debug: {
              ...debugAtSlotAttempt,
              slotReturnedNull: false,
              notes: [
                ...(debugAtSlotAttempt.notes ?? []),
                "slot_render_ended_empty",
              ],
            },
          });
        };

        pubads.addEventListener("rewardedSlotReady", onReady);
        pubads.addEventListener("rewardedSlotGranted", onGranted);
        pubads.addEventListener("rewardedSlotClosed", onClosed);
        pubads.addEventListener("slotRenderEnded", onRenderEnded);

        ensureGoogletagServicesEnabled(googletag);
        googletag.display(slot);
      };

      if (googletag.apiReady) {
        run();
        return;
      }
      googletag.cmd.push(run);
    });
  }
}

function createRewardedAdAdapter(
  config: RewardedAdRuntimeConfig,
): RewardedAdAdapter {
  switch (config.resolvedProviderMode) {
    case "mock":
      return new MockRewardedAdAdapter();
    case "web-gpt-rewarded":
      return new WebGptRewardedAdAdapter(config);
    case "unsupported":
    case "auto":
    default:
      return new UnsupportedRewardedAdAdapter();
  }
}

export function requestRewardedAd(
  placement: RewardedAdPlacement,
): Promise<RewardedAdResult> {
  const config = readRuntimeConfig();
  const requestedAtMs = Date.now();
  return createRewardedAdAdapter(config)
    .requestRewardedAd(placement)
    .then((result) => {
      recordRewardedAdAttempt({
        ...result,
        requestedAtMs,
        finishedAtMs: Date.now(),
      });
      return result;
    })
    .catch((error) => {
      const fallbackResult: RewardedAdResult = {
        placement,
        provider: config.resolvedProviderMode === "web-gpt-rewarded"
          ? "web-gpt-rewarded"
          : config.resolvedProviderMode === "mock"
            ? "mock"
            : "unsupported",
        status: "error",
        details:
          error instanceof Error ? error.message : "unexpected rewarded ad error",
      };
      recordRewardedAdAttempt({
        ...fallbackResult,
        requestedAtMs,
        finishedAtMs: Date.now(),
      });
      return fallbackResult;
    });
}

export function getRewardedAdMockBehavior(): RewardedAdMockBehavior {
  return readMockOutcome();
}

export function setRewardedAdMockBehavior(
  behavior: RewardedAdMockBehavior,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REWARDED_AD_MOCK_OUTCOME_STORAGE_KEY, behavior);
}

export function getRewardedAdProviderModeOverride():
  | RewardedAdProviderMode
  | null {
  return readProviderModeOverride();
}

export function setRewardedAdProviderModeOverride(
  mode: RewardedAdProviderMode | null,
) {
  if (typeof window === "undefined") return;
  if (!mode) {
    window.localStorage.removeItem(REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(REWARDED_AD_PROVIDER_OVERRIDE_STORAGE_KEY, mode);
}

export function getRewardedAdRuntimeDebugInfo() {
  const config = readRuntimeConfig();
  return {
    ...config,
    pageDiagnostics: getRewardedAdPageDiagnostics(),
    gptDiagnostics: getRewardedAdGptDiagnostics(config.gptScriptUrl),
  };
}

export function getRewardedAdAvailability(
  placement: RewardedAdPlacement,
): RewardedAdAvailability {
  const config = readRuntimeConfig();
  const provider = providerFromResolvedMode(config.resolvedProviderMode);

  if (config.resolvedProviderMode === "unsupported") {
    return {
      placement,
      isSupported: false,
      providerMode: config.resolvedProviderMode,
      provider,
      source: "config",
      details: "rewarded ads are not configured for this environment",
    };
  }

  if (
    config.resolvedProviderMode === "web-gpt-rewarded" &&
    !config.adUnitPaths[placement]
  ) {
    return {
      placement,
      isSupported: false,
      providerMode: config.resolvedProviderMode,
      provider,
      source: "config",
      details: "missing GAM rewarded ad unit path",
    };
  }

  const lastAttempt = getLastRewardedAdAttempt();
  if (
    lastAttempt?.placement === placement &&
    lastAttempt.status === "unsupported" &&
    (lastAttempt.provider === "web-gpt-rewarded" ||
      lastAttempt.provider === "unsupported")
  ) {
    return {
      placement,
      isSupported: true,
      providerMode: config.resolvedProviderMode,
      provider,
      source: "last_result",
      details: lastAttempt.details
        ? `last unsupported result: ${lastAttempt.details}`
        : "last rewarded attempt ended unsupported",
    };
  }

  return {
    placement,
    isSupported: true,
    providerMode: config.resolvedProviderMode,
    provider,
    source: "config",
  };
}

export function getLastRewardedAdAttempt():
  | RewardedAdAttemptSnapshot
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(REWARDED_AD_LAST_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RewardedAdAttemptSnapshot>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.placement !== "string" ||
      typeof parsed.provider !== "string" ||
      typeof parsed.status !== "string"
    ) {
      return null;
    }
    return {
      placement: parsed.placement as RewardedAdPlacement,
      provider: parsed.provider as RewardedAdProvider,
      status: parsed.status as RewardedAdStatus,
      details: typeof parsed.details === "string" ? parsed.details : undefined,
      debug:
        parsed.debug && typeof parsed.debug === "object"
          ? (parsed.debug as RewardedAdDebugSnapshot)
          : undefined,
      requestedAtMs:
        typeof parsed.requestedAtMs === "number" ? parsed.requestedAtMs : 0,
      finishedAtMs:
        typeof parsed.finishedAtMs === "number" ? parsed.finishedAtMs : 0,
    };
  } catch {
    return null;
  }
}

export function subscribeRewardedAdAttemptResults(
  listener: (snapshot: RewardedAdAttemptSnapshot) => void,
) {
  if (typeof window === "undefined") return () => {};
  const handleEvent = (event: Event) => {
    const detail = (event as CustomEvent<RewardedAdAttemptSnapshot>).detail;
    if (!detail) return;
    listener(detail);
  };
  window.addEventListener(REWARDED_AD_RESULT_EVENT_NAME, handleEvent);
  return () => {
    window.removeEventListener(REWARDED_AD_RESULT_EVENT_NAME, handleEvent);
  };
}
