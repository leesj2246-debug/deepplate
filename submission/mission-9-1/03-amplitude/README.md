# Amplitude 수집 증빙

2026-10-01 18:32~18:33 KST에 Vercel Preview에서 UTM 캠페인 `mission9_preview`, 소재 `pr10`으로 QA했다.

Amplitude Live Events에서 Preview 사용자 `1731821426708`의 `page_viewed`, `curation_cta_clicked`, `checkout_viewed` 수신을 확인했다. `curation_cta_clicked` 상세 화면에서 `page_location`에 쿼리가 없고, 사용자 속성의 IP Address가 `-`로 표시되는 것도 확인했다.

환경 분리 재배포 후 2026-10-01 18:40:51 KST의 `page_viewed` 상세 화면에서 `environment=preview`, `utm_campaign=mission9_preview_final`, `utm_content=pr10_env`, IP Address `-`를 확인했다.

이 폴더의 CSV는 위 Live Events 화면에서 확인한 행과 속성을 제출용으로 옮긴 샘플이다. API Key, 이메일, 전화번호, 주문 ID, 결제키는 포함하지 않았다.
