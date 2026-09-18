import { useEffect, useId, useRef, useState } from 'react';
import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';
import type { TossPaymentsPayment, TossPaymentsWidgets, WidgetPaymentMethodWidget } from '@tosspayments/tosspayments-sdk';
import type { PaymentConfiguration, PaymentOrder } from './payment-api';
import { PaymentRequestError } from './payment-api';

const supportedMethods = new Set(['CARD', 'TOSSPAY', 'NAVERPAY', 'KAKAOPAY', 'PAYCO', 'SAMSUNGPAY', 'SSG', 'LPAY', 'KBPAY', 'APPLEPAY', 'PINPAY']);

export default function useTossWidget(configuration: PaymentConfiguration | null) {
  const instanceId = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const methodsId = `payment-methods-${instanceId}`;
  const agreementId = `payment-agreement-${instanceId}`;
  const widgets = useRef<TossPaymentsWidgets | null>(null);
  const paymentWindow = useRef<TossPaymentsPayment | null>(null);
  const methodsWidget = useRef<WidgetPaymentMethodWidget | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const { mode, clientKey, available } = configuration ?? {};
  const amount = configuration?.product.amount;

  useEffect(() => {
    if (mode !== 'toss-test' || !available || !clientKey || amount === undefined) return;
    let disposed = false;
    const destroy: Array<() => unknown> = [];
    const initialize = async () => {
      try {
        const toss = await loadTossPayments(clientKey);
        if (disposed) return;
        if (clientKey.startsWith('test_ck_')) {
          paymentWindow.current = toss.payment({ customerKey: ANONYMOUS });
          setState('ready');
          return;
        }
        const instance = toss.widgets({ customerKey: ANONYMOUS });
        await instance.setAmount({ currency: 'KRW', value: amount });
        if (disposed) return;
        const methods = await instance.renderPaymentMethods({ selector: `#${methodsId}`, variantKey: 'DEFAULT' });
        if (disposed) { await methods.destroy(); return; }
        destroy.push(() => methods.destroy());
        methodsWidget.current = methods;
        const agreement = await instance.renderAgreement({ selector: `#${agreementId}`, variantKey: 'AGREEMENT' });
        if (disposed) { await agreement.destroy(); return; }
        destroy.push(() => agreement.destroy());
        widgets.current = instance;
        setState('ready');
      } catch {
        if (!disposed) setState('error');
      }
    };
    void initialize();
    return () => {
      disposed = true;
      widgets.current = null;
      paymentWindow.current = null;
      methodsWidget.current = null;
      destroy.forEach((cleanup) => { void Promise.resolve(cleanup()).catch(() => undefined); });
    };
  }, [mode, available, clientKey, amount, methodsId, agreementId]);

  const validateMethod = async () => {
    if (methodsWidget.current) {
      const selected = await methodsWidget.current.getSelectedPaymentMethod();
      if (!supportedMethods.has(selected.code)) throw new PaymentRequestError('UNSUPPORTED_PAYMENT_METHOD');
    }
  };
  const requestPayment = async (order: PaymentOrder) => {
    const redirect = { orderId: order.id, orderName: order.name, successUrl: `${window.location.origin}/checkout/success`, failUrl: `${window.location.origin}/checkout/fail` };
    if (paymentWindow.current) {
      await paymentWindow.current.requestPayment({ ...redirect, method: 'CARD', amount: { currency: 'KRW', value: order.amount }, card: { flowMode: 'DEFAULT' } });
      return;
    }
    if (!widgets.current) throw new PaymentRequestError('REQUEST_FAILED');
    await validateMethod();
    await widgets.current.setAmount({ currency: 'KRW', value: order.amount });
    await widgets.current.requestPayment(redirect);
  };

  return { methodsId, agreementId, validateMethod, requestPayment, ready: mode === 'mock' || state === 'ready', hasError: state === 'error' };
}
