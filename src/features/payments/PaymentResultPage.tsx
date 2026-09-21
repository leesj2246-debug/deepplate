import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Language } from '../../data/content';
import { confirmPaymentOrder, paymentErrorCode, readPaymentCallback, reconcilePaymentOrder } from './payment-api';
import type { PaymentAccess, PaymentOrder } from './payment-api';
import { getGuestPaymentAccess } from './payment-entry';
import { formatPaymentAmount, paymentErrorMessage } from './paymentUi';
import './payments.css';

const copy = {
  ko: {
    title: '결제 결과', checking: '서버에서 결제 결과를 확인하고 있어요.',
    paid: '테스트 결제 확인 완료', mockPaid: '모의 결제 확인 완료',
    paidBody: '결제 확인 결과를 안전하게 저장했어요. 실제 청구나 큐레이션 제공은 이루어지지 않습니다.',
    pending: '결제 결과를 확인 중이에요',
    pendingBody: '아직 완료 여부를 확정하지 못했어요. 같은 주문의 상태를 다시 확인해 주세요.',
    failed: '결제를 완료하지 못했어요', unconfirmed: '결제 결과를 확인하지 못했어요', invalid: '결제 확인 정보가 올바르지 않아요. 주문 내역에서 상태를 확인해 주세요.',
    accessLost: '이 브라우저의 비회원 주문 확인 정보가 없습니다. 결제 화면에서 다시 시작해 주세요.', login: '로그인하기',
    canceled: '결제창이 취소되었어요', canceledBody: '주문이 생성되었다면 내역에서 현재 상태를 확인할 수 있어요.',
    returned: '결제 상태를 확인해 주세요', returnedBody: '결제창에서 돌아왔어요. 주문 내역에서 서버가 확인한 결과를 확인해 주세요.',
    orders: '내 주문 확인', checkout: '결제 화면으로', reconcile: '이 주문 상태 다시 확인',
    reconciling: '확인 중…', orderId: '주문 번호', amount: '결제 금액',
    mock: '모의 결제 · 실제 청구 없음', test: '토스 테스트 결제 · 실제 청구 없음',
  },
  ja: {
    title: '決済結果', checking: 'サーバーで決済結果を確認しています。',
    paid: 'テスト決済の確認が完了しました', mockPaid: '模擬決済の確認が完了しました',
    paidBody: '決済確認結果を安全に保存しました。実際の請求やキュレーションの提供はありません。',
    pending: '決済結果を確認中です',
    pendingBody: '完了したかどうかはまだ確定していません。同じ注文の状態を再確認してください。',
    failed: '決済を完了できませんでした', unconfirmed: '決済結果を確認できませんでした', invalid: '決済確認情報が正しくありません。注文履歴で状態を確認してください。',
    accessLost: 'このブラウザにゲスト注文の確認情報がありません。決済画面からやり直してください。', login: 'ログイン',
    canceled: '決済画面がキャンセルされました', canceledBody: '注文が作成されている場合、履歴から現在の状態を確認できます。',
    returned: '決済状態を確認してください', returnedBody: '決済画面から戻りました。サーバーで確認した結果を注文履歴から確認してください。',
    orders: '注文履歴', checkout: '決済画面へ', reconcile: 'この注文を再確認',
    reconciling: '確認中…', orderId: '注文番号', amount: '決済金額',
    mock: '模擬決済 · 請求なし', test: 'Toss テスト決済 · 請求なし',
  },
  en: {
    title: 'Payment result', checking: 'Checking the payment with the server.',
    paid: 'Test payment confirmed', mockPaid: 'Simulated payment confirmed',
    paidBody: 'The payment result was saved securely. No real charge or curation delivery takes place.',
    pending: 'Payment result not yet confirmed',
    pendingBody: 'We cannot confirm completion yet. Check the status of this same order again.',
    failed: 'Payment could not be completed', unconfirmed: 'Payment result could not be verified', invalid: 'The payment confirmation details are invalid. Check your order history for the current status.',
    accessLost: 'Guest order access is unavailable in this browser. Start again from checkout.', login: 'Sign in',
    canceled: 'Checkout was canceled', canceledBody: 'If an order was created, its current status is available in your order history.',
    returned: 'Check your payment status', returnedBody: 'You have returned from checkout. Your order history shows the result confirmed by the server.',
    orders: 'My orders', checkout: 'Back to checkout', reconcile: 'Check this order again',
    reconciling: 'Checking…', orderId: 'Order number', amount: 'Amount',
    mock: 'Simulation · No real charge', test: 'Toss test payment · No real charge',
  },
};

interface PaymentResultPageProps {
  lang: Language;
  token: string | null;
  kind: 'success' | 'fail';
}

type ConfirmationState = { order: PaymentOrder | null; error: string | null; loading: boolean };
const uncertainCodes = new Set(['NETWORK_ERROR', 'PAYMENT_UNCERTAIN', 'PAYMENT_PROCESSING', 'PAYMENT_SERVER_ERROR', 'REQUEST_FAILED']);

function Confirmation({ lang, token, search }: { lang: Language; token: string | null; search: string }) {
  const labels = copy[lang];
  const callback = useMemo(() => readPaymentCallback(search), [search]);
  const access = useMemo<PaymentAccess | null>(() => {
    if (!callback) return null;
    const checkoutToken = getGuestPaymentAccess(callback.orderId);
    if (checkoutToken) return { kind: 'guest', token: checkoutToken };
    return token ? { kind: 'user', token } : null;
  }, [callback, token]);
  const [result, setResult] = useState<ConfirmationState>({ order: null, error: null, loading: true });
  const [recovering, setRecovering] = useState(false);
  const recoveryInProgress = useRef(false);
  const confirmation = useRef<{ signature: string; promise: Promise<PaymentOrder> } | null>(null);

  useEffect(() => {
    if (!callback || !access) return;
    let active = true;
    const signature = `${access.kind}:${access.token}:${search}`;
    // StrictMode의 effect 재실행에서도 같은 승인 요청의 결과를 기다립니다.
    if (confirmation.current?.signature !== signature) {
      confirmation.current = { signature, promise: confirmPaymentOrder(access, callback) };
    }
    void confirmation.current.promise.then(
      (order) => { if (active) setResult({ order, error: null, loading: false }); },
      (error: unknown) => { if (active) setResult({ order: null, error: paymentErrorCode(error), loading: false }); },
    );
    return () => { active = false; };
  }, [access, callback, search]);

  async function recover() {
    if (!callback || recoveryInProgress.current) return;
    recoveryInProgress.current = true;
    setRecovering(true);
    try {
      if (!access) return;
      const currentOrder = await reconcilePaymentOrder(access, callback.orderId);
      // 첫 승인 요청이 서버에 도착하지 않았다면 기존 주문으로만 재시도합니다.
      const order = currentOrder.status === 'PENDING'
        ? await confirmPaymentOrder(access, callback)
        : currentOrder;
      setResult({ order, error: null, loading: false });
    } catch (error) {
      setResult((previous) => ({ ...previous, error: paymentErrorCode(error), loading: false }));
    } finally {
      recoveryInProgress.current = false;
      setRecovering(false);
    }
  }

  if (!callback) return <p className="payment-error" role="alert">{labels.invalid}</p>;
  if (!access) return <p className="payment-error" role="alert">{labels.accessLost}</p>;
  if (result.loading) return <p className="payment-loader" role="status">{labels.checking}</p>;

  const order = result.order;
  const paid = order?.status === 'PAID';
  const pending = order?.status === 'CONFIRMING' || order?.status === 'PENDING' || (result.error !== null && uncertainCodes.has(result.error));
  const title = paid ? (order.mode === 'mock' ? labels.mockPaid : labels.paid) : pending ? labels.pending : order?.status === 'FAILED' ? labels.failed : labels.unconfirmed;

  return <>
    <h2>{title}</h2>
    {paid && <p>{labels.paidBody}</p>}
    {pending && <p className="payment-notice" role="status">{labels.pendingBody}</p>}
    {result.error && <p className="payment-error" role="alert">{paymentErrorMessage(result.error, lang)}</p>}
    {order && <>
      <p className="payment-muted">{order.mode === 'mock' ? labels.mock : labels.test}</p>
      <dl className="payment-summary">
        <div><dt>{labels.orderId}</dt><dd>{order.id}</dd></div>
        <div><dt>{labels.amount}</dt><dd>{formatPaymentAmount(order.amount, lang)}</dd></div>
      </dl>
    </>}
    {result.error === 'UNAUTHORIZED' && access.kind === 'user' && <Link className="payment-button" to="/login" state={{ from: `/checkout/success${search}`, reason: 'payment' }}>{labels.login}</Link>}
    {pending && <button className="payment-button" type="button" disabled={recovering} onClick={() => void recover()}>{recovering ? labels.reconciling : labels.reconcile}</button>}
  </>;
}

export default function PaymentResultPage({ lang, token, kind }: PaymentResultPageProps) {
  const labels = copy[lang];
  const location = useLocation();
  const code = new URLSearchParams(location.search).get('code');
  const canceled = code === 'PAY_PROCESS_CANCELED' || code === 'USER_CANCEL';

  return <main className="payment-page">
    <section className="payment-panel">
      <p className="payment-kicker">DEEP PLATE · TEST PAYMENT</p>
      <h1>{labels.title}</h1>
      {kind === 'success' ? <Confirmation key={`${token ?? 'guest'}:${location.search}`} lang={lang} token={token} search={location.search} /> : <>
        <h2>{canceled ? labels.canceled : labels.returned}</h2>
        <p>{canceled ? labels.canceledBody : labels.returnedBody}</p>
      </>}
      <div className="payment-actions">
        {token && <Link className="payment-button payment-button--secondary" to="/orders">{labels.orders}</Link>}
        <Link to="/checkout">{labels.checkout}</Link>
      </div>
    </section>
  </main>;
}
