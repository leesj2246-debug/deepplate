# GTM·GA4 설정 절차

## 필요한 값

- GTM 컨테이너 ID: `GTM-...` → Vercel `VITE_GTM_ID`
- Amplitude 프로젝트 API Key → Vercel `VITE_AMPLITUDE_API_KEY`
- GA4 웹 데이터 스트림의 Google 태그 ID: `G-...` → GTM 안에서만 사용

브라우저용 Amplitude API Key와 GTM ID는 프론트 번들에 포함되는 공개 식별값이다. Amplitude Secret Key, 결제 시크릿, Tally signing secret은 프론트 환경 변수에 넣지 않는다.

## GTM

1. Web 컨테이너를 만들고 운영 도메인을 `deepplate.vercel.app`으로 설정한다.
2. Google 태그를 만들고 GA4의 `G-...` 태그 ID를 연결한다.
3. Google 태그의 자동 `page_view` 전송을 끈다. GA4 Enhanced Measurement의 브라우저 기록 기반 페이지 변경 수집도 끈다.
4. Data Layer Variable을 만든다: `page_location`, `page_path`, `language`, `auth_state`, `visitor_type`, `device_type`, `environment`, UTM 5종, 각 이벤트별 추가 속성.
5. `page_viewed` Custom Event trigger 전용 GA4 Event tag를 만들고 GA4 이벤트명은 `page_view`로 설정한다. `page_location`은 dataLayer의 쿼리 없는 값을 사용한다.
6. 나머지 9개 이벤트를 정규식 Custom Event trigger로 묶고 GA4 Event tag의 이벤트명은 `{{Event}}`를 사용한다.
7. Preview에서 이벤트와 속성을 확인한 뒤 Publish한다.

자동 페이지뷰를 끄는 이유는 결제 성공 복귀 URL의 쿼리에 결제키가 포함될 수 있기 때문이다. Deep Plate 코드가 보내는 `page_location`에는 쿼리가 없다.

## Amplitude

1. Web 프로젝트를 만들고 Browser SDK API Key를 복사한다.
2. Vercel 환경 변수 `VITE_AMPLITUDE_API_KEY`에 값을 설정한다.
3. Data 화면에서 Tracking Plan의 10개 이벤트와 속성을 확인한다.
4. `payment_succeeded`가 서버 `PAID` 응답 이후에만 발생하는지 확인한다.
5. 이름·이메일·전화번호·Tally 답변·제출 ID·주문 ID·결제키가 들어오지 않는지 확인한다.

## Vercel 환경 분리

- Preview: QA용 Amplitude 프로젝트 또는 `utm_campaign=mission9_qa`
- Production: 제출·홍보용 프로젝트
- `VITE_ANALYTICS_DEBUG=true`는 Preview QA에서만 사용하고 Production은 `false`로 둔다.

Vite 환경 변수는 빌드 시점에 포함되므로 값을 추가한 뒤 새 배포가 필요하다.
