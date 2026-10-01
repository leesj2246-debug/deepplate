import { beforeEach, describe, expect, it } from 'vitest';
import { safeAnalyticsCode, syncAnalyticsIdentity, trackEvent } from './analytics';

beforeEach(() => {
  window.dataLayer = [];
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('분석 이벤트 개인정보 경계', () => {
  it('UTM은 세션에 유지하고 page_location에서는 query를 제거한다', () => {
    window.history.replaceState({}, '', '/checkout/success?paymentKey=secret-key&utm_source=kakao&utm_medium=messenger&utm_campaign=mission9_qa&utm_content=funnel_v1');
    syncAnalyticsIdentity(null, 'ko');
    trackEvent('page_viewed');

    const firstEvent = window.dataLayer?.at(-1);
    expect(firstEvent).toMatchObject({
      event: 'page_viewed',
      page_path: '/checkout/success',
      page_location: `${window.location.origin}/checkout/success`,
      utm_source: 'kakao',
      utm_medium: 'messenger',
      utm_campaign: 'mission9_qa',
      utm_content: 'funnel_v1',
    });
    expect(JSON.stringify(firstEvent)).not.toContain('secret-key');

    window.history.replaceState({}, '', '/checkout');
    trackEvent('checkout_viewed');
    expect(window.dataLayer?.at(-1)).toMatchObject({ event: 'checkout_viewed', utm_source: 'kakao' });
  });

  it('외부 오류 문자열을 정해진 실패 코드 형식으로 제한한다', () => {
    expect(safeAnalyticsCode('PAY_PROCESS_CANCELED')).toBe('PAY_PROCESS_CANCELED');
    expect(safeAnalyticsCode('customer@example.com')).toBe('UNKNOWN_ERROR');
    expect(safeAnalyticsCode(null)).toBe('UNKNOWN_ERROR');
  });
});
