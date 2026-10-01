# Deep Plate Tracking Plan

버전: 1.0
기준일: 2026-10-01

## 공통 규칙

- 이벤트 이름은 영문 소문자 `snake_case`를 사용한다.
- 모든 이벤트에 `event_version`, `page_path`, `page_location`, `language`, `auth_state`, `visitor_type`, `device_type`, `environment`를 붙인다.
- UTM이 있는 최초 진입에서는 `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`을 세션 동안 유지한다.
- `page_location`은 origin과 pathname만 사용한다. 쿼리 문자열은 결제키 등 민감값 노출을 막기 위해 전송하지 않는다.
- 이름, 이메일, 전화번호, 알레르기, Tally 답변, 제출 ID, 주문 ID, 결제키, 주문 접근 토큰, JWT는 전송하지 않는다.

## 이벤트

| 이벤트 | 발생 조건 | 분석 목적 | 추가 Event Property | Amplitude | GA4 |
| --- | --- | --- | --- | --- | --- |
| `page_viewed` | SPA 경로가 바뀌어 새 페이지를 볼 때 1회 | 방문·페이지별 유입 | 공통 속성 | 전송 | `page_view`로 매핑 |
| `curation_cta_clicked` | 신청 CTA를 사용자가 누를 때 | CTA 위치별 반응 | `cta_location`, 선택적 `place_slug` | 전송 | 전송 |
| `curation_form_opened` | Tally 모달이 열릴 때 1회 | 신청 시작 | `cta_location`, `form_id` | 전송 | 전송 |
| `curation_form_submitted` | 검증된 `Tally.FormSubmitted` 메시지를 받을 때 | 신청 완료 | `cta_location`, `form_id`, `checkout_entry_saved` | 전송 | 전송 |
| `place_list_viewed` | 식당 목록 API가 성공적으로 끝날 때 | 탐색 사용률 | `catalog_size` | 전송 | 전송 |
| `place_detail_viewed` | 식당 상세 API가 성공하고 상세가 표시될 때 | 식당 관심 | `place_slug`, `area`, `category`, `verification_status` | 전송 | 전송 |
| `checkout_viewed` | 결제 페이지가 표시될 때 | 신청→결제 진입 | `application_state` | 전송 | 전송 |
| `payment_started` | 주문 생성과 브라우저 주문 접근 저장이 성공한 뒤 | 결제 시작 | `product_id`, `amount`, `currency`, `payment_mode` | 전송 | 전송 |
| `payment_succeeded` | 서버 응답의 주문 상태가 `PAID`일 때 1회 | 결제 완료 | `product_id`, `amount`, `currency`, `payment_mode`, `confirmation_source=server` | 전송 | 전송 |
| `payment_failed` | 시작 오류, 결제사 실패·취소 복귀, 서버 확정 실패 | 이탈 원인 | `failure_stage`, `failure_code`, 가능한 경우 상품·금액·통화·모드 | 전송 | 전송 |

## 속성 허용값

### 공통 Event Property

| 속성 | 형식·예시 | 설명 |
| --- | --- | --- |
| `event_version` | `1` | 스키마 버전 |
| `page_path` | `/checkout` | 쿼리 없는 현재 경로 |
| `page_location` | `https://deepplate.vercel.app/checkout` | 쿼리 없는 절대 주소 |
| `language` | `ko`, `ja`, `en` | 서비스 언어 |
| `auth_state` | `anonymous`, `authenticated` | 로그인 여부. 사용자 정보는 포함하지 않음 |
| `visitor_type` | `new`, `returning` | 같은 브라우저의 이전 방문 여부 |
| `device_type` | `mobile`, `tablet`, `desktop` | 화면 너비 기준 |
| `environment` | `production`, `development`, `test` | 실행 환경 |
| `utm_source` | `kakao`, `naver`, `instagram` | 채널 |
| `utm_medium` | `messenger`, `blog`, `social` | 매체 유형 |
| `utm_campaign` | `mission9_launch` | 캠페인 |
| `utm_content` | `founder_invite_v1` | 소재 버전 |

### 결제 실패 단계

- `payment_start`: 주문 생성·저장·결제창 요청 과정
- `provider_return`: 결제사 취소·실패 URL 복귀
- `server_confirmation`: 서버 승인·상태 확인 결과

`failure_code`는 대문자, 숫자, 밑줄만 허용하며 그 외 값은 `UNKNOWN_ERROR`로 기록한다.

## User Property

| 속성 | 값 | 설정 방식 |
| --- | --- | --- |
| `language` | `ko`, `ja`, `en` | 현재 선택 언어로 갱신 |
| `auth_state` | `anonymous`, `authenticated` | 로그인 상태로 갱신 |
| `visitor_type` | `new`, `returning` | 브라우저 최초 방문 표식 |
| `first_utm_source` | 최초 UTM source | Amplitude `setOnce` |
| `first_utm_medium` | 최초 UTM medium | Amplitude `setOnce` |
| `first_utm_campaign` | 최초 UTM campaign | Amplitude `setOnce` |
| `first_utm_content` | 최초 UTM content | Amplitude `setOnce` |
| `first_referrer_domain` | 최초 외부 referrer의 hostname | Amplitude `setOnce` |

로그인 사용자는 백엔드 내부 사용자 ID만 Amplitude User ID로 사용한다. GA4에는 사용자 ID를 보내지 않는다.

## 구현 위치

- 공통 초기화·속성·UTM·Amplitude·GTM dataLayer: `src/analytics/analytics.ts`
- SPA 페이지 조회·사용자 속성 동기화: `src/analytics/RouteAnalytics.tsx`
- Tally 신청 로그: `src/components/CurationFormModal.tsx`
- CTA 로그: 랜딩, 탐색 헤더, 식당 상세 화면
- 결제 로그: `CheckoutPage.tsx`, `PaymentResultPage.tsx`
