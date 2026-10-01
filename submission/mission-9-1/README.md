# Deep Plate 미션 9-1 제출 증빙

이 폴더는 로깅 구현·Amplitude·GA4 증빙을 모아 최종 ZIP으로 제출하기 위한 작업 폴더다.

## 포함 파일

1. `01-code/`
   - `analytics-module.png`
   - `funnel-instrumentation.png`
   - `tracking-plan.pdf` 또는 Markdown 원본
2. `02-gtm/`
   - `gtm-version-3-evidence.md`
   - 제출 직전 GTM 버전 3 화면 캡처를 추가
3. `03-amplitude/`
   - `amplitude-live-events.csv`
   - `README.md`
4. `04-ga4/`
   - `ga4-realtime-events.csv`
   - `README.md`
5. `05-promotion/`
   - `utm-links.csv`
   - `channel-copy-drafts.md`
   - 실제 게시 후 게시 화면 또는 게시 URL 증빙 추가

## 현재 상태

- 지표 설계: 작성
- Tracking Plan: 작성
- 로깅 코드: 구현 완료
- 로컬 QA: lint·29 tests·build·브라우저 확인 완료
- Amplitude 프로젝트 연결: 완료 (`Deep Plate Mission 9`)
- GTM·GA4 연결: 완료 (`GTM-WGK2NBJF` 버전 3, `G-YF18TE4LRB`)
- Vercel Preview 1차 QA: 완료 — Amplitude Live Events와 GA4 실시간 개요에서 수신 확인
- Preview 환경 분리: 코드와 `VITE_ANALYTICS_ENV=preview` 설정 완료, Amplitude에서 `environment=preview` 재검증 완료
- GitHub: Draft PR #10 생성
- 외부 3개 채널 게시: 사용자 최종 확인 전 초안
- 최종 ZIP: 대기

스크린샷에는 API Secret, 결제키, JWT, 고객 이름·이메일·전화번호·신청 답변이 보이지 않게 한다.
