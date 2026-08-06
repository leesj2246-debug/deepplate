# Deep Plate 현재 상태

마지막 확인일: 2026-08-06

## 저장소와 배포

- GitHub: `https://github.com/leesj2246-debug/deepplate`
- 현재 작업 브랜치: `codex/polish-quality`
- 프로덕션: `https://deepplate.vercel.app/`
- Vercel 프로젝트명: `deepplate`
- 로컬 Vercel 연결 정보는 `.vercel/`에 있으며 저장소에 커밋하지 않는다.

## 애플리케이션

- React 19 + Vite 8 단일 페이지 랜딩 사이트.
- 지원 언어는 한국어, 일본어, 영어이다.
- 언어 선택은 브라우저 `localStorage`의 `deepplate_user_lang`에 저장된다.
- 프로덕션 빌드 명령은 `npm run build`이다.

## 설문과 응답

- 공개 Tally 설문: `https://tally.so/r/ZjAlQe`
- Tally 편집 폼 ID: `ZjAlQe`
- Google Sheets 응답 문서: `https://docs.google.com/spreadsheets/d/1RL9klWR9-vHfFmb4GMGPUEnuO0GLpbW_C-4IekWTtQQ/edit`
- 응답 시트에는 Tally 원본 탭 `시트1`과 운영용 탭 `운영 관리`가 있다.
- `운영 관리` 탭은 핵심 항목을 자동 요약하고 진행 상태, 다음 액션, 메모를 수동 관리한다.
- 현재 Tally 원본 헤더에는 영어·일본어 상세 질문만 확인되며 한국어 상세 질문 열은 재연동 점검이 필요하다.

## 랜딩 페이지 설문 연결

- `src/data/content.jsx`의 `formUrl`은 공개 Tally 링크를 사용한다.
- 배포 전 세 언어 CTA가 동일한 공개 Tally 링크를 여는지 확인한다.
