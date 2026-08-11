import type { ReactNode } from 'react';

export const supportedLanguages = ['ja', 'ko', 'en'] as const;
export type Language = (typeof supportedLanguages)[number];

export type HeroItem =
  | {
    first: string;
    before: string;
    accent: string;
    after: string;
    firstBefore?: never;
    firstAccent?: never;
    firstAfter?: never;
    second?: never;
  }
  | {
    firstBefore: string;
    firstAccent: string;
    firstAfter: string;
    second: string;
    first?: never;
    before?: never;
    accent?: never;
    after?: never;
  };

type TextPair = readonly [string, string];

export interface UiLabels {
  skip: string;
  primaryNav: string;
  home: string;
  language: string;
  openMenu: string;
  closeMenu: string;
  carousel: string;
  previousSlide: string;
  nextSlide: string;
  slide: string;
  of: string;
  scroll: string;
  formTitle: string;
  closeForm: string;
  openExternal: string;
}

export interface LocalizedContent {
  nav: readonly [string, string, string, string];
  apply: string;
  hero: readonly [HeroItem, HeroItem, HeroItem];
  problemTitle: ReactNode;
  problemBody: ReactNode;
  solution: string;
  curationTitle: ReactNode;
  cardTitles: readonly [string, string, string, string];
  howTitle: string;
  howSubtitle: string;
  steps: readonly [TextPair, TextPair, TextPair];
  applyWide: string;
  faqTitle: string;
  faqs: readonly [TextPair, TextPair, TextPair, TextPair];
}

export const formUrl = 'https://tally.so/r/ZjAlQe';
export const formEmbedUrl = 'https://tally.so/embed/ZjAlQe?hideTitle=1&transparentBackground=1';

export const languageLabels = {
  ja: '日本語',
  ko: '한국어',
  en: 'English',
} satisfies Record<Language, string>;

export const uiLabels = {
  ja: {
    skip: 'メインコンテンツへ移動',
    primaryNav: 'メインナビゲーション',
    home: 'Deep Plate ホーム',
    language: '言語',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    carousel: 'Deep Plateのハイライト',
    previousSlide: '前のスライド',
    nextSlide: '次のスライド',
    slide: 'スライド',
    of: '/',
    scroll: '紹介へ移動',
    formTitle: '1:1キュレーション申込書',
    closeForm: '申込書を閉じる',
    openExternal: '別のタブで開く',
  },
  ko: {
    skip: '본문으로 바로가기',
    primaryNav: '주요 메뉴',
    home: 'Deep Plate 홈',
    language: '언어',
    openMenu: '메뉴 열기',
    closeMenu: '메뉴 닫기',
    carousel: 'Deep Plate 주요 콘텐츠',
    previousSlide: '이전 슬라이드',
    nextSlide: '다음 슬라이드',
    slide: '슬라이드',
    of: '/',
    scroll: '브랜드 소개로 이동',
    formTitle: '1:1 큐레이션 신청서',
    closeForm: '신청서 닫기',
    openExternal: '새 탭에서 열기',
  },
  en: {
    skip: 'Skip to main content',
    primaryNav: 'Primary navigation',
    home: 'Deep Plate home',
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    carousel: 'Deep Plate highlights',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    slide: 'Slide',
    of: 'of',
    scroll: 'Scroll to introduction',
    formTitle: '1:1 Curation Request',
    closeForm: 'Close request form',
    openExternal: 'Open in new tab',
  },
} satisfies Record<Language, UiLabels>;

export const copy = {
  ja: {
    nav: ['ブランド', 'キュレーション', 'ご利用の流れ', 'よくある質問'],
    apply: 'キュレーションを申し込む',
    hero: [
      { first: '明洞、弘大...', before: '今回も', accent: 'そこ', after: 'に行きますか？' },
      { firstBefore: '', firstAccent: '韓国人の友達', firstAfter: 'がいてこそ知る穴場、', second: '私たちが代わりにお教えします' },
      { first: '本物のローカルグルメを、', before: '私たちが', accent: '直接', after: '足で探しました' },
    ],
    problemTitle: <>韓国、<em>今回が二度目以上なら</em></>,
    problemBody: <>明洞、弘大はもう行った。 <strong>今回は広告もタイアップもない、本物のローカルグルメが知りたい。</strong></>,
    solution: '本物のローカルグルメを、私たちが足で探しました',
    curationTitle: <>2回目の訪問からは、<br/><em>観光客ではなく地元の人のように食べる。</em></>,
    cardTitles: ['厳選されたローカルグルメ空間', 'まもなく始まります — ソウルローカルグルメストーリー', '実際に足を運んで確認します', 'あなただけの1:1グルメソリューション'],
    howTitle: 'ご利用の流れ',
    howSubtitle: '広告なし、私たちが実際に足を運んで1:1でキュレーションします。',
    steps: [
      ['アンケート入力', '好み、位置、日程、アレルギーまで細かく入力'],
      ['決済完了 (1:1マッチング)', 'お好みに合わせて一つひとつマッチングします'],
      ['1〜2日以内にレポート受信 (マップ連動)', 'Googleマップ直接連動リンク付きのカスタムレポートを1〜2日以内にお送りします'],
    ],
    applyWide: '今すぐ1:1ローカルキュレーションを申し込む',
    faqTitle: 'よくあるご質問',
    faqs: [
      ['申し込んでからキュレーションを受け取るまでどのくらいかかりますか？', 'お申し込み完了後、1〜2日以内にお届けいたします。お急ぎの場合はお知らせいただければ、可能な限り対応させていただきます。'],
      ['韓国語が話せなくても申し込めますか？', 'はい、問題ありません。お申込書と結果は韓国語・日本語・英語でご案内します。'],
      ['お支払いはどのように行いますか？', 'お申込書の送信後、ご希望の連絡方法で利用可能な決済方法をご案内します。決済確認後にキュレーションを開始します。'],
      ['現地でウェイティング登録（順番待ち）ができない場合はどうすればいいですか？', '韓国の電話番号がなく登録が難しい場合はご連絡ください。自動代行ではなく、可能な範囲で個別にご案内します。'],
    ],
  },
  ko: {
    nav: ['브랜드소개', '큐레이션', '이용방법', '자주 묻는 질문'],
    apply: '1:1 큐레이션 신청하기',
    hero: [
      { first: '명동, 홍대...', before: '이번에도 ', accent: '거기', after: ' 가시게요?' },
      { firstBefore: '', firstAccent: '한국인 친구', firstAfter: '가 있어야 아는 곳,', second: '저희가 대신 알려드릴게요' },
      { first: '진짜는,', before: '저희가 ', accent: '직접', after: ' 발로 찾았습니다' },
    ],
    problemTitle: <>한국, <em>이번이 두 번째 이상이라면</em></>,
    problemBody: <>명동, 홍대는 이미 다 가봤다. <strong>이번엔 광고도, 협찬도 없는 진짜 로컬 맛집이 궁금하다.</strong></>,
    solution: '진짜는, 저희가 직접 발로 찾았습니다',
    curationTitle: <>두 번째 방문부터는,<br/><em>관광객이 아니라 동네 사람처럼 먹는다.</em></>,
    cardTitles: ['엄선된 로컬 다이닝 공간', '곧 시작합니다 — 서울 로컬 맛집 이야기', '직접 다녀와서 확인합니다', '맞춤형 1:1 로컬 맛집 솔루션'],
    howTitle: '이용 방법',
    howSubtitle: '광고 없이, 저희가 직접 다녀와서 1:1로 큐레이션해드립니다.',
    steps: [
      ['질문지 작성 (취향 분석)', '취향, 위치, 일정 및 알레르기 등 세밀 질문지 작성'],
      ['결제 완료 (취향 1:1 매칭)', '취향에 맞춰 직접 하나하나 매칭해드립니다'],
      ['1~2일 내 맞춤 리포트 수신 (구글 맵 연동)', '구글 맵 직접 연동 링크가 포함된 맞춤형 리포트를 1~2일 내로 보내드립니다'],
    ],
    applyWide: '지금 1:1 로컬 큐레이션 신청하기',
    faqTitle: '자주 묻는 질문',
    faqs: [
      ['신청 후 큐레이션을 받기까지 얼마나 걸리나요?', '신청 완료 후 1~2일 내로 전달드립니다. 급하신 경우 말씀해주시면 최대한 맞춰드릴게요.'],
      ['한국어를 못해도 신청할 수 있나요?', '네, 문제 없습니다. 신청서와 결과물은 한국어·일본어·영어로 안내해드립니다.'],
      ['결제는 어떻게 하나요?', '신청서 제출 후 선택하신 연락 방법으로 현재 이용 가능한 결제 수단을 안내드립니다. 결제 확인 후 큐레이션을 시작해요.'],
      ['현장에서 웨이팅 등록이 안 되면 어떻게 하나요?', '한국 번호가 없어 등록이 어려우시면 연락해주세요. 자동 대행이 아닌 수동 방식으로, 가능한 범위에서 개별 안내해드립니다.'],
    ],
  },
  en: {
    nav: ['About', 'Curations', 'How It Works', 'FAQ'],
    apply: 'Apply for 1:1 Curation',
    hero: [
      { first: 'Myeongdong, Hongdae...', before: 'Are you going ', accent: 'there', after: ' again?' },
      { firstBefore: 'Spots only ', firstAccent: 'Korean friends', firstAfter: ' know', second: "we'll guide you directly" },
      { first: 'Real local gems,', before: 'curated ', accent: 'directly', after: ' on foot by us' },
    ],
    problemTitle: <>If this is your <em>second time or more in Korea</em></>,
    problemBody: <>You've already been to Myeongdong and Hongdae. <strong>This time, you want real local gems with zero ads or sponsored posts.</strong></>,
    solution: 'Real local gems, curated on foot directly by us',
    curationTitle: <>From your second visit,<br/><em>eat like a local, not a tourist.</em></>,
    cardTitles: ['Curated Local Dining Spaces', 'Coming Soon — Seoul Local Culinary Stories', 'Verified Directly in Person on Site', 'Personalized 1:1 Culinary Curation'],
    howTitle: 'How It Works',
    howSubtitle: 'Zero ads — curated 1:1 directly by us on site.',
    steps: [
      ['Fill Out Questionnaire', 'Specify your tastes, preferred location, schedule, and allergies.'],
      ['Payment & 1:1 Matching', 'Hand-picked one by one tailored to your personal taste.'],
      ['Receive Custom Report in 1–2 Days', 'Custom report with direct Google Maps links delivered within 1–2 days.'],
    ],
    applyWide: 'Apply for Your 1:1 Curation Report',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      ['How long does it take to receive the curation after applying?', 'You will receive your report within 1–2 days after completing your request. If you are in a hurry, please let us know and we will accommodate your schedule.'],
      ["Can I apply even if I don't speak Korean?", 'Yes. The request form and results are available in Korean, Japanese, and English.'],
      ['How do I make the payment?', 'After you submit the form, we will share the currently available payment option through your preferred contact method. Curation begins after payment is confirmed.'],
      ["What if I can't register for the waiting list on site?", "If you don't have a Korean phone number, contact us for individual guidance where possible. This is a manual support service, not automated waiting registration."],
    ],
  },
} satisfies Record<Language, LocalizedContent>;
