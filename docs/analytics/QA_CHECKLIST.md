# Deep Plate 로그 QA 체크리스트

기준일: 2026-10-01

상태 표기: `대기`, `통과`, `실패`, `해당 없음`

## 코드·로컬

| 상태 | 검사 |
| --- | --- |
| 통과 | lint 통과 |
| 통과 | 자동 테스트 4 files, 29 tests 통과 |
| 통과 | production build 통과 |
| 통과 | `git diff --check` 통과 |
| 통과 | UTM이 세션 중 다음 이벤트에 유지됨 — 단위 테스트·브라우저 로그 확인 |
| 통과 | `page_location`에 query string이 없음 — 단위 테스트·브라우저 로그 확인 |
| 통과 | StrictMode에서 핵심 결제 이벤트가 중복되지 않음 |
| 통과 | 결제 성공 이벤트가 서버 `PAID` 확인 뒤에만 발생 |
| 통과 | 이름·이메일·전화번호·Tally 답변·제출 ID·주문 ID·결제키·토큰을 보내지 않음 |

## Amplitude

| 상태 | 검사 |
| --- | --- |
| 통과 | Vercel Preview `page_viewed` 수신 |
| 부분 통과 | 신청 CTA → 폼 열기 순서 확인, Tally 실제 제출은 대기 |
| 대기 | 체크아웃 → 결제 시작 → 결제 성공 이벤트 순서 확인 |
| 대기 | 결제 취소가 `payment_failed`와 `PAY_PROCESS_CANCELED`로 수신 |
| 통과 | UTM 4종과 공통 속성 수신, `environment=preview` 확인 |
| 통과 | 이벤트 속성에 개인정보·결제 비밀값이 없고 IP Address가 `-`로 표시됨 |

## GTM·GA4

| 상태 | 검사 |
| --- | --- |
| 통과 | Vercel Preview에서 `GTM-WGK2NBJF` 로드 확인 |
| 통과 | GA4 실시간 개요에서 Google 태그 수신 확인 |
| 통과 | GA4 실시간 개요에서 `page_view` 확인 |
| 부분 통과 | GA4에서 신청·탐색·체크아웃 이벤트 확인, 결제 성공·취소는 대기 |
| 통과 | Preview 브라우저 로그에서 SPA 경로별 `page_viewed` 1회 확인 |
| 통과 | GTM 자동 페이지뷰와 GA4 History 기반 페이지 변경 수집 비활성화 확인 |
| 통과 | 코드·Amplitude 수신 속성에서 `page_location`의 query string 미포함 확인 |

Amplitude와 GA4 표의 `통과`는 2026-10-01 Vercel Preview, Amplitude Live Events, GA4 실시간 개요를 교차 확인한 결과다. DebugView는 `debug_mode`를 보내지 않아 0대로 표시됐으며, 실제 수신은 실시간 개요에서 검증했다.

## 고정 QA 시나리오

QA URL:

```text
https://<preview-url>/?utm_source=codex&utm_medium=qa&utm_campaign=mission9_qa&utm_content=funnel_v1
```

1. 랜딩 진입
2. 히어로 신청 CTA 클릭
3. Tally 테스트 신청 제출
4. 결제 화면 진입
5. Preview의 mock 결제 승인
6. 성공 화면에서 서버 `PAID` 확인
7. 별도 신청으로 mock 취소
8. Amplitude 이벤트 순서·속성 확인
9. GTM Preview와 GA4 DebugView 확인

실제 홍보 데이터 분석에서는 `utm_campaign=mission9_qa`를 제외한다.
