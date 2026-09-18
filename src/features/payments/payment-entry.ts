import { formId } from '../../data/content';

const applicationSubmissionKey = 'deepplate_curation_application_v1';
const guestPaymentAccessKey = 'deepplate_guest_payment_access_v1';
const applicationSubmissionMaxAgeMs = 30 * 60 * 1_000;

interface ApplicationSubmission {
  formId: string;
  submissionId: string;
  submittedAt: string;
}

interface GuestPaymentAccess {
  orderId: string;
  checkoutToken: string;
}

export function recordCurationApplicationSubmission(submissionId: string) {
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(submissionId)) return false;
  const value: ApplicationSubmission = {
    formId,
    submissionId,
    submittedAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(applicationSubmissionKey, JSON.stringify(value));
    return true;
  } catch {
    // 저장소가 막히면 결제 진입을 허용하지 않아 신청 단계를 건너뛰지 않게 합니다.
    return false;
  }
}

function readCurationApplicationSubmission(): ApplicationSubmission | null {
  try {
    const stored = window.sessionStorage.getItem(applicationSubmissionKey);
    if (!stored) return null;
    const value = JSON.parse(stored) as Partial<ApplicationSubmission>;
    const submittedAt = typeof value.submittedAt === 'string' ? Date.parse(value.submittedAt) : Number.NaN;
    const age = Date.now() - submittedAt;
    const valid = value.formId === formId
      && typeof value.submissionId === 'string'
      && /^[A-Za-z0-9_-]{6,128}$/.test(value.submissionId)
      && Number.isFinite(submittedAt)
      && age >= -60_000
      && age <= applicationSubmissionMaxAgeMs;
    if (valid) return value as ApplicationSubmission;
    window.sessionStorage.removeItem(applicationSubmissionKey);
    return null;
  } catch {
    return null;
  }
}

export function getCurationApplicationSubmissionId() {
  return readCurationApplicationSubmission()?.submissionId ?? null;
}

export function hasCurationApplicationSubmission() {
  return readCurationApplicationSubmission() !== null;
}

export function recordGuestPaymentAccess(orderId: string, checkoutToken: string) {
  try {
    window.sessionStorage.setItem(guestPaymentAccessKey, JSON.stringify({ orderId, checkoutToken } satisfies GuestPaymentAccess));
    return true;
  } catch {
    // 토큰을 보관할 수 없으면 결과 화면에서 해당 비회원 주문을 확인할 수 없습니다.
    return false;
  }
}

export function getGuestPaymentAccess(orderId: string) {
  try {
    const stored = window.sessionStorage.getItem(guestPaymentAccessKey);
    if (!stored) return null;
    const value = JSON.parse(stored) as Partial<GuestPaymentAccess>;
    return value.orderId === orderId
      && typeof value.checkoutToken === 'string'
      && value.checkoutToken.length > 0
      ? value.checkoutToken
      : null;
  } catch {
    return null;
  }
}
