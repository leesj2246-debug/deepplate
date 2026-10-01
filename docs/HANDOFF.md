# Deep Plate 작업 인수인계

마지막 갱신: 2026-10-01

## 현재 작업 상태

- 작업 브랜치: `codex/add-analytics-tracking`
- 기준 원격 브랜치: `origin/main` (`4dfaf48`)
- 프로덕션: `https://deepplate.vercel.app/` — 2026-10-01 화면 로드 확인
- 이번 브랜치는 로컬 격리 복사본 `ai 브레인/worktrees/deepplate-analytics`에 있다.
- 원본 `딥플 렌딩페이지`의 미커밋 문서·이미지·스크립트는 수정하거나 복사하지 않았다.
- 이번 분석 변경은 아직 push·PR·Vercel Preview 배포 전이다.

## 미션 9-1 구현

- 핵심 퍼널: 방문 → CTA → Tally 열기 → 제출 → 체크아웃 → 결제 시작 → 서버 확인 성공/실패.
- `src/analytics/analytics.ts`가 공통 속성, 세션 UTM, Amplitude Browser SDK 2, GTM dataLayer를 관리한다.
- Amplitude SDK는 API Key가 있을 때만 hydration 이후 별도 청크로 불러온다.
- `RouteAnalytics.tsx`가 SPA 페이지뷰와 Amplitude 사용자 속성을 동기화한다.
- 랜딩·탐색·식당 상세·Tally·결제 화면에 Tracking Plan의 10개 이벤트를 연결했다.
- 결제 성공은 URL이 아니라 백엔드 `PAID` 응답 뒤에만 기록한다.
- `page_location`에서 query를 제거하고 Tally 답변·제출 ID·주문 ID·결제키·토큰·이메일 등 민감값을 보내지 않는다.
- 지표, Tracking Plan, GTM·GA4 설정, QA, UTM 홍보 문서를 `docs/analytics/`에 작성했다.
- 제출 자료 구조와 로컬 화면 증빙은 `submission/mission-9-1/`에 있다.

## 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd test`: 4 files, 29 tests 통과
- `npm.cmd run build`: 통과. 앱 326.29 kB, Amplitude 별도 청크 237.37 kB
- 인앱 브라우저: 랜딩·Tally 모달·결제 직접 진입 안내 정상, 콘솔 오류 0건
- 브라우저 디버그 로그: `page_viewed`, `curation_cta_clicked`, `curation_form_opened`, `checkout_viewed`와 UTM 속성 확인
- 자동 테스트: UTM 세션 유지, page URL query 제거, 실패 코드 제한, 결제 시작·서버 성공·취소 로그 확인

## 외부 서비스 확인 상태

- GA4: 속성 `a409677082p556075975`에 `Deep Plate Production` 웹 스트림을 만들었다. 스트림 ID는 `15917983986`, 측정 ID는 `G-YF18TE4LRB`다.
- GA4 향상된 측정의 브라우저 기록 기반 페이지 변경 수집을 껐다. 초기 자동 `page_view`는 GTM의 `send_page_view=false`로 막는다.
- GTM: `GTM-WGK2NBJF` 버전 3을 게시했다. 자동 페이지뷰 대신 쿼리 없는 `page_location`을 사용하는 표준 `page_view`와 9개 행동 이벤트를 전송한다.
- 중복 GTM `GTM-WJVCP7ZT`는 변경하지 않았다.
- Amplitude: `Deep Plate Mission 9` 프로젝트를 만들었다. Browser SDK API Key는 코드·문서에 기록하지 않고 Vercel Preview 환경 변수에만 저장했다.
- Vercel Preview: `VITE_AMPLITUDE_API_KEY`, `VITE_GTM_ID`, `VITE_ANALYTICS_DEBUG=true`를 저장했다.
- Preview QA에서 Vite의 `MODE`가 `production`으로 기록되는 문제를 발견해 `VITE_ANALYTICS_ENV=preview` 분리를 코드와 Vercel Preview 설정에 추가했다. 새 배포에서 재검증해야 한다.
- GitHub Draft PR: `https://github.com/leesj2246-debug/deepplate/pull/10`
- 1차 Preview: `https://deepplate-git-codex-add-analyt-83db79-leesj2246-debugs-projects.vercel.app`
- 1차 Preview에서 랜딩·Tally 신청서·맛집 목록·맛집 상세·결제 선행조건 화면을 확인했다.
- Amplitude Live Events에서 Preview UTM 이벤트와 IP Address `-`를 확인했고, GA4 실시간 개요에서 `page_view`와 5개 Deep Plate 행동 이벤트 수신을 확인했다.

## 다음 시작점

1. 환경 분리 커밋을 push해 새 Vercel Preview를 생성한다.
2. 새 Preview 이벤트의 `environment=preview`와 Amplitude·GA4 수신을 재검증한다.
3. 결제 성공·취소는 실제 결제나 백엔드 mock을 사용할 수 있을 때 별도로 검증한다.
4. 제출 직전 GTM 버전 3 화면 캡처와 실제 게시 증빙을 추가하고 ZIP으로 묶는다.
5. Production 배포와 실제 채널 홍보는 별도 승인 후 진행한다.

## 보호 경계

- 운영 고객·Tally 원본 응답·결제 데이터는 수정하거나 삭제하지 않는다.
- 비밀키와 고객 정보는 코드·문서·스크린샷·Git에 넣지 않는다.
- 원본 작업 폴더의 미커밋 파일은 이번 브랜치에 포함하지 않는다.
