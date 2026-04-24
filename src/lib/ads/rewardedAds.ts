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
  scriptLoaded: boolean | null;
  scriptAppendAttempted: boolean;
  scriptAppendTarget: "head" | "body" | "none";
  existingScriptFound: boolean;
  existingScriptReused: boolean;
  scriptTagFoundAfterAppend: boolean | null;
  scriptElementSrc: string | null;
  scriptOnloadFired: boolean;
  scriptOnerrorFired: boolean;
  scriptTimeoutFired: boolean;
  scriptTimeoutMs: number | null;
  scriptLoadOutcome: "idle" | "loading" | "loaded" | "error" | "timeout";
  scriptLoadClassification: string | null;
  bootstrapStarted: boolean;
  bootstrapCompleted: boolean;
  bootstrapTimeoutFired: boolean;
  bootstrapTimeoutMs: number | null;
  bootstrapClassification: string | null;
  servicesEnableAttempted: boolean;
  servicesEnableError: string | null;
  cspSuspected: boolean | null;
  cspViolationDirective: string | null;
  cspViolationBlockedUri: string | null;
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
  slotAttempted?: boolean;
  slotReturnedNull?: boolean;
  failureStage?: "script" | "bootstrap" | "services" | "slot" | null;
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

type RewardedAdGptScriptLoadState = Pick<
  RewardedAdGptDiagnostics,
  | "scriptLoaded"
  | "scriptUrl"
  | "scriptAppendAttempted"
  | "scriptAppendTarget"
  | "existingScriptFound"
  | "existingScriptReused"
  | "scriptTagFoundAfterAppend"
  | "scriptElementSrc"
  | "scriptOnloadFired"
  | "scriptOnerrorFired"
  | "scriptTimeoutFired"
  | "scriptTimeoutMs"
  | "scriptLoadOutcome"
  | "scriptLoadClassification"
  | "cspSuspected"
  | "cspViolationDirective"
  | "cspViolationBlockedUri"
>;

type RewardedAdGptBootstrapState = Pick<
  RewardedAdGptDiagnostics,
  | "scriptUrl"
  | "bootstrapStarted"
  | "bootstrapCompleted"
  | "bootstrapTimeoutFired"
  | "bootstrapTimeoutMs"
  | "bootstrapClassification"
  | "servicesEnableAttempted"
  | "servicesEnabledByApp"
  | "servicesEnableError"
>;

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

let gptScriptLoadPromise: Promise<void> | null = null;
let gptBootstrapPromise: Promise<GoogletagApi> | null = null;
let gptServicesEnabled = false;
let gptScriptLoadState: RewardedAdGptScriptLoadState | null = null;
let gptBootstrapState: RewardedAdGptBootstrapState | null = null;
let rewardedAdSecurityPolicyListenerAttached = false;
const gptHintedOrigins = new Set<string>();

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

function createDefaultGptScriptLoadState(
  scriptUrl: string,
  timeoutMs: number | null = null,
): RewardedAdGptScriptLoadState {
  return {
    scriptUrl,
    scriptLoaded: null,
    scriptAppendAttempted: false,
    scriptAppendTarget: "none",
    existingScriptFound: false,
    existingScriptReused: false,
    scriptTagFoundAfterAppend: null,
    scriptElementSrc: null,
    scriptOnloadFired: false,
    scriptOnerrorFired: false,
    scriptTimeoutFired: false,
    scriptTimeoutMs: timeoutMs,
    scriptLoadOutcome: "idle",
    scriptLoadClassification: null,
    cspSuspected: null,
    cspViolationDirective: null,
    cspViolationBlockedUri: null,
  };
}

function createDefaultGptBootstrapState(
  scriptUrl: string,
  timeoutMs: number | null = null,
): RewardedAdGptBootstrapState {
  return {
    scriptUrl,
    bootstrapStarted: false,
    bootstrapCompleted: false,
    bootstrapTimeoutFired: false,
    bootstrapTimeoutMs: timeoutMs,
    bootstrapClassification: null,
    servicesEnableAttempted: false,
    servicesEnabledByApp: false,
    servicesEnableError: null,
  };
}

function getGptScriptLoadStateSnapshot(
  scriptUrl: string,
): RewardedAdGptScriptLoadState {
  return gptScriptLoadState?.scriptUrl === scriptUrl
    ? gptScriptLoadState
    : createDefaultGptScriptLoadState(scriptUrl);
}

function getGptBootstrapStateSnapshot(
  scriptUrl: string,
): RewardedAdGptBootstrapState {
  return gptBootstrapState?.scriptUrl === scriptUrl
    ? gptBootstrapState
    : createDefaultGptBootstrapState(scriptUrl);
}

function updateGptScriptLoadState(
  scriptUrl: string,
  timeoutMs: number | null,
  patch: Partial<RewardedAdGptScriptLoadState>,
) {
  const current =
    gptScriptLoadState?.scriptUrl === scriptUrl
      ? gptScriptLoadState
      : createDefaultGptScriptLoadState(scriptUrl, timeoutMs);
  gptScriptLoadState = {
    ...current,
    scriptTimeoutMs: timeoutMs ?? current.scriptTimeoutMs,
    ...patch,
  };
}

function updateGptBootstrapState(
  scriptUrl: string,
  timeoutMs: number | null,
  patch: Partial<RewardedAdGptBootstrapState>,
) {
  const current =
    gptBootstrapState?.scriptUrl === scriptUrl
      ? gptBootstrapState
      : createDefaultGptBootstrapState(scriptUrl, timeoutMs);
  gptBootstrapState = {
    ...current,
    bootstrapTimeoutMs: timeoutMs ?? current.bootstrapTimeoutMs,
    servicesEnabledByApp: gptServicesEnabled,
    ...patch,
  };
}

function ensureRewardedAdSecurityPolicyListener() {
  if (
    rewardedAdSecurityPolicyListenerAttached ||
    typeof document === "undefined" ||
    typeof window === "undefined"
  ) {
    return;
  }
  rewardedAdSecurityPolicyListenerAttached = true;
  document.addEventListener("securitypolicyviolation", (event) => {
    if (!gptScriptLoadState || gptScriptLoadState.scriptLoadOutcome !== "loading") {
      return;
    }
    const blockedUri =
      typeof event.blockedURI === "string" && event.blockedURI.length > 0
        ? event.blockedURI
        : null;
    const directive =
      typeof event.effectiveDirective === "string" && event.effectiveDirective.length > 0
        ? event.effectiveDirective
        : typeof event.violatedDirective === "string" &&
            event.violatedDirective.length > 0
          ? event.violatedDirective
          : null;
    const scriptOrigin = (() => {
      try {
        return new URL(gptScriptLoadState.scriptUrl, window.location.href).origin;
      } catch {
        return null;
      }
    })();
    const looksRelevant =
      directive?.includes("script-src") === true ||
      blockedUri?.includes("doubleclick.net") === true ||
      (scriptOrigin != null && blockedUri?.startsWith(scriptOrigin) === true);
    if (!looksRelevant) return;
    updateGptScriptLoadState(gptScriptLoadState.scriptUrl, gptScriptLoadState.scriptTimeoutMs, {
      cspSuspected: true,
      cspViolationDirective: directive,
      cspViolationBlockedUri: blockedUri,
      scriptLoadClassification: "script_blocked_by_csp",
    });
  });
}

function ensureGptConnectionHints(scriptUrl: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  let origin: string;
  try {
    origin = new URL(scriptUrl, window.location.href).origin;
  } catch {
    return;
  }
  if (gptHintedOrigins.has(origin)) return;
  const parent = document.head ?? document.body;
  if (!parent) return;

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = origin;
  preconnect.crossOrigin = "anonymous";
  preconnect.setAttribute("data-rewarded-gpt-preconnect", origin);
  parent.appendChild(preconnect);

  const dnsPrefetch = document.createElement("link");
  dnsPrefetch.rel = "dns-prefetch";
  dnsPrefetch.href = origin;
  dnsPrefetch.setAttribute("data-rewarded-gpt-dns-prefetch", origin);
  parent.appendChild(dnsPrefetch);

  gptHintedOrigins.add(origin);
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
  const scriptLoadState = getGptScriptLoadStateSnapshot(scriptUrl);
  const bootstrapState = getGptBootstrapStateSnapshot(scriptUrl);

  return {
    scriptUrl,
    matchingScriptTagCount,
    matchingScriptPresent: matchingScriptTagCount > 0,
    scriptLoaded:
      scriptLoadState.scriptLoaded ??
      (googletag?.apiReady === true ? true : null),
    scriptAppendAttempted: scriptLoadState.scriptAppendAttempted,
    scriptAppendTarget: scriptLoadState.scriptAppendTarget,
    existingScriptFound: scriptLoadState.existingScriptFound,
    existingScriptReused: scriptLoadState.existingScriptReused,
    scriptTagFoundAfterAppend: scriptLoadState.scriptTagFoundAfterAppend,
    scriptElementSrc: scriptLoadState.scriptElementSrc,
    scriptOnloadFired: scriptLoadState.scriptOnloadFired,
    scriptOnerrorFired: scriptLoadState.scriptOnerrorFired,
    scriptTimeoutFired: scriptLoadState.scriptTimeoutFired,
    scriptTimeoutMs: scriptLoadState.scriptTimeoutMs,
    scriptLoadOutcome: scriptLoadState.scriptLoadOutcome,
    scriptLoadClassification: scriptLoadState.scriptLoadClassification,
    bootstrapStarted:
      bootstrapState.bootstrapStarted || isGoogletagBootstrapReady(googletag),
    bootstrapCompleted:
      bootstrapState.bootstrapCompleted || isGoogletagBootstrapReady(googletag),
    bootstrapTimeoutFired: bootstrapState.bootstrapTimeoutFired,
    bootstrapTimeoutMs: bootstrapState.bootstrapTimeoutMs,
    bootstrapClassification: bootstrapState.bootstrapClassification,
    servicesEnableAttempted: bootstrapState.servicesEnableAttempted,
    servicesEnableError: bootstrapState.servicesEnableError,
    cspSuspected: scriptLoadState.cspSuspected,
    cspViolationDirective: scriptLoadState.cspViolationDirective,
    cspViolationBlockedUri: scriptLoadState.cspViolationBlockedUri,
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
    servicesEnabledByApp: bootstrapState.servicesEnabledByApp || gptServicesEnabled,
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
    `scriptLoaded=${diagnostics.scriptLoaded}`,
    `scriptAppendAttempted=${diagnostics.scriptAppendAttempted}`,
    `scriptAppendTarget=${diagnostics.scriptAppendTarget}`,
    `existingScriptFound=${diagnostics.existingScriptFound}`,
    `existingScriptReused=${diagnostics.existingScriptReused}`,
    `scriptTagFoundAfterAppend=${diagnostics.scriptTagFoundAfterAppend}`,
    `scriptSrc=${diagnostics.scriptElementSrc ?? "missing"}`,
    `scriptOnload=${diagnostics.scriptOnloadFired}`,
    `scriptOnerror=${diagnostics.scriptOnerrorFired}`,
    `scriptTimeout=${diagnostics.scriptTimeoutFired}`,
    `scriptTimeoutMs=${diagnostics.scriptTimeoutMs ?? "n/a"}`,
    `scriptLoadOutcome=${diagnostics.scriptLoadOutcome}`,
    `scriptLoadClassification=${diagnostics.scriptLoadClassification ?? "unknown"}`,
    `bootstrapStarted=${diagnostics.bootstrapStarted}`,
    `bootstrapCompleted=${diagnostics.bootstrapCompleted}`,
    `bootstrapTimeout=${diagnostics.bootstrapTimeoutFired}`,
    `bootstrapTimeoutMs=${diagnostics.bootstrapTimeoutMs ?? "n/a"}`,
    `bootstrapClassification=${diagnostics.bootstrapClassification ?? "unknown"}`,
    `servicesEnableAttempted=${diagnostics.servicesEnableAttempted}`,
    `servicesEnableError=${diagnostics.servicesEnableError ?? "none"}`,
    `cspSuspected=${diagnostics.cspSuspected}`,
    diagnostics.cspViolationDirective || diagnostics.cspViolationBlockedUri
      ? `cspViolation=${
          diagnostics.cspViolationDirective ?? "script-src"
        }:${diagnostics.cspViolationBlockedUri ?? "unknown"}`
      : null,
    `hasGoogletag=${diagnostics.hasWindowGoogletag}`,
    `apiReady=${diagnostics.apiReady}`,
    `pubadsReady=${diagnostics.pubadsReady}`,
    `hasDefineOutOfPageSlot=${diagnostics.hasDefineOutOfPageSlot}`,
    `rewardedEnum=${diagnostics.rewardedEnumValue ?? "missing"}`,
    `cmdLength=${diagnostics.cmdLength ?? "n/a"}`,
    `servicesEnabledByApp=${diagnostics.servicesEnabledByApp}`,
  ]
    .filter(Boolean)
    .join("; ");
}

function buildGptStageFailureDetail(
  stage: "script" | "bootstrap" | "services",
  message: string,
  debug: RewardedAdDebugSnapshot,
): string {
  const gptDiagnostics = debug.gptAfterLoad ?? debug.gptBeforeLoad;
  const notes = [...(debug.notes ?? [])];
  notes.push(`failureStage=${stage}`);
  if (gptDiagnostics?.scriptLoadClassification) {
    notes.push(`scriptLoad=${gptDiagnostics.scriptLoadClassification}`);
  }
  if (gptDiagnostics?.bootstrapClassification) {
    notes.push(`bootstrap=${gptDiagnostics.bootstrapClassification}`);
  }
  if (gptDiagnostics?.servicesEnableError) {
    notes.push(`servicesError=${gptDiagnostics.servicesEnableError}`);
  }
  if (gptDiagnostics?.cspSuspected) {
    notes.push(
      `cspHint=${gptDiagnostics.cspViolationDirective ?? "script-src"}:${
        gptDiagnostics.cspViolationBlockedUri ?? "unknown"
      }`,
    );
  } else if (
    gptDiagnostics?.scriptLoadOutcome === "timeout" &&
    gptDiagnostics.scriptAppendAttempted &&
    gptDiagnostics.scriptTagFoundAfterAppend
  ) {
    notes.push("likelyCause=script_appended_but_no_load_or_error_event");
  } else if (
    gptDiagnostics?.scriptLoadOutcome === "timeout" &&
    gptDiagnostics.scriptAppendAttempted &&
    gptDiagnostics.scriptTagFoundAfterAppend === false
  ) {
    notes.push("likelyCause=script_append_attempt_missing_from_dom");
  } else if (gptDiagnostics?.scriptOnerrorFired) {
    notes.push("likelyCause=script_error_event_network_or_blocker");
  }

  return [
    message,
    formatRewardedAdPageDiagnostics(debug.pageAtRequest),
    formatRewardedAdGptDiagnostics(gptDiagnostics),
    `adUnitPath=${debug.adUnitPath ?? "missing"}`,
    `providerMode=${debug.providerMode}`,
    notes.join("; "),
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

function isGoogletagBootstrapReady(
  value: Partial<GoogletagApi> | undefined,
): value is GoogletagApi {
  return !!value &&
    value.apiReady === true &&
    typeof value.pubads === "function" &&
    typeof value.defineOutOfPageSlot === "function" &&
    typeof value.enableServices === "function" &&
    typeof value.display === "function" &&
    !!value.enums?.OutOfPageFormat?.REWARDED;
}

function isGoogletagScriptLoaded(
  value: Partial<GoogletagApi> | undefined,
  scriptUrl: string,
) {
  const scriptLoadState = getGptScriptLoadStateSnapshot(scriptUrl);
  return (
    value?.apiReady === true ||
    scriptLoadState.scriptOnloadFired ||
    scriptLoadState.scriptLoadOutcome === "loaded"
  );
}

function ensureWindowGoogletagShell() {
  if (typeof window === "undefined") return;
  const current = getWindowGoogletag();
  if (current?.cmd) return;
  (
    window as typeof window & {
      googletag?: Partial<GoogletagApi> & { cmd?: Array<() => void> };
    }
  ).googletag = {
    ...(current ?? {}),
    cmd: current?.cmd ?? [],
  };
}

async function ensureGoogletagScriptLoaded(
  scriptUrl: string,
  timeoutMs: number,
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("rewarded ads require a browser environment");
  }
  ensureRewardedAdSecurityPolicyListener();
  ensureGptConnectionHints(scriptUrl);

  const current = getWindowGoogletag();
  if (isGoogletagScriptLoaded(current, scriptUrl)) {
    ensureWindowGoogletagShell();
    const existingReadyScript = document.querySelector(
      `script[src="${scriptUrl}"]`,
    ) as HTMLScriptElement | null;
    updateGptScriptLoadState(scriptUrl, timeoutMs, {
      scriptLoaded: true,
      existingScriptFound: !!existingReadyScript,
      existingScriptReused: !!existingReadyScript,
      scriptElementSrc: existingReadyScript?.src ?? scriptUrl,
      scriptLoadOutcome: "loaded",
      scriptLoadClassification:
        current?.apiReady === true ? "script_loaded_via_api_ready" : "script_loaded",
      cspSuspected: false,
    });
    return;
  }
  if (gptScriptLoadPromise) return gptScriptLoadPromise;

  ensureWindowGoogletagShell();

  gptScriptLoadPromise = new Promise<void>((resolve, reject) => {
    let settled = false;
    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`,
    ) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement("script");
    const appendTarget = existingScript
      ? "none"
      : document.head
        ? "head"
        : document.body
          ? "body"
          : "none";

    updateGptScriptLoadState(scriptUrl, timeoutMs, {
      scriptLoaded: false,
      scriptAppendAttempted: !existingScript,
      scriptAppendTarget: appendTarget,
      existingScriptFound: !!existingScript,
      existingScriptReused: !!existingScript,
      scriptTagFoundAfterAppend: null,
      scriptElementSrc: existingScript?.src ?? scriptUrl,
      scriptOnloadFired: false,
      scriptOnerrorFired: false,
      scriptTimeoutFired: false,
      scriptLoadOutcome: "loading",
      scriptLoadClassification: existingScript
        ? "existing_script_reused"
        : "script_append_started",
      cspSuspected: null,
      cspViolationDirective: null,
      cspViolationBlockedUri: null,
    });

    const timeoutClassification = () => {
      const state = getGptScriptLoadStateSnapshot(scriptUrl);
      if (state.cspSuspected) return "script_blocked_by_csp";
      if (state.existingScriptReused) return "script_timeout_reusing_existing_script";
      if (state.scriptAppendAttempted && state.scriptTagFoundAfterAppend === false) {
        return "script_append_attempt_missing_from_dom";
      }
      if (state.scriptAppendAttempted) return "script_appended_but_no_load_events";
      return "script_load_timed_out";
    };

    let pollId = 0;
    let timeoutId = 0;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(pollId);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const finalizeError = (error: Error) => {
      cleanup();
      gptScriptLoadPromise = null;
      reject(error);
    };

    const finish = () => {
      if (settled) return;
      const next = getWindowGoogletag();
      if (!isGoogletagScriptLoaded(next, scriptUrl)) return;
      settled = true;
      updateGptScriptLoadState(scriptUrl, timeoutMs, {
        scriptLoaded: true,
        scriptLoadOutcome: "loaded",
        scriptLoadClassification:
          next?.apiReady === true
            ? "script_loaded_via_api_ready"
            : existingScript
              ? "existing_script_onload_fired"
              : "script_onload_fired",
        cspSuspected: false,
      });
      cleanup();
      resolve();
    };

    const onLoad = () => {
      updateGptScriptLoadState(scriptUrl, timeoutMs, {
        scriptLoaded: true,
        scriptOnloadFired: true,
        scriptElementSrc: script.src || scriptUrl,
        scriptLoadOutcome: "loaded",
        scriptLoadClassification:
          getWindowGoogletag()?.apiReady === true
            ? "script_loaded_via_api_ready"
            : existingScript
              ? "existing_script_onload_fired"
              : "script_onload_fired",
        cspSuspected: false,
      });
      finish();
    };

    const onError = () => {
      updateGptScriptLoadState(scriptUrl, timeoutMs, {
        scriptLoaded: false,
        scriptOnerrorFired: true,
        scriptElementSrc: script.src || scriptUrl,
        scriptLoadOutcome: "error",
        scriptLoadClassification: "script_onerror_fired",
        cspSuspected: gptScriptLoadState?.cspSuspected ?? false,
      });
      finalizeError(new Error("GPT script failed to load"));
    };

    pollId = window.setInterval(finish, 50);
    timeoutId = window.setTimeout(() => {
      updateGptScriptLoadState(scriptUrl, timeoutMs, {
        scriptLoaded: false,
        scriptTimeoutFired: true,
        scriptLoadOutcome: "timeout",
        scriptLoadClassification: timeoutClassification(),
      });
      finalizeError(new Error("GPT load timed out"));
    }, timeoutMs);

    if (!existingScript) {
      script.async = true;
      script.src = scriptUrl;
      script.crossOrigin = "anonymous";
      const parent = appendTarget === "body" ? document.body : document.head;
      if (!parent) {
        updateGptScriptLoadState(scriptUrl, timeoutMs, {
          scriptLoadOutcome: "error",
          scriptLoadClassification: "script_append_target_missing",
        });
        finalizeError(new Error("GPT script could not be appended to document"));
        return;
      }
      parent.appendChild(script);
      updateGptScriptLoadState(scriptUrl, timeoutMs, {
        scriptElementSrc: script.src || scriptUrl,
        scriptTagFoundAfterAppend:
          document.querySelector(`script[src="${scriptUrl}"]`) != null,
      });
    }
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    finish();
  });

  return gptScriptLoadPromise;
}

function getBootstrapTimeoutClassification(
  googletag: Partial<GoogletagApi> | undefined,
) {
  if (!googletag) return "bootstrap_missing_googletag";
  if (googletag.apiReady !== true) return "bootstrap_api_not_ready";
  if (!googletag.enums?.OutOfPageFormat?.REWARDED) {
    return "bootstrap_rewarded_enum_missing";
  }
  if (typeof googletag.pubads !== "function") return "bootstrap_pubads_missing";
  if (typeof googletag.enableServices !== "function") {
    return "bootstrap_enable_services_missing";
  }
  if (typeof googletag.defineOutOfPageSlot !== "function") {
    return "bootstrap_define_slot_missing";
  }
  if (typeof googletag.display !== "function") return "bootstrap_display_missing";
  if (!Array.isArray(googletag.cmd)) {
    return "bootstrap_cmd_missing_non_blocking";
  }
  return "bootstrap_timed_out";
}

async function ensureGoogletagBootstrapped(
  scriptUrl: string,
  timeoutMs: number,
): Promise<GoogletagApi> {
  await ensureGoogletagScriptLoaded(scriptUrl, timeoutMs);
  ensureWindowGoogletagShell();
  const current = getWindowGoogletag();
  if (isGoogletagBootstrapReady(current)) {
    updateGptBootstrapState(scriptUrl, timeoutMs, {
      bootstrapStarted: true,
      bootstrapCompleted: true,
      bootstrapTimeoutFired: false,
      bootstrapClassification: "bootstrap_ready",
      servicesEnabledByApp: gptServicesEnabled,
    });
    return current;
  }
  if (gptBootstrapPromise) return gptBootstrapPromise;

  updateGptBootstrapState(scriptUrl, timeoutMs, {
    bootstrapStarted: true,
    bootstrapCompleted: false,
    bootstrapTimeoutFired: false,
    bootstrapClassification: "bootstrap_waiting_for_api_surface",
    servicesEnabledByApp: gptServicesEnabled,
  });

  gptBootstrapPromise = new Promise<GoogletagApi>((resolve, reject) => {
    let settled = false;
    let pollId = 0;
    let timeoutId = 0;

    const cleanup = () => {
      window.clearInterval(pollId);
      window.clearTimeout(timeoutId);
    };

    const finalizeError = (error: Error) => {
      cleanup();
      gptBootstrapPromise = null;
      reject(error);
    };

    const finish = () => {
      if (settled) return;
      const next = getWindowGoogletag();
      if (!isGoogletagBootstrapReady(next)) return;
      settled = true;
      updateGptBootstrapState(scriptUrl, timeoutMs, {
        bootstrapStarted: true,
        bootstrapCompleted: true,
        bootstrapTimeoutFired: false,
        bootstrapClassification: "bootstrap_ready",
        servicesEnabledByApp: gptServicesEnabled,
      });
      cleanup();
      resolve(next);
    };

    pollId = window.setInterval(finish, 50);
    timeoutId = window.setTimeout(() => {
      const next = getWindowGoogletag();
      updateGptBootstrapState(scriptUrl, timeoutMs, {
        bootstrapStarted: true,
        bootstrapCompleted: false,
        bootstrapTimeoutFired: true,
        bootstrapClassification: getBootstrapTimeoutClassification(next),
        servicesEnabledByApp: gptServicesEnabled,
      });
      finalizeError(new Error("GPT bootstrap timed out"));
    }, timeoutMs);

    finish();
  });

  return gptBootstrapPromise;
}

function ensureGoogletagServicesEnabled(googletag: GoogletagApi, scriptUrl: string) {
  updateGptBootstrapState(scriptUrl, null, {
    servicesEnableAttempted: true,
    servicesEnabledByApp: gptServicesEnabled,
  });
  if (gptServicesEnabled) return;
  try {
    googletag.enableServices();
    gptServicesEnabled = true;
    updateGptBootstrapState(scriptUrl, null, {
      servicesEnableAttempted: true,
      servicesEnabledByApp: true,
      servicesEnableError: null,
    });
  } catch (error) {
    updateGptBootstrapState(scriptUrl, null, {
      servicesEnableAttempted: true,
      servicesEnabledByApp: false,
      servicesEnableError:
        error instanceof Error ? error.message : "enableServices_failed",
    });
    throw error;
  }
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
      failureStage: null,
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
      googletag = await ensureGoogletagBootstrapped(
        this.config.gptScriptUrl,
        this.config.requestTimeoutMs,
      );
    } catch (error) {
      const rawDetails =
        error instanceof Error ? error.message : "failed to load GPT runtime";
      const gptAfterLoad = getRewardedAdGptDiagnostics(this.config.gptScriptUrl);
      const failureStage: RewardedAdDebugSnapshot["failureStage"] =
        /bootstrap/i.test(rawDetails) ||
        gptAfterLoad?.bootstrapTimeoutFired ||
        (gptAfterLoad?.bootstrapStarted === true &&
          gptAfterLoad.bootstrapCompleted === false &&
          gptAfterLoad.scriptLoaded === true)
          ? "bootstrap"
          : "script";
      const debug = {
        ...baseDebug,
        gptAfterLoad,
        failureStage,
        notes: [
          ...(baseDebug.notes ?? []),
          failureStage === "bootstrap" ? "gpt_bootstrap_failed" : "gpt_script_load_failed",
          `gpt_stage_error=${rawDetails}`,
        ],
      };
      return {
        placement,
        provider: "web-gpt-rewarded",
        status:
          typeof rawDetails === "string" && /timed out/i.test(rawDetails)
            ? "timeout"
            : "error",
        details: buildGptStageFailureDetail(failureStage, rawDetails, debug),
        debug,
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
          slotAttempted: false,
          failureStage: null,
          notes: [...(baseDebug.notes ?? [])],
        };
        const pubads = googletag.pubads();
        const slot = googletag.defineOutOfPageSlot(
          adUnitPath,
          googletag.enums.OutOfPageFormat.REWARDED,
        );
        debugAtSlotAttempt.slotAttempted = true;

        if (!slot) {
          const debug = {
            ...debugAtSlotAttempt,
            slotReturnedNull: true,
            failureStage: "slot" as const,
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

        try {
          ensureGoogletagServicesEnabled(googletag, this.config.gptScriptUrl);
        } catch (error) {
          const details =
            error instanceof Error
              ? error.message
              : "rewarded services initialization failed";
          const debug = {
            ...debugAtSlotAttempt,
            slotReturnedNull: false,
            failureStage: "services" as const,
            gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
            notes: [
              ...(debugAtSlotAttempt.notes ?? []),
              "gpt_services_enable_failed",
              `gpt_services_error=${details}`,
            ],
          };
          resolve({
            placement,
            provider: "web-gpt-rewarded",
            status: "error",
            details: buildGptStageFailureDetail("services", details, debug),
            debug,
          });
          return;
        }

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
              failureStage: "slot",
              gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
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
                failureStage: "slot",
                gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
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
              failureStage: null,
              gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
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
              failureStage: "slot",
              gptAtSlotAttempt: getRewardedAdGptDiagnostics(this.config.gptScriptUrl),
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

export async function preloadRewardedAdRuntime(): Promise<boolean> {
  const config = readRuntimeConfig();
  if (config.resolvedProviderMode !== "web-gpt-rewarded") {
    return false;
  }
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    await ensureGoogletagBootstrapped(
      config.gptScriptUrl,
      config.requestTimeoutMs,
    );
    return true;
  } catch {
    return false;
  }
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
