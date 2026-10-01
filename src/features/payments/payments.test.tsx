import { StrictMode } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from './CheckoutPage';
import OrdersPage from './OrdersPage';
import PaymentResultPage from './PaymentResultPage';
import type { PaymentOrder } from './payment-api';
import { recordCurationApplicationSubmission } from './payment-entry';

const tossWidgetMock = vi.hoisted(() => ({
  validateMethod: vi.fn(async () => undefined),
  requestPayment: vi.fn(async () => undefined),
}));

// 외부 결제창 대신 API와 화면의 주문 처리 경계를 검증합니다.
vi.mock('./useTossWidget', () => ({
  default: () => ({ ready: true, hasError: false, methodsId: 'test-methods', agreementId: 'test-agreement', ...tossWidgetMock }),
}));

const order: PaymentOrder = {
  id: 'test-order-123', productId: 'curation-demo', name: 'Deep Plate 1:1 큐레이션 신청 결제',
  amount: 10_000, currency: 'KRW', status: 'PENDING', mode: 'mock',
  createdAt: '2026-09-18T10:00:00.000Z', paidAt: null, failureCode: null,
};
const paidOrder: PaymentOrder = { ...order, status: 'PAID', paidAt: '2026-09-18T10:01:00.000Z' };
const successUrl = `/checkout/success?orderId=${order.id}&paymentKey=mock_${order.id}&amount=${order.amount}`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((accept) => { resolve = accept; });
  return { promise, resolve };
}

function renderFlow(path: string, strict = false, token: string | null = 'test-token') {
  const tree = <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/checkout" element={<CheckoutPage lang="ko" token={token} isInitializing={false} />} />
      <Route path="/checkout/success" element={<PaymentResultPage lang="ko" token={token} kind="success" />} />
      <Route path="/checkout/fail" element={<PaymentResultPage lang="ko" token={token} kind="fail" />} />
      <Route path="/orders" element={<OrdersPage lang="ko" token={token ?? ''} />} />
    </Routes>
  </MemoryRouter>;
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}

beforeEach(() => {
  window.dataLayer = [];
  window.sessionStorage.clear();
  recordCurationApplicationSubmission('test-submission');
  tossWidgetMock.validateMethod.mockClear();
  tossWidgetMock.requestPayment.mockClear();
});

afterEach(() => {
  window.sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe('결제 사용자 흐름', () => {
  it('신청서를 제출하지 않고 결제 주소로 들어오면 신청부터 안내한다', () => {
    window.sessionStorage.clear();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderFlow('/checkout');

    expect(screen.getByRole('heading', { name: /결제 전에\s+큐레이션 신청이 먼저예요\./ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '큐레이션 신청서 작성하기' })).toHaveAttribute('href', '/?apply=1');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('30분이 지난 신청 세션은 결제 진입에 사용하지 않는다', () => {
    window.sessionStorage.setItem('deepplate_curation_application_v1', JSON.stringify({
      formId: 'ZjAlQe',
      submissionId: 'expired-submission',
      submittedAt: new Date(Date.now() - 31 * 60 * 1_000).toISOString(),
    }));
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderFlow('/checkout');

    expect(screen.getByRole('heading', { name: /결제 전에\s+큐레이션 신청이 먼저예요\./ })).toBeInTheDocument();
    expect(window.sessionStorage.getItem('deepplate_curation_application_v1')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('명시적으로 모의 승인을 선택해야 서버가 반환한 주문 금액으로 승인한다', async () => {
    const user = userEvent.setup();
    const returnedOrder = { ...order, amount: 12_345 };
    const checkoutToken = 'member-browser-checkout-token';
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/payments/product')) return json({ product: { id: order.productId, name: order.name, amount: 10_000, currency: 'KRW' }, available: true, mode: 'mock' });
      if (url.endsWith('/payments/guest/orders')) {
        expect(init?.headers).not.toHaveProperty('Authorization');
        return json({ order: returnedOrder, checkoutToken }, 201);
      }
      if (url.endsWith('/payments/guest/confirm')) {
        expect(JSON.parse(String(init?.body))).toEqual({ orderId: order.id, paymentKey: `mock_${order.id}`, amount: 12_345 });
        expect(init?.headers).toMatchObject({ 'X-Checkout-Token': checkoutToken });
        return json({ order: { ...returnedOrder, status: 'PAID' } });
      }
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow('/checkout');

    await user.click(await screen.findByRole('button', { name: '테스트 결제하기' }));
    expect(await screen.findByRole('button', { name: '시뮬레이션 승인' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/payments/guest/confirm'))).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: '시뮬레이션 승인' }));
    expect(await screen.findByRole('heading', { name: '모의 결제 확인 완료' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/payments/guest/orders'))).toHaveLength(1);
    await waitFor(() => expect(window.dataLayer?.filter((event) => event.event === 'payment_started')).toHaveLength(1));
    await waitFor(() => expect(window.dataLayer?.filter((event) => event.event === 'payment_succeeded')).toHaveLength(1));
  });

  it('로그인하지 않아도 현재 신청 건에 한정된 토큰으로 결제 결과를 확인한다', async () => {
    const user = userEvent.setup();
    const checkoutToken = 'guest-checkout-token';
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/payments/product')) return json({ product: { id: order.productId, name: order.name, amount: order.amount, currency: 'KRW' }, available: true, mode: 'mock' });
      if (url.endsWith('/payments/guest/orders')) {
        expect(init?.headers).not.toHaveProperty('Authorization');
        expect(JSON.parse(String(init?.body))).toEqual({ productId: order.productId, applicationSubmissionId: 'test-submission' });
        return json({ order, checkoutToken }, 201);
      }
      if (url.endsWith('/payments/guest/confirm')) {
        expect(init?.headers).toMatchObject({ 'X-Checkout-Token': checkoutToken });
        return json({ order: paidOrder });
      }
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow('/checkout', false, null);

    expect(await screen.findByText('회원가입은 필요하지 않습니다. 이 브라우저에서 현재 주문 한 건만 확인합니다.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '로그인하고 계속하기' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '테스트 결제하기' }));
    await user.click(await screen.findByRole('button', { name: '시뮬레이션 승인' }));

    expect(await screen.findByRole('heading', { name: '모의 결제 확인 완료' })).toBeInTheDocument();
    expect(window.sessionStorage.getItem('deepplate_guest_payment_access_v1')).toContain(checkoutToken);
    expect(screen.queryByRole('link', { name: '내 주문 확인' })).not.toBeInTheDocument();
  });

  it('토스 테스트 모드에서는 버튼 한 번으로 주문을 만들고 간편결제창을 요청한다', async () => {
    const user = userEvent.setup();
    const tossOrder: PaymentOrder = { ...order, mode: 'toss-test' };
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/payments/product')) return json({
        product: { id: order.productId, name: order.name, amount: order.amount, currency: 'KRW' },
        available: true,
        mode: 'toss-test',
        clientKey: 'test_ck_public-example',
      });
      if (url.endsWith('/payments/guest/orders')) {
        expect(JSON.parse(String(init?.body))).toEqual({ productId: order.productId, applicationSubmissionId: 'test-submission' });
        return json({ order: tossOrder, checkoutToken: 'guest-checkout-token' }, 201);
      }
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow('/checkout', false, null);

    await user.click(await screen.findByRole('button', { name: '토스 간편결제로 결제하기' }));

    await waitFor(() => expect(tossWidgetMock.requestPayment).toHaveBeenCalledWith(tossOrder));
    expect(tossWidgetMock.validateMethod).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: '시뮬레이션 승인' })).not.toBeInTheDocument();
  });

  it('StrictMode에서도 승인 요청은 한 번 보내고 PAID 응답 전에는 완료로 표시하지 않는다', async () => {
    const user = userEvent.setup();
    const confirmation = deferred<Response>();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/payments/confirm')) return confirmation.promise;
      if (url.endsWith(`/payments/orders/${order.id}/reconcile`)) return json({ order: paidOrder });
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow(successUrl, true);

    expect(screen.getByRole('status')).toHaveTextContent('서버에서 결제 결과를 확인하고 있어요.');
    expect(screen.queryByRole('heading', { name: '모의 결제 확인 완료' })).not.toBeInTheDocument();
    await act(async () => confirmation.resolve(json({ order: { ...order, status: 'CONFIRMING' } })));
    expect(await screen.findByRole('heading', { name: '결제 결과를 확인 중이에요' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '모의 결제 확인 완료' })).not.toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/payments/confirm'))).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: '이 주문 상태 다시 확인' }));
    expect(await screen.findByRole('heading', { name: '모의 결제 확인 완료' })).toBeInTheDocument();
  });

  it('승인 응답을 잃으면 실패로 단정하지 않고 같은 주문을 조회하여 복구한다', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/payments/confirm')) throw new TypeError('Connection lost');
      if (url.endsWith(`/payments/orders/${order.id}/reconcile`)) return json({ order: paidOrder });
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow(successUrl);

    expect(await screen.findByRole('heading', { name: '결제 결과를 확인 중이에요' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '결제를 완료하지 못했어요' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '이 주문 상태 다시 확인' }));
    expect(await screen.findByRole('heading', { name: '모의 결제 확인 완료' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(`/orders/${order.id}/reconcile`);
  });

  it('첫 승인 요청이 서버에 도착하지 않았으면 조회 후 같은 주문으로 승인을 재시도한다', async () => {
    const user = userEvent.setup();
    let confirmations = 0;
    const callback = { orderId: order.id, paymentKey: `mock_${order.id}`, amount: order.amount };
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/payments/confirm')) {
        confirmations += 1;
        expect(JSON.parse(String(init?.body))).toEqual(callback);
        if (confirmations === 1) throw new TypeError('Request did not reach server');
        return json({ order: paidOrder });
      }
      if (url.endsWith(`/payments/orders/${order.id}/reconcile`)) return json({ order });
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow(successUrl);

    expect(await screen.findByRole('heading', { name: '결제 결과를 확인 중이에요' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '이 주문 상태 다시 확인' }));
    expect(await screen.findByRole('heading', { name: '모의 결제 확인 완료' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.map(([url]) => new URL(String(url)).pathname)).toEqual([
      '/payments/confirm', `/payments/orders/${order.id}/reconcile`, '/payments/confirm',
    ]);
    expect(confirmations).toBe(2);
  });

  it.each([
    `?orderId=${order.id}&paymentKey=mock_key&amount=10000&amount=1`,
    `?orderId=${order.id}&paymentKey=mock_key&amount=-1`,
    `?orderId=${order.id}&amount=10000`,
  ])('잘못되거나 중복된 승인 파라미터는 서버로 보내지 않는다: %s', async (search) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderFlow(`/checkout/success${search}`);
    expect(await screen.findByRole('alert')).toHaveTextContent('결제 확인 정보가 올바르지 않아요.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('실패 경로에서는 승인 요청이나 query의 원문 오류 메시지를 표시하지 않는다', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderFlow('/checkout/fail?code=PAY_PROCESS_CANCELED&message=UNTRUSTED_PROVIDER_MESSAGE');
    expect(screen.getByRole('heading', { name: '결제창이 취소되었어요' })).toBeInTheDocument();
    expect(screen.queryByText('UNTRUSTED_PROVIDER_MESSAGE')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'payment_failed',
      failure_code: 'PAY_PROCESS_CANCELED',
      failure_stage: 'provider_return',
    });
    expect(JSON.stringify(window.dataLayer)).not.toContain('UNTRUSTED_PROVIDER_MESSAGE');
  });

  it('주문 내역의 로딩과 빈 상태를 안내하고 미확정 주문을 같은 번호로 복구한다', async () => {
    const user = userEvent.setup();
    const initial = deferred<Response>();
    let reads = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/payments/orders/me')) {
        reads += 1;
        return reads === 1 ? initial.promise : json({ orders: [{ ...order, status: 'CONFIRMING' }] });
      }
      if (url.endsWith(`/payments/orders/${order.id}/reconcile`)) return json({ order: paidOrder });
      throw new Error(`Unexpected route: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    renderFlow('/orders');
    expect(screen.getByRole('status')).toHaveTextContent('주문 내역을 불러오고 있어요.');
    await act(async () => initial.resolve(json({ orders: [] })));
    expect(await screen.findByRole('heading', { name: '아직 주문이 없어요.' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '새로고침' }));
    expect(await screen.findByText('결제 결과 확인 중')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '결제 상태 다시 확인' }));
    await waitFor(() => expect(screen.getByText('결제 확인 완료')).toBeInTheDocument());
    expect(screen.getByText(order.id)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '결제 상태 다시 확인' })).not.toBeInTheDocument();
  });
});
