# 로깅 구현 증빙

## 핵심 코드

- `src/analytics/analytics.ts`: Amplitude 초기화, GTM dataLayer, UTM 유지, 공통 속성, 개인정보 경계
- `src/analytics/RouteAnalytics.tsx`: SPA 페이지 조회, 로그인·언어 User Property 동기화
- `src/components/CurationFormModal.tsx`: 신청서 열기·제출
- `src/features/payments/CheckoutPage.tsx`: 체크아웃 조회·결제 시작·시작 실패
- `src/features/payments/PaymentResultPage.tsx`: 서버 확인 성공·실패·결제사 취소
- `src/features/places/PlacesPage.tsx`, `PlaceDetailPage.tsx`: 맛집 목록·상세 조회

## 자동 검증

```text
lint: passed
test files: 4 passed
tests: 29 passed
production build: passed
```

`src/analytics/analytics.test.ts`는 UTM 세션 유지, 쿼리 제거, 실패 코드 제한을 검증한다. `src/features/payments/payments.test.tsx`는 주문 생성 뒤 `payment_started`, 서버 `PAID` 뒤 `payment_succeeded`, 취소 복귀의 `payment_failed`를 검증한다.

## 개인정보 확인

이벤트에는 다음 값을 포함하지 않는다.

- Tally 답변·제출 ID
- 이름·이메일·전화번호·알레르기·자유 답변
- 주문 ID·결제키·주문 접근 토큰·JWT
- 결제 성공 URL의 query string
