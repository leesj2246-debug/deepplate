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
| 대기 | `page_viewed` 수신 |
| 대기 | 신청 CTA → 폼 열기 → 제출 이벤트 순서 확인 |
| 대기 | 체크아웃 → 결제 시작 → 결제 성공 이벤트 순서 확인 |
| 대기 | 결제 취소가 `payment_failed`와 `PAY_PROCESS_CANCELED`로 수신 |
| 대기 | UTM 4종과 공통 속성 수신 |
| 대기 | 개인정보·결제 비밀값 미수신 |

## GTM·GA4

| 상태 | 검사 |
| --- | --- |
| 대기 | GTM Preview에서 컨테이너 연결 확인 |
| 대기 | Google 태그 1회 실행 |
| 대기 | GA4 DebugView에서 `page_view` 확인 |
| 대기 | GA4 DebugView에서 신청·결제 이벤트 확인 |
| 대기 | SPA 경로 변경당 페이지뷰 1회 |
| 대기 | 자동 페이지뷰와 History Change 수집 비활성화 확인 |
| 대기 | `page_location`에 결제 성공 query string 미포함 |

Amplitude와 GA4 표의 항목은 실제 프로젝트·컨테이너 연결 뒤에만 `통과`로 바꾼다. 로컬 `dataLayer` 성공을 외부 수신 성공으로 기록하지 않는다.

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
