# Deep Plate 작업 인수인계

마지막 갱신: 2026-10-01

## 현재 작업 상태

- 작업 브랜치: `codex/add-analytics-tracking`
- 기준 원격 브랜치: `origin/main` (`4dfaf48`)
- 프로덕션: `https://deepplate.vercel.app/` — 2026-10-01 화면 로드 확인
- 이번 브랜치는 로컬 격리 복사본 `ai 브레인/worktrees/deepplate-analytics`에 있다.
- 원본 `딥플 렌딩페이지`의 미커밋 문서·이미지·스크립트는 수정하거나 복사하지 않았다.
- 이번 분석 변경은 아직 push·PR·Vercel 배포 전이다.

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

- GA4: 로그인된 기존 속성 `a409677082p556075975`가 있으나 데이터 스트림이 없다. 이메일 커뮤니케이션 선택 모달이 열려 있다.
- GTM: 비어 있는 Deep Plate Web 컨테이너가 2개 있다. `GTM-WGK2NBJF`, `GTM-WJVCP7ZT` 모두 변경사항·최근 데이터가 없다.
- Amplitude: 로그인 전이며 기존 프로젝트 여부는 미확인이다.
- 외부 프로젝트·데이터 스트림·API Key 생성과 GTM 게시 전 사용자 확인이 필요하다.

## 다음 시작점

1. Amplitude Google 로그인을 승인받고 기존 프로젝트가 없으면 `Deep Plate Mission 9` 프로젝트를 만든다.
2. GA4의 이메일 커뮤니케이션은 모두 선택 해제 상태로 저장한 뒤 `deepplate.vercel.app` Web 데이터 스트림을 만든다.
3. GTM 중 하나만 선택해 Google 태그와 Tracking Plan 이벤트 태그를 만들고 Preview에서 확인한다.
4. Vercel Preview에 `VITE_AMPLITUDE_API_KEY`, `VITE_GTM_ID`, `VITE_ANALYTICS_DEBUG=true`를 설정한다.
5. Preview mock 흐름으로 성공·취소 QA 후 Amplitude·GA4 스크린샷·CSV를 제출 폴더에 추가한다.
6. 관련 변경만 커밋·push하고 한국어 Draft PR을 만든다. Production 배포는 별도 승인 후 진행한다.

## 보호 경계

- 운영 고객·Tally 원본 응답·결제 데이터는 수정하거나 삭제하지 않는다.
- 비밀키와 고객 정보는 코드·문서·스크린샷·Git에 넣지 않는다.
- 원본 작업 폴더의 미커밋 파일은 이번 브랜치에 포함하지 않는다.
