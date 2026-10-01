# GTM 게시 증빙

- 확인일: 2026-10-01
- 컨테이너: `GTM-WGK2NBJF`
- 게시 버전: 3
- 버전 이름: `Deep Plate 안전한 페이지뷰 로깅`
- 상태: Live / Latest

## 게시 구성

1. Google 태그 `G-YF18TE4LRB`: `send_page_view=false`
2. `page_viewed` 전용 GA4 Event 태그: GA4 이벤트명 `page_view`
3. Data Layer Variable `DLV - page_location`: 쿼리를 제거한 코드 제공 위치만 사용
4. 행동 이벤트 태그: `{{Event}}`를 사용해 9개 이벤트 전송
5. 행동 이벤트 트리거 정규식:

```text
^(curation_cta_clicked|curation_form_opened|curation_form_submitted|place_list_viewed|place_detail_viewed|checkout_viewed|payment_started|payment_succeeded|payment_failed)$
```

브라우저 보안 정책 때문에 서비스 화면 캡처 파일을 자동으로 작업 폴더에 저장하지 못했다. 게시 상태와 실제 GA4 수신은 `04-ga4/ga4-realtime-events.csv`로 교차 확인했다.
