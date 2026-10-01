import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Language } from '../../data/content';
import { safeAnalyticsCode, trackEvent } from '../../analytics/analytics';
import { createGuestPaymentOrder, getPaymentProduct, PaymentRequestError, paymentErrorCode } from './payment-api';
import type { PaymentConfiguration, PaymentOrder } from './payment-api';
import { formatPaymentAmount, paymentErrorMessage, paymentUi } from './paymentUi';
import useTossWidget from './useTossWidget';
import { getCurationApplicationSubmissionId, recordGuestPaymentAccess } from './payment-entry';
import './payments.css';

interface CheckoutPageProps {
  lang: Language;
  token: string | null;
  isInitializing: boolean;
}

export default function CheckoutPage({ lang, token, isInitializing }: CheckoutPageProps) {
  const labels = paymentUi[lang];
  const navigate = useNavigate();
  const [configuration, setConfiguration] = useState<PaymentConfiguration | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mockOrder, setMockOrder] = useState<PaymentOrder | null>(null);
  const paymentInProgress = useRef(false);
  const checkoutViewed = useRef(false);
  const applicationSubmissionId = getCurationApplicationSubmissionId();
  const applicationSubmitted = applicationSubmissionId !== null;
  const widget = useTossWidget(applicationSubmitted ? configuration : null);
  const usesEmbeddedWidget = configuration?.mode === 'toss-test' && configuration.clientKey?.startsWith('test_gck_') === true;

  useEffect(() => {
    if (checkoutViewed.current) return;
    checkoutViewed.current = true;
    trackEvent('checkout_viewed', { application_state: applicationSubmitted ? 'submitted' : 'missing' });
  }, [applicationSubmitted]);

  useEffect(() => {
    let active = true;
    if (!applicationSubmitted) return () => { active = false; };
    getPaymentProduct().then((value) => { if (active) setConfiguration(value); })
      .catch((cause: unknown) => { if (active) setLoadError(paymentErrorCode(cause)); });
    return () => { active = false; };
  }, [applicationSubmitted, attempt]);

  if (!applicationSubmitted) {
    return (
      <main className="payment-page">
        <section className="payment-intro">
          <span className="payment-kicker">DEEP PLATE · APPLICATION FIRST</span>
          <h1>{labels.applicationRequiredTitle}</h1>
          <p>{labels.applicationRequiredBody}</p>
        </section>
        <section className="payment-panel">
          <div className="payment-product-mark" aria-hidden="true">DP<span>CURATION</span></div>
          <h2>{labels.applicationStep}</h2>
          <p className="payment-notice">{labels.applicationRequiredNotice}</p>
          <Link className="payment-button" to="/?apply=1">{labels.applicationButton}</Link>
        </section>
      </main>
    );
  }

  const startPayment = async () => {
    if (!applicationSubmissionId || !configuration?.available || isInitializing || paymentInProgress.current) return;
    paymentInProgress.current = true;
    setSubmitting(true);
    setError('');
    try {
      if (configuration.mode === 'toss-test') await widget.validateMethod();
      const guest = await createGuestPaymentOrder(configuration.product.id, applicationSubmissionId);
      if (!recordGuestPaymentAccess(guest.order.id, guest.checkoutToken)) throw new PaymentRequestError('CHECKOUT_STORAGE_UNAVAILABLE');
      const order: PaymentOrder = guest.order;
      trackEvent('payment_started', {
        product_id: order.productId,
        amount: order.amount,
        currency: order.currency,
        payment_mode: order.mode,
      });
      if (order.mode === 'mock') { setMockOrder(order); return; }
      await widget.requestPayment(order);
    } catch (cause) {
      const code = paymentErrorCode(cause);
      if (code === 'PAY_PROCESS_CANCELED' || code === 'USER_CANCEL') {
        navigate('/checkout/fail?code=PAY_PROCESS_CANCELED');
      } else {
        trackEvent('payment_failed', { failure_code: safeAnalyticsCode(code), failure_stage: 'payment_start' });
        setError(code);
      }
    } finally {
      paymentInProgress.current = false;
      setSubmitting(false);
    }
  };

  const approveMock = () => {
    if (!mockOrder) return;
    const params = new URLSearchParams({ orderId: mockOrder.id, paymentKey: `mock_${mockOrder.id}`, amount: String(mockOrder.amount) });
    navigate(`/checkout/success?${params.toString()}`);
  };

  return (
    <main className="payment-page">
      <section className="payment-intro">
        <span className="payment-kicker">DEEP PLATE · CHECKOUT</span>
        <h1>{labels.title}</h1>
        <p>{labels.intro}</p>
        <ol className="payment-steps">{labels.includes.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
        <Link className="mvp-back-link" to="/places">← {labels.back}</Link>
      </section>
      <section className="payment-panel" aria-label={labels.product}>
        <div className="payment-product-mark" aria-hidden="true">DP<span>CURATION</span></div>
        <h2>{labels.product}</h2>
        <p className="payment-muted">{labels.description}</p>
        <p className="payment-muted">{labels.guestNotice}</p>
        <p className="payment-notice">{labels.testNotice}</p>
        {!configuration && !loadError && <p role="status">{labels.loading}</p>}
        {loadError && <div role="alert"><p className="payment-error">{paymentErrorMessage(loadError, lang)}</p><button className="payment-button payment-button--secondary" type="button" onClick={() => { setLoadError(''); setAttempt((value) => value + 1); }}>{labels.retry}</button></div>}
        {configuration && <>
          <div className="payment-price"><span>{labels.price}</span><strong>{formatPaymentAmount(configuration.product.amount, lang)}</strong></div>
          <p className="payment-mode">{configuration.mode === 'mock' ? labels.mock : configuration.mode === 'toss-test' ? labels.toss : labels.disabled}</p>
          {usesEmbeddedWidget && configuration.available && <div className="payment-widget">
            {!widget.ready && !widget.hasError && <p role="status">{labels.widgetLoading}</p>}
            {widget.hasError && <p className="payment-error" role="alert">{labels.widgetError}</p>}
            <div id={widget.methodsId} /><div id={widget.agreementId} />
          </div>}
          {mockOrder ? <div className="payment-mock" role="status">
            <p>{labels.mockInfo}</p><p className="payment-muted">{labels.orderId}: {mockOrder.id}</p>
            <div className="payment-actions"><button className="payment-button" type="button" onClick={approveMock}>{labels.approve}</button><Link className="payment-button payment-button--secondary" to={`/checkout/fail?code=PAY_PROCESS_CANCELED&orderId=${encodeURIComponent(mockOrder.id)}`}>{labels.cancel}</Link></div>
          </div> : <>
            {error && <div role="alert"><p className="payment-error">{paymentErrorMessage(error, lang)}</p>{token && <Link to="/orders">{labels.orders}</Link>}{token && error === 'UNAUTHORIZED' && <Link to="/login" state={{ from: '/checkout', reason: 'payment' }}>{labels.login}</Link>}</div>}
            {isInitializing ? <p role="status">{labels.loading}</p> : <button className="payment-button" type="button" disabled={!configuration.available || !widget.ready || submitting} onClick={() => { void startPayment(); }}>{submitting ? labels.processing : configuration.mode === 'toss-test' ? labels.tossPay : labels.pay}</button>}
          </>}
        </>}
      </section>
    </main>
  );
}
