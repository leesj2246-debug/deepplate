export interface PaymentProduct {
  id: string;
  name: string;
  amount: number;
  currency: 'KRW';
}

export interface PaymentConfiguration {
  product: PaymentProduct;
  mode: 'disabled' | 'mock' | 'toss-test';
  available: boolean;
  clientKey?: string;
}

export interface PaymentOrder extends Omit<PaymentProduct, 'id'> {
  id: string;
  productId: string;
  status: 'PENDING' | 'CONFIRMING' | 'PAID' | 'FAILED';
  mode: 'mock' | 'toss-test';
  createdAt: string;
  paidAt: string | null;
  failureCode: string | null;
}

export interface PaymentCallback {
  orderId: string;
  paymentKey: string;
  amount: number;
}

export type PaymentAccess = { kind: 'user' | 'guest'; token: string };

const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

export class PaymentRequestError extends Error {
  constructor(public code: string, public status = 0) {
    super(code);
    this.name = 'PaymentRequestError';
  }
}

async function request<T>(path: string, access?: PaymentAccess, body?: object): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}/payments${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        ...(access?.kind === 'user' ? { Authorization: `Bearer ${access.token}` } : {}),
        ...(access?.kind === 'guest' ? { 'X-Checkout-Token': access.token } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    // 응답을 못 받았다고 결제 실패로 단정하지 않습니다.
    throw new PaymentRequestError('NETWORK_ERROR');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new PaymentRequestError(data?.code || (response.status === 401 ? 'UNAUTHORIZED' : 'REQUEST_FAILED'), response.status);
  }
  if (!data) throw new PaymentRequestError('REQUEST_FAILED');
  return data as T;
}

export const getPaymentProduct = () => request<PaymentConfiguration>('/product');
export async function createGuestPaymentOrder(productId: string, applicationSubmissionId: string) {
  return request<{ order: PaymentOrder; checkoutToken: string }>('/guest/orders', undefined, { productId, applicationSubmissionId });
}
export async function getPaymentOrders(token: string) {
  return (await request<{ orders: PaymentOrder[] }>('/orders/me', { kind: 'user', token })).orders;
}
export async function confirmPaymentOrder(access: PaymentAccess, callback: PaymentCallback) {
  const path = access.kind === 'guest' ? '/guest/confirm' : '/confirm';
  return (await request<{ order: PaymentOrder }>(path, access, callback)).order;
}
export async function reconcilePaymentOrder(access: PaymentAccess, orderId: string) {
  const prefix = access.kind === 'guest' ? '/guest' : '';
  return (await request<{ order: PaymentOrder }>(`${prefix}/orders/${encodeURIComponent(orderId)}/reconcile`, access, {})).order;
}

export function readPaymentCallback(search: string): PaymentCallback | null {
  const params = new URLSearchParams(search);
  if (['orderId', 'paymentKey', 'amount'].some((key) => params.getAll(key).length !== 1)) return null;
  const orderId = params.get('orderId')!;
  const paymentKey = params.get('paymentKey')!;
  const amount = params.get('amount')!;
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(orderId) || !paymentKey || paymentKey.length > 200 || /\s/.test(paymentKey)) return null;
  if (!/^[1-9]\d{0,8}$/.test(amount)) return null;
  return { orderId, paymentKey, amount: Number(amount) };
}

export function paymentErrorCode(error: unknown): string {
  if (error instanceof PaymentRequestError) return error.code;
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') return error.code;
  return 'REQUEST_FAILED';
}
