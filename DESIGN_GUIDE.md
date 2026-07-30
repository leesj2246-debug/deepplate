# Deep Plate (딥플레이트) 브랜드 & 디자인 시스템 가이드라인
> **Version 1.0** | *Culinary Curation Archive & Editorial Design System*

---

## 1. 브랜드 정체성 (Brand Essence)

* **브랜드 미션**: 광고와 협찬이 범람하는 정보 속에서, 실제 검증된 정보로 외래 관광객에게 1:1 맞춤형 로컬 미식 큐레이션을 제공합니다.
* **핵심 타깃**: 한국에 2회 이상 방문하는 일본인 및 글로벌 여행객 (명동, 홍대를 벗어나 진짜 로컬 경험을 바라는 층).
* **디자인 콘셉트**: **Luxury Editorial & Borderless Minimalism** (이섭, 모노클, 미슐랭 가이드 스타일의 세련된 여백과 얇은 하이라인 중심).

---

## 2. 로고가이드 (Logo Guidelines)

### 2.1 메인 락업 (Main Lockup)
* **구성**: 44px 버건디 레드 스쿼클 심볼 + `DEEP PLATE` 볼드 워드마크
* **심볼 디테일**:
  * 바탕: 버건디 레드 스쿼클 (`#B81D24`, `rx: 10.5px`)
  * 외곽: 하단이 열린 라운드 캡 화이트 아크 (`stroke-width: 3.8px`)
  * 내부: 순백색 서클 디스크 (`r: 6.6px`) + 중앙 버건디 레드 도트 (`r: 2.3px`)
* **원칙**: 다크 네비게이션 헤더 바 위에서 항상 100% 무손실 벡토라이징(SVG)을 유지하여 해상도 깨짐을 방지합니다.

---

## 3. 컬러 시스템 (Color System & Tokens)

| 토큰명 | 색상 코드 (HEX/RGBA) | 시각적 용도 및 브랜드 의도 |
| :--- | :--- | :--- |
| **`--accent-red`** | `#B81D24` | **Primary Accent**: 메인 CTA 버튼, 강조 텍스트, 아코디언 토글, 01/02 수치 포인트 |
| **`--bg-cream`** | `#FBF9F5` | **Base Background**: 지면 전체의 따뜻하고 고급스러운 미식 잡지 톤 크림 바탕색 |
| **`--text-black`** | `#111111` | **Primary Text**: 메인 타이틀, 헤드라인, 굵은 텍스트 |
| **`--dark-hero`** | `#121110` | **Hero & Header**: 풀스크린 히어로 배경 및 상단 글래스모피즘 네비게이션 헤더 |
| **`--border-solid`** | `rgba(17, 17, 17, 0.08)` | **Hairline Divider**: 1px 보더리스 가로 구분선 |

---

## 4. 타이포그래피 (Typography System)

* **기본 폰트 패밀리**: `Noto Sans KR` (한국어) & `Noto Sans JP` (일본어)
* **원칙**: 브라우저 기본 폰트 사용 금지, `word-break: keep-all;`로 단어가 부자연스럽게 잘리지 않도록 정렬.

### 4.1 타이포 스케일 (Type Scale)

* **Hero Headline (`h1`)**: `clamp(2.4rem, 5vw, 3.8rem)` | Weight: 900
* **Section Subtitle (`h2`)**: `clamp(2rem, 3.8vw, 2.8rem)` | Weight: 900
* **Card & Item Title (`h3`)**: `clamp(1.1rem, 2vw, 1.3rem)` | Weight: 900
* **Body Text (`p`)**: `clamp(1.05rem, 1.8vw, 1.25rem)` | Weight: 400 | Color: `#555555`
* **Badge & Tag**: `0.72rem - 0.76rem` | Weight: 900 | Letter Spacing: `0.18em - 0.25em` (대문자)

---

## 5. 레이아웃 & 보더리스 원칙 (Layout & Editorial Rules)

1. **보더리스 구조 (Borderless Editorial Layout)**:
   * 두꺼운 박스 테두리, 답답한 상자 배경, 과도한 카카오/카드 그림자를 사용하지 않습니다.
   * `1px solid rgba(17,17,17,0.08)` 하이라인과 시원한 여백(`padding: 90px~110px`)으로 섹션을 구분합니다.
2. **비대칭 갤러리 그리드 (Asymmetric Grid)**:
   * 좌/우 컬럼 간 높이 시프트(`padding-top: 130px`)를 부여하여 리듬감 있는 잡지 지면 레이아웃을 형성합니다.
3. **에디토리얼 이미지 캡션 (Below-Image Captions)**:
   * 이미지 하단에 카테고리 태그와 타이틀을 지면 캡션 형태로 배치하여 몰입감을 높입니다.

---

## 6. 모션 시스템 (Luxury Editorial Motion)

* **이징 곡선 (Easing Curve)**: `--ease-editorial: cubic-bezier(0.16, 1, 0.3, 1);` (Apple/Leica 특유의 실크 모션)
* **스크롤 리빌 (Scroll Reveal)**:
  * `.fade-up` (`opacity: 0; transform: translateY(22px); transition: 0.75s;`)
  * `IntersectionObserver` (`threshold: 0.05` 사용으로 스크롤 진입 시 답답함 없는 즉각 반응)
* **시차 딜레이 (Staggered Delays)**:
  * `.delay-1` (0.08s) / `.delay-2` (0.18s) / `.delay-3` (0.28s) / `.delay-4` (0.38s)
* **인터랙티브 호버 (Interactive Hover)**:
  * 카드 이미지 호버 시 `scale(1.045)` 줌 & `-6px` 마이크로 스무스 엘레베이션.
  * 이용 방법 스텝 카드 호버 시 넓은 내각 여백(`padding: 40px 32px`) 유지 및 은은한 버건디 레드 테두리/그림자 하이라이트.

---

## 7. 다국어 시스템 (Trilingual System)

* **지원 언어**: 일어 (`ja`), 한국어 (`ko`), 영어 (`en`)
* **제어 방식**: `body[data-lang="ja"]` 데이터 속성 스위칭
* **원칙**: JavaScript로 텍스트를 재치환하지 않고, 순수 CSS 규칙으로 처리하여 언어 전환 시 레이아웃 튐(Reflow)이나 깜빡임이 일어납니다.

---
© 2026 Deep Plate. All rights reserved.
