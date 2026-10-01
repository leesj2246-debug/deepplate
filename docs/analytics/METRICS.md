# Deep Plate 미션 9-1 지표 설계

기준일: 2026-10-01
대상 흐름: 랜딩 방문 → 큐레이션 신청 → 테스트 결제

## 목적

현재 Deep Plate의 핵심 검증 질문은 `1인 수작업 큐레이션에 실제 지불 의사가 있는가?`이다. 미션 9-1에서는 실제 매출을 확정하지 않고, **어떤 유입이 신청과 테스트 결제 완료까지 이어지는지 측정할 수 있는 최소 수집 체계**를 만든다.

테스트 결제 성공은 기술 퍼널 통과를 뜻한다. 실제 유료 수요는 라이브 결제와 제공 의무가 준비된 뒤 별도 지표로 검증한다.

## 핵심 지표

| 우선순위 | 지표 | 계산식 | 판단 질문 |
| --- | --- | --- | --- |
| 1 | 테스트 결제 완료 전환율 | `payment_succeeded` 고유 사용자 ÷ `page_viewed` 고유 사용자 | 방문자가 신청·결제 전체 흐름을 끝내는가? |
| 2 | 신청서 완료율 | `curation_form_submitted` 고유 사용자 ÷ `curation_form_opened` 고유 사용자 | 신청서가 관심 사용자를 이탈시키는가? |
| 3 | 결제 시작률 | `payment_started` 고유 사용자 ÷ `curation_form_submitted` 고유 사용자 | 신청 뒤 결제로 자연스럽게 이어지는가? |
| 4 | 결제 성공률 | `payment_succeeded` 고유 사용자 ÷ `payment_started` 고유 사용자 | 결제창·인증·서버 확인에서 막히는가? |
| 5 | CTA 반응률 | `curation_cta_clicked` 고유 사용자 ÷ 랜딩 `page_viewed` 고유 사용자 | 가치 제안이 신청 행동을 만드는가? |
| 6 | 채널별 신청 전환율 | 채널별 `curation_form_submitted` 고유 사용자 ÷ 채널별 랜딩 고유 사용자 | 어느 홍보 채널이 실제 신청을 만드는가? |

고유 사용자는 로그인 전에는 Amplitude device ID, 로그인 후에는 내부 사용자 ID로 계산한다. 이메일·이름·전화번호는 식별자로 보내지 않는다.

## 퍼널

### 핵심 퍼널

1. `page_viewed` — 랜딩 방문
2. `curation_cta_clicked` — 신청 CTA 클릭
3. `curation_form_opened` — Tally 신청서 열기
4. `curation_form_submitted` — Tally 제출 완료
5. `checkout_viewed` — 결제 화면 도착
6. `payment_started` — 서버 주문 생성 후 결제 시작
7. `payment_succeeded` — 서버가 `PAID` 상태를 확인

### 탐색 보조 퍼널

1. `place_list_viewed`
2. `place_detail_viewed`
3. `curation_cta_clicked` (`cta_location=place_detail`)
4. 핵심 퍼널의 신청·결제 단계

## 분석 단위와 해석 기준

- 방문자와 전환율은 이벤트 수가 아니라 고유 사용자 기준을 우선한다.
- `payment_started`는 버튼 클릭이 아니라 서버가 주문을 만들고 현재 브라우저에 주문 접근 토큰을 저장한 뒤 기록한다.
- `payment_succeeded`는 성공 URL 진입이 아니라 백엔드가 반환한 `PAID` 상태에서만 기록한다.
- `PAY_PROCESS_CANCELED`는 결제 취소이며 성공으로 집계하지 않는다.
- 샘플이 20명 미만이면 채널 우열을 확정하지 않고 방향성만 본다.
- 테스트·내부 QA 세션은 `utm_campaign=mission9_qa`로 분리해 실제 홍보 성과에서 제외한다.

## 미션 9-2에서 볼 분석

- UTM 채널별 방문 → 신청 → 결제 퍼널
- CTA 위치별 신청서 열기 전환
- 신청서 열기 후 제출 이탈
- 제출 후 결제 시작 이탈
- `failure_stage`, `failure_code`별 결제 이탈
- 식당 상세를 본 사용자와 바로 신청한 사용자의 신청 전환 차이
