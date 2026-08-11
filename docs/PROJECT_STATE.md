# Deep Plate 현재 상태

마지막 확인일: 2026-08-11

## 저장소와 배포

- GitHub: `https://github.com/leesj2246-debug/deepplate`
- 운영 기준 브랜치: `main`
- 프로덕션: `https://deepplate.vercel.app/`
- Vercel 프로젝트명: `deepplate`
- 최신 프로덕션 커밋: `dc5a75b` (`refactor: 랜딩 페이지를 TypeScript 기반으로 전환 (#7)`)
- 2026-08-11 기준 Vercel 프로덕션 배포 상태는 `READY`이다.
- 로컬 Vercel 연결 정보는 `.vercel/`에 있으며 저장소에 커밋하지 않는다.

## 애플리케이션

- React 19 + TypeScript + Vite 8 단일 페이지 랜딩 사이트.
- 지원 언어는 한국어, 일본어, 영어이다.
- 언어 선택은 브라우저 `localStorage`의 `deepplate_user_lang`에 저장된다.
- 페이지 섹션은 `src/components/sections/`, 재사용 가능한 상태 동작은 `src/hooks/`에서 관리한다.
- 프로덕션 빌드 명령은 `npm run build`이다.
- 운영 주소에서 데스크톱·모바일, 한국어·일본어·영어 전환, 사이트 내부 Tally 모달, 이미지 로드와 콘솔 오류가 정상임을 확인했다.
- 공식 운영 거점은 서울이며 `Culinary Archive`, 도쿄, X, `hello@deepplate.co`는 확인된 공식 표기로 사용하지 않는다.
- Instagram은 계정의 정확한 공개 URL을 확인한 뒤 웹사이트에 연결한다.

## 설문과 응답

- 공개 Tally 설문: `https://tally.so/r/ZjAlQe`
- Tally 편집 폼 ID: `ZjAlQe`
- Google Sheets 응답 문서: `https://docs.google.com/spreadsheets/d/1RL9klWR9-vHfFmb4GMGPUEnuO0GLpbW_C-4IekWTtQQ/edit`
- 응답 시트에는 Tally 원본 탭 `시트1`과 운영용 탭 `운영 관리`가 있다.
- `운영 관리` 탭은 핵심 항목을 자동 요약하고 진행 상태, 다음 액션, 메모를 수동 관리한다.
- 현재 Tally 원본 헤더에는 영어·일본어 상세 질문만 확인되며 한국어 상세 질문 열은 재연동 점검이 필요하다.

## 랜딩 페이지 설문 연결

- `src/data/content.tsx`의 `formEmbedUrl`은 사이트 내부 설문 모달에서 사용하는 Tally 임베드 링크다.
- `formUrl`은 임베드가 불편하거나 로드되지 않을 때 새 탭에서 여는 대체 링크다.
- 배포 전 세 언어 CTA가 동일한 사이트 내부 설문을 열고, 닫기·ESC·모바일 스크롤이 정상 동작하는지 확인한다.

## 기준 문서

- 사업·브랜드·콘텐츠의 현재 기준은 `docs/MASTER_BRIEF.md`이다.
- 확정되지 않은 가격, 결제 수단, PDF 형식, 연락 채널을 외부 문구에서 단정하지 않는다.
