export type AnalyticsEventName =
  | 'page_viewed'
  | 'curation_cta_clicked'
  | 'curation_form_opened'
  | 'curation_form_submitted'
  | 'place_list_viewed'
  | 'place_detail_viewed'
  | 'checkout_viewed'
  | 'payment_started'
  | 'payment_succeeded'
  | 'payment_failed';

type AnalyticsValue = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsValue | null | undefined>;
type Attribution = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>> & {
  referrer_domain?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const ATTRIBUTION_STORAGE_KEY = 'deepplate_analytics_attribution_v1';
const VISITOR_STORAGE_KEY = 'deepplate_analytics_visitor_v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

let initialized = false;
let amplitudeClient: Promise<typeof import('@amplitude/analytics-browser') | null> | null = null;
let authState: 'anonymous' | 'authenticated' = 'anonymous';
let currentLanguage = 'ko';
let visitorType: 'new' | 'returning' = 'new';

function safeText(value: string | null, maxLength = 100) {
  if (!value) return undefined;
  const normalized = value.trim().slice(0, maxLength);
  return normalized || undefined;
}

function safeStoredAttribution(value: unknown): Attribution {
  if (!value || typeof value !== 'object') return {};
  const candidate = value as Record<string, unknown>;
  const attribution: Attribution = {};
  for (const key of UTM_KEYS) {
    if (typeof candidate[key] === 'string') attribution[key] = safeText(candidate[key]) ?? '';
  }
  if (typeof candidate.referrer_domain === 'string') {
    attribution.referrer_domain = safeText(candidate.referrer_domain) ?? '';
  }
  return Object.fromEntries(Object.entries(attribution).filter(([, item]) => Boolean(item))) as Attribution;
}

function currentAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = safeText(params.get(key));
    if (value) fromUrl[key] = value;
  }

  if (Object.keys(fromUrl).length > 0) {
    try {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // 저장이 막혀도 현재 페이지의 UTM은 이번 이벤트에 사용합니다.
    }
    return fromUrl;
  }

  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) return safeStoredAttribution(JSON.parse(stored));
  } catch {
    // 손상되거나 접근할 수 없는 저장값은 사용하지 않습니다.
  }

  if (!document.referrer) return {};
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? {} : { referrer_domain: referrer.hostname.slice(0, 100) };
  } catch {
    return {};
  }
}

function readVisitorType() {
  try {
    const hasVisited = window.localStorage.getItem(VISITOR_STORAGE_KEY) === '1';
    window.localStorage.setItem(VISITOR_STORAGE_KEY, '1');
    return hasVisited ? 'returning' as const : 'new' as const;
  } catch {
    return 'new' as const;
  }
}

function installGoogleTagManager(containerId: string) {
  if (!/^GTM-[A-Z0-9]+$/.test(containerId) || document.querySelector(`script[data-gtm-id="${containerId}"]`)) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.dataset.gtmId = containerId;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (initialized) return;
  initialized = true;
  visitorType = readVisitorType();
  currentAttribution();

  const amplitudeApiKey = safeText(import.meta.env.VITE_AMPLITUDE_API_KEY, 200);
  if (amplitudeApiKey) {
    amplitudeClient = import('@amplitude/analytics-browser').then((client) => {
      client.init(amplitudeApiKey, { defaultTracking: false, autocapture: false });
      return client;
    }).catch(() => {
      if (import.meta.env.VITE_ANALYTICS_DEBUG === 'true') console.warn('[analytics] Amplitude 초기화 실패');
      return null;
    });
  }

  const gtmContainerId = safeText(import.meta.env.VITE_GTM_ID, 30);
  if (gtmContainerId) installGoogleTagManager(gtmContainerId);
}

function cleanProperties(properties: AnalyticsProperties): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, AnalyticsValue] => (
      entry[1] !== undefined && entry[1] !== null
    )),
  );
}

function deviceType() {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet';
  return 'desktop';
}

export function trackEvent(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  initializeAnalytics();
  const common = {
    event_version: 1,
    page_path: window.location.pathname,
    page_location: `${window.location.origin}${window.location.pathname}`,
    language: currentLanguage,
    auth_state: authState,
    visitor_type: visitorType,
    device_type: deviceType(),
    environment: import.meta.env.MODE,
    ...currentAttribution(),
  };
  const payload = cleanProperties({ ...common, ...properties });

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...payload });
  if (amplitudeClient) void amplitudeClient.then((client) => client?.track(name, payload));
  if (import.meta.env.VITE_ANALYTICS_DEBUG === 'true') console.info(`[analytics] ${name} ${JSON.stringify(payload)}`);
}

export function syncAnalyticsIdentity(userId: string | null, language: string) {
  initializeAnalytics();
  currentLanguage = safeText(language, 10) ?? 'ko';
  authState = userId ? 'authenticated' : 'anonymous';
  if (!amplitudeClient) return;

  void amplitudeClient.then((client) => {
    if (!client) return;
    client.setUserId(userId ?? undefined);
    let identity = new client.Identify()
      .set('language', currentLanguage)
      .set('auth_state', authState)
      .set('visitor_type', visitorType);
    for (const [key, value] of Object.entries(currentAttribution())) {
      identity = identity.setOnce(`first_${key}`, value);
    }
    client.identify(identity);
  });
}

export function safeAnalyticsCode(value: string | null | undefined) {
  return value && /^[A-Z0-9_]{2,64}$/.test(value) ? value : 'UNKNOWN_ERROR';
}
