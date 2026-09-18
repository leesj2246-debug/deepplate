import type { Language } from '../../data/content';

export const paymentUi = {
  ko: {
    nav: '큐레이션 신청', orders: '주문 내역', title: '신청이 끝났어요.\n이제 결제를 확인해 주세요.',
    intro: '제출한 큐레이션 신청에 이어 회원가입 없이 테스트 결제를 진행합니다.',
    applicationRequiredTitle: '결제 전에\n큐레이션 신청이 먼저예요.',
    applicationRequiredBody: '취향, 일정, 예산과 식이 조건을 먼저 알려주시면 신청 완료 후 결제 화면으로 이어집니다.',
    applicationStep: '1:1 큐레이션 신청', applicationRequiredNotice: '신청서를 제출해야 결제를 시작할 수 있습니다.', applicationButton: '큐레이션 신청서 작성하기',
    product: '1:1 큐레이션 신청 결제', description: '제출한 큐레이션 신청에 이어 진행하는 과제용 테스트 결제입니다.',
    guestNotice: '회원가입은 필요하지 않습니다. 이 브라우저에서 현재 주문 한 건만 확인합니다.',
    testNotice: '테스트 전용입니다. 실제 청구나 예약·큐레이션 제공은 없으며, 표시 금액은 실제 판매가격이 아닙니다.',
    price: '테스트 결제 금액', includes: ['신청 완료', '결제 확인', '서버 승인', '결제 결과 확인'],
    loading: '결제 정보를 불러오는 중…', retry: '다시 불러오기', login: '로그인하고 계속하기',
    pay: '테스트 결제하기', tossPay: '토스 간편결제로 결제하기', processing: '결제창을 준비하는 중…', widgetLoading: '안전한 테스트 결제창을 불러오는 중…',
    disabled: '현재 테스트 결제를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.',
    mock: '시뮬레이션 모드', toss: '토스 테스트 결제',
    mockInfo: '결제사에 연결하지 않는 연습 모드입니다. 승인 또는 취소를 선택해 흐름을 확인하세요.',
    approve: '시뮬레이션 승인', cancel: '취소 흐름 보기', back: '맛집 더 둘러보기',
    orderId: '주문번호', widgetError: '결제창을 불러오지 못했습니다. 새로고침하거나 잠시 후 다시 시도해 주세요.',
  },
  ja: {
    nav: 'キュレーション申込', orders: '注文履歴', title: 'お申し込みが完了しました。\n次に決済をご確認ください。',
    intro: '送信したキュレーション申込に続いて、会員登録なしでテスト決済を行います。',
    applicationRequiredTitle: '決済の前に\nキュレーション申込が必要です。',
    applicationRequiredBody: '好み、日程、予算、食事条件を先にご入力ください。送信後に決済画面へ進みます。',
    applicationStep: '1:1キュレーション申込', applicationRequiredNotice: '申込書を送信すると決済を開始できます。', applicationButton: '申込書を入力する',
    product: '1:1キュレーション申込決済', description: '送信したキュレーション申込に続いて行う、課題用のテスト決済です。',
    guestNotice: '会員登録は不要です。このブラウザでは現在の注文1件だけを確認します。',
    testNotice: 'テスト専用です。実際の請求・予約・キュレーション提供はありません。表示金額は販売価格ではありません。',
    price: 'テスト決済金額', includes: ['申込完了', '決済確認', 'サーバー承認', '決済結果確認'],
    loading: '決済情報を読み込み中…', retry: '再読み込み', login: 'ログインして続ける',
    pay: 'テスト決済をする', tossPay: 'Tossかんたん決済で支払う', processing: '決済画面を準備中…', widgetLoading: 'テスト決済画面を読み込み中…',
    disabled: 'テスト決済を準備中です。しばらくしてから再度ご確認ください。',
    mock: 'シミュレーション', toss: 'Toss テスト決済',
    mockInfo: '決済会社に接続しない練習モードです。承認またはキャンセルを選んで流れをご確認ください。',
    approve: 'シミュレーション承認', cancel: 'キャンセルを試す', back: 'お店をもっと見る',
    orderId: '注文番号', widgetError: '決済画面を読み込めませんでした。ページを更新してお試しください。',
  },
  en: {
    nav: 'Apply for curation', orders: 'My orders', title: 'Application complete.\nNow review your payment.',
    intro: 'Continue from your submitted curation request to test checkout without creating an account.',
    applicationRequiredTitle: 'Apply for curation\nbefore checkout.',
    applicationRequiredBody: 'Tell us your tastes, schedule, budget and dietary needs first. Checkout follows after submission.',
    applicationStep: '1:1 curation request', applicationRequiredNotice: 'Submit the request form before starting checkout.', applicationButton: 'Complete the request form',
    product: '1:1 curation application payment', description: 'A course test checkout that follows your submitted curation request.',
    guestNotice: 'No account is required. This browser can access only the current order.',
    testNotice: 'Test only. No real charge, booking or curation delivery. The amount shown is not a selling price.',
    price: 'Test payment amount', includes: ['Request submitted', 'Review payment', 'Server confirmation', 'Payment result'],
    loading: 'Loading checkout…', retry: 'Try again', login: 'Log in to continue',
    pay: 'Make a test payment', tossPay: 'Pay with Toss easy pay', processing: 'Preparing checkout…', widgetLoading: 'Loading the test payment form…',
    disabled: 'Checkout is being prepared. Please check again later.',
    mock: 'Simulation mode', toss: 'Toss test payment',
    mockInfo: 'This practice mode does not contact a payment provider. Choose approve or cancel to try the flow.',
    approve: 'Approve simulation', cancel: 'Try cancellation', back: 'Explore more places',
    orderId: 'Order number', widgetError: 'The payment form could not load. Refresh the page and try again.',
  },
} satisfies Record<Language, Record<string, string | string[]>>;

export function formatPaymentAmount(amount: number, lang: Language) {
  return new Intl.NumberFormat({ ko: 'ko-KR', ja: 'ja-JP', en: 'en-US' }[lang], { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);
}

export function paymentErrorMessage(code: string, lang: Language) {
  const messages: Record<string, Record<Language, string>> = {
    UNSUPPORTED_PAYMENT_METHOD: { ko: '이번 체험은 카드·간편결제를 지원합니다. 결제수단을 다시 선택해 주세요.', ja: 'この体験はカード・かんたん決済に対応しています。決済手段を選び直してください。', en: 'This demo supports cards and domestic easy pay. Please select a supported method.' },
    UNAUTHORIZED: { ko: '로그인 시간이 만료되었습니다. 다시 로그인해 주세요.', ja: 'ログインの有効期限が切れました。再度ログインしてください。', en: 'Your session expired. Please log in again.' },
    CHECKOUT_ACCESS_REQUIRED: { ko: '이 브라우저의 비회원 주문 확인 정보가 없습니다. 결제 화면에서 다시 시작해 주세요.', ja: 'このブラウザにゲスト注文の確認情報がありません。決済画面からやり直してください。', en: 'Guest order access is unavailable in this browser. Start again from checkout.' },
    CHECKOUT_STORAGE_UNAVAILABLE: { ko: '이 브라우저에 주문 확인 정보를 저장하지 못했습니다. 브라우저 저장 설정을 확인한 뒤 같은 신청으로 다시 시도해 주세요.', ja: 'このブラウザに注文確認情報を保存できませんでした。保存設定をご確認のうえ、同じ申込から再度お試しください。', en: 'This browser could not save order access. Check browser storage settings and retry with the same application.' },
    APPLICATION_NOT_VERIFIED: { ko: '서버에서 신청 접수를 확인 중입니다. 잠시 후 같은 버튼을 다시 눌러 주세요.', ja: 'サーバーで申込を確認中です。少し待ってから同じボタンをもう一度押してください。', en: 'The server is still verifying your application. Wait a moment and press the same button again.' },
    APPLICATION_VERIFICATION_UNAVAILABLE: { ko: '신청 확인 기능을 준비 중이라 결제를 시작할 수 없습니다.', ja: '申込確認機能の準備中のため、決済を開始できません。', en: 'Application verification is not configured, so checkout cannot start.' },
    NETWORK_ERROR: { ko: '서버 응답을 받지 못했습니다. 진행한 주문이 있다면 주문 내역에서 상태를 확인해 주세요.', ja: 'サーバーから応答がありません。注文済みの場合は履歴から状態をご確認ください。', en: 'No server response. If you started a payment, check its status in My orders.' },
    PAYMENTS_DISABLED: { ko: '현재 테스트 결제를 준비하고 있습니다.', ja: 'テスト決済を準備中です。', en: 'Checkout is being prepared.' },
    AMOUNT_MISMATCH: { ko: '주문 금액이 일치하지 않아 승인하지 않았습니다.', ja: '注文金額が一致しないため承認できません。', en: 'The amount did not match this order. It was not approved.' },
    INVALID_PAYMENT_INPUT: { ko: '결제 정보가 올바르지 않습니다. 주문 내역을 확인해 주세요.', ja: '決済情報が正しくありません。注文履歴をご確認ください。', en: 'Invalid payment details. Please check My orders.' },
    ORDER_NOT_FOUND: { ko: '이 계정에서 확인할 수 있는 주문이 없습니다.', ja: 'このアカウントで確認できる注文がありません。', en: 'This order is not available for your account.' },
    PAYMENT_PROCESSING: { ko: '서버가 이 주문을 확인하고 있습니다. 잠시 후 상태를 다시 확인해 주세요.', ja: '注文を確認中です。少し待ってから再確認してください。', en: 'This order is being checked. Check its status again shortly.' },
    PAYMENT_UNCERTAIN: { ko: '승인 결과를 아직 확인하지 못했습니다. 같은 주문의 상태를 다시 확인해 주세요.', ja: '承認結果は未確認です。同じ注文の状態を再確認してください。', en: 'The approval result is not yet known. Check this same order again.' },
    PAYMENT_REVIEW_REQUIRED: { ko: '자동으로 확정할 수 없는 주문입니다. 주문번호를 보관하고 운영자에게 문의해 주세요.', ja: '自動確認できない注文です。注文番号を控えて運営者にお問い合わせください。', en: 'This order needs a manual review. Keep the order number and contact the operator.' },
    PAYMENT_DECLINED: { ko: '결제사에서 실패 또는 취소 상태를 확인했습니다.', ja: '決済会社で失敗またはキャンセルが確認されました。', en: 'The provider confirmed that this payment failed or was cancelled.' },
  };
  return messages[code]?.[lang] ?? { ko: '요청을 완료하지 못했습니다. 주문 내역을 확인한 후 다시 시도해 주세요.', ja: '処理を完了できませんでした。注文履歴を確認してからお試しください。', en: 'The request could not finish. Check My orders before trying again.' }[lang];
}
