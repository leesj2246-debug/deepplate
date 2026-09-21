import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../../data/content';
import { getPaymentOrders, paymentErrorCode, reconcilePaymentOrder } from './payment-api';
import type { PaymentOrder } from './payment-api';
import { formatPaymentAmount, paymentErrorMessage } from './paymentUi';
import './payments.css';

const copy = {
  ko: {
    title: '내 주문', description: '서버에서 확인한 결제 결과를 모아 볼 수 있어요.',
    loading: '주문 내역을 불러오고 있어요.', refresh: '새로고침', retry: '다시 불러오기',
    empty: '아직 주문이 없어요.', emptyBody: '큐레이션 신청 후 테스트 결제를 진행하면 여기에 기록됩니다.',
    checkout: '큐레이션 신청 결제 보기', orderId: '주문 번호', createdAt: '주문 날짜', amount: '금액',
    mock: '모의 결제 · 실제 청구 없음', test: '토스 테스트 결제 · 실제 청구 없음',
    reconcile: '결제 상태 다시 확인', reconciling: '확인 중…',
    pending: '주문 생성 · 결제 미확인', confirming: '결제 결과 확인 중', paid: '결제 확인 완료', failed: '결제 미완료',
    pendingBody: '주문은 만들어졌지만 결제 완료는 확인되지 않았어요.',
    confirmingBody: '완료 여부를 확인 중이에요. 새로 결제하기 전에 이 주문의 상태를 다시 확인해 주세요.',
    login: '다시 로그인하기',
  },
  ja: {
    title: '注文履歴', description: 'サーバーで確認した決済結果を確認できます。',
    loading: '注文履歴を読み込んでいます。', refresh: '更新', retry: '再読み込み',
    empty: '注文はまだありません。', emptyBody: 'キュレーション申込後にテスト決済を行うと、ここに記録されます。',
    checkout: 'キュレーション申込決済を見る', orderId: '注文番号', createdAt: '注文日時', amount: '金額',
    mock: '模擬決済 · 請求なし', test: 'Toss テスト決済 · 請求なし',
    reconcile: '決済状態を再確認', reconciling: '確認中…',
    pending: '注文作成 · 決済未確認', confirming: '決済結果を確認中', paid: '決済確認済み', failed: '決済未完了',
    pendingBody: '注文は作成されましたが、決済完了は確認されていません。',
    confirmingBody: '完了したか確認中です。再度決済する前に、この注文の状態を確認してください。',
    login: '再ログイン',
  },
  en: {
    title: 'My orders', description: 'View payment results confirmed by the server.',
    loading: 'Loading your orders.', refresh: 'Refresh', retry: 'Try again',
    empty: 'No orders yet.', emptyBody: 'Test payments made after a curation request will appear here.',
    checkout: 'View curation application payment', orderId: 'Order number', createdAt: 'Created', amount: 'Amount',
    mock: 'Simulation · No real charge', test: 'Toss test payment · No real charge',
    reconcile: 'Check payment status', reconciling: 'Checking…',
    pending: 'Order created · Payment unconfirmed', confirming: 'Checking payment result', paid: 'Payment confirmed', failed: 'Payment incomplete',
    pendingBody: 'The order was created, but payment completion has not been confirmed.',
    confirmingBody: 'Completion is still being checked. Check this order before starting another payment.',
    login: 'Sign in again',
  },
};

interface OrdersPageProps { lang: Language; token: string }
interface OrdersState { orders: PaymentOrder[]; loading: boolean; error: string | null }

function OrderHistory({ lang, token }: OrdersPageProps) {
  const labels = copy[lang];
  const [state, setState] = useState<OrdersState>({ orders: [], loading: true, error: null });
  const [reload, setReload] = useState(0);
  const [recoveringId, setRecoveringId] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<{ id: string; code: string } | null>(null);
  const recoveryInProgress = useRef(false);

  useEffect(() => {
    let active = true;
    void getPaymentOrders(token).then(
      (orders) => { if (active) setState({ orders, loading: false, error: null }); },
      (error: unknown) => { if (active) setState({ orders: [], loading: false, error: paymentErrorCode(error) }); },
    );
    return () => { active = false; };
  }, [token, reload]);

  function refresh() {
    setState((previous) => ({ ...previous, loading: true, error: null }));
    setRecoveryError(null);
    setReload((previous) => previous + 1);
  }

  async function recover(orderId: string) {
    if (recoveryInProgress.current) return;
    recoveryInProgress.current = true;
    setRecoveringId(orderId);
    setRecoveryError(null);
    try {
      const updated = await reconcilePaymentOrder({ kind: 'user', token }, orderId);
      setState((previous) => ({ ...previous, orders: previous.orders.map((order) => order.id === updated.id ? updated : order) }));
    } catch (error) {
      setRecoveryError({ id: orderId, code: paymentErrorCode(error) });
    } finally {
      recoveryInProgress.current = false;
      setRecoveringId(null);
    }
  }

  const statuses: Record<PaymentOrder['status'], string> = {
    PENDING: labels.pending, CONFIRMING: labels.confirming, PAID: labels.paid, FAILED: labels.failed,
  };
  const locale = { ko: 'ko-KR', ja: 'ja-JP', en: 'en-US' }[lang];

  return <main className="payment-page">
    <section className="payment-panel">
      <p className="payment-kicker">DEEP PLATE · MY ORDERS</p>
      <h1>{labels.title}</h1>
      <p className="payment-muted">{labels.description}</p>
      <div className="payment-actions">
        <Link className="payment-button" to="/checkout">{labels.checkout}</Link>
        <button className="payment-button payment-button--secondary" type="button" disabled={state.loading || recoveringId !== null} onClick={refresh}>{labels.refresh}</button>
      </div>
    </section>
    {state.loading ? <p className="payment-loader" role="status">{labels.loading}</p> : state.error ? <section className="payment-panel">
      <p className="payment-error" role="alert">{paymentErrorMessage(state.error, lang)}</p>
      {state.error === 'UNAUTHORIZED' ? <Link className="payment-button" to="/login" state={{ from: '/orders', reason: 'payment' }}>{labels.login}</Link> : <button className="payment-button" type="button" onClick={refresh}>{labels.retry}</button>}
    </section> : state.orders.length === 0 ? <section className="payment-panel">
      <h2>{labels.empty}</h2><p>{labels.emptyBody}</p>
    </section> : <section className="payment-order-list" aria-label={labels.title}>
      {state.orders.map((order) => <article className="payment-order" key={order.id}>
        <p className={`payment-status${order.status === 'PAID' ? ' payment-status--paid' : ''}`}>{statuses[order.status]}</p>
        <h2>{order.name}</h2>
        <p className="payment-muted">{order.mode === 'mock' ? labels.mock : labels.test}</p>
        <dl className="payment-summary">
          <div><dt>{labels.orderId}</dt><dd>{order.id}</dd></div>
          <div><dt>{labels.createdAt}</dt><dd><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString(locale)}</time></dd></div>
          <div><dt>{labels.amount}</dt><dd>{formatPaymentAmount(order.amount, lang)}</dd></div>
        </dl>
        {order.status === 'PENDING' && <p className="payment-notice">{labels.pendingBody}</p>}
        {order.status === 'CONFIRMING' && <>
          <p className="payment-notice">{labels.confirmingBody}</p>
          <button className="payment-button payment-button--secondary" type="button" disabled={recoveringId !== null} onClick={() => void recover(order.id)}>{recoveringId === order.id ? labels.reconciling : labels.reconcile}</button>
        </>}
        {recoveryError?.id === order.id && <p className="payment-error" role="alert">{paymentErrorMessage(recoveryError.code, lang)}</p>}
      </article>)}
    </section>}
  </main>;
}

export default function OrdersPage({ lang, token }: OrdersPageProps) {
  return <OrderHistory key={token} lang={lang} token={token} />;
}
