import type { Language } from '../../data/content';
import type { Restaurant } from './place-api';

export function getPlaceName(place: Restaurant, lang: Language): string {
  if (lang === 'ja') return place.nameJa || place.nameKo;
  if (lang === 'en') return place.nameEn || place.nameKo;
  return place.nameKo;
}

export function getBudgetText(place: Restaurant, lang: Language): string {
  const locale = lang === 'ja' ? 'ja-JP' : lang === 'en' ? 'en-US' : 'ko-KR';
  const format = (value: number) => `₩${value.toLocaleString(locale)}`;
  if (place.minBudget !== null && place.maxBudget !== null) return `${format(place.minBudget)}–${format(place.maxBudget)}`;
  if (place.minBudget !== null) return `${format(place.minBudget)}+`;
  if (place.maxBudget !== null) return `≤ ${format(place.maxBudget)}`;
  return '';
}

export function isVerifiedPlace(place: Restaurant): boolean {
  return place.verificationStatus === 'VERIFIED' || place.verificationStatus === 'OFFICIAL_SOURCE';
}

export const placeUi = {
  ja: {
    language: '言語を選択',
    exploreNav: 'ソウルの食を探す',
    savedNav: '保存した場所',
    apiEyebrow: 'DEEP PLATE · VERIFIED DATA',
    loading: 'レストラン情報を読み込んでいます…',
    loadError: 'レストラン情報を読み込めませんでした。',
    retry: 'もう一度試す',
    emptyCatalogTitle: '現在公開中のレストランはありません',
    emptyCatalogBody: '検証済みの情報が準備でき次第、こちらに表示します。',
    informationPending: '確認中',
    verified: '検証済み',
    pendingVerification: '情報確認中',
    mapLink: '地図を見る',
    sourceLabel: '公式情報',
    lastVerifiedLabel: '最終確認日',
    saving: '保存中…',
    exploreTitle: '自分のペースで、ソウルの一皿を探す',
    exploreBody: '旅程や好みに合うソウルの一皿を、確認済みの情報から探せます。',
    all: 'すべて',
    searchLabel: '場所を検索',
    searchPlaceholder: 'エリア、料理、雰囲気で検索',
    budgetLabel: '予算',
    allBudgets: 'すべての予算',
    waitingFilter: 'ウェイティング相談可',
    waitingBadge: 'ウェイティング相談',
    resetFilters: '条件をリセット',
    noResultsTitle: '条件に合うレストランがありません',
    noResultsBody: '検索語またはフィルターを変更してください。',
    resultUnit: '件',
    viewDetail: '詳しく見る',
    save: '保存する',
    loginToSave: 'ログインして保存',
    remove: '保存を解除',
    savedTitle: '保存した場所',
    savedBody: 'アカウントに保存したレストランを確認できます。',
    emptyTitle: 'まだ保存した場所がありません',
    emptyBody: '気になる場所を保存すると、ここに集まります。',
    browse: '場所を探す',
    backToList: '一覧に戻る',
    detailLabel: 'キュレーションメモ',
    fitLabel: 'この予定に合う理由',
    factsLabel: '訪問前に確認すること',
    hoursLabel: '時間帯',
    accessLabel: 'エリア・アクセス',
    signatureLabel: '想定メニュー',
    apply: 'この条件で1:1キュレーションを申し込む',
    mockNotice: '公式情報を基準に掲載しています。訪問前に営業時間や価格などの最新情報を再確認してください。',
    notFoundTitle: 'ページが見つかりません',
    notFoundBody: 'URLを確認するか、ホームに戻ってください。',
    backHome: 'ホームに戻る',
  },
  ko: {
    language: '언어 선택',
    exploreNav: '서울의 맛 둘러보기',
    savedNav: '저장한 맛집',
    apiEyebrow: 'DEEP PLATE · VERIFIED DATA',
    loading: '식당 정보를 불러오는 중입니다…',
    loadError: '식당 정보를 불러오지 못했습니다.',
    retry: '다시 시도',
    emptyCatalogTitle: '현재 공개된 식당이 없습니다',
    emptyCatalogBody: '검증된 정보가 준비되면 이곳에 표시합니다.',
    informationPending: '확인 중',
    verified: '검증 완료',
    pendingVerification: '정보 확인 중',
    mapLink: '지도 보기',
    sourceLabel: '공식 출처',
    lastVerifiedLabel: '마지막 확인일',
    saving: '저장 중…',
    exploreTitle: '내 속도에 맞춰, 서울의 한 끼를 찾다',
    exploreBody: '여행 일정과 취향에 맞는 서울의 한 끼를 확인된 정보에서 찾아보세요.',
    all: '전체',
    searchLabel: '맛집 검색',
    searchPlaceholder: '지역, 음식, 분위기로 찾아보세요',
    budgetLabel: '예산',
    allBudgets: '전체 예산',
    waitingFilter: '웨이팅 도움 가능',
    waitingBadge: '웨이팅 도움',
    resetFilters: '조건 초기화',
    noResultsTitle: '조건에 맞는 식당이 없습니다',
    noResultsBody: '검색어나 필터를 바꿔 다시 확인해 주세요.',
    resultUnit: '곳',
    viewDetail: '자세히 보기',
    save: '저장하기',
    loginToSave: '로그인 후 저장',
    remove: '저장 해제',
    savedTitle: '저장한 맛집',
    savedBody: '계정에 저장한 맛집을 확인할 수 있습니다.',
    emptyTitle: '아직 저장한 맛집이 없습니다',
    emptyBody: '관심 있는 장소를 저장하면 여기에 모입니다.',
    browse: '맛집 둘러보기',
    backToList: '목록으로 돌아가기',
    detailLabel: '큐레이션 메모',
    fitLabel: '이 일정에 잘 맞는 이유',
    factsLabel: '방문 전 확인할 정보',
    hoursLabel: '추천 시간대',
    accessLabel: '지역·이동',
    signatureLabel: '예상 메뉴',
    apply: '이 조건으로 1:1 큐레이션 신청하기',
    mockNotice: '공식 출처를 기준으로 게시합니다. 방문 전 영업시간과 가격 등 최신 정보를 다시 확인해 주세요.',
    notFoundTitle: '페이지를 찾을 수 없습니다',
    notFoundBody: '주소를 확인하거나 홈으로 돌아가 주세요.',
    backHome: '홈으로 돌아가기',
  },
  en: {
    language: 'Choose language',
    exploreNav: 'Explore Seoul dining',
    savedNav: 'Saved places',
    apiEyebrow: 'DEEP PLATE · VERIFIED DATA',
    loading: 'Loading restaurant information…',
    loadError: 'Could not load restaurant information.',
    retry: 'Try again',
    emptyCatalogTitle: 'No restaurants are published yet',
    emptyCatalogBody: 'Verified information will appear here when it is ready.',
    informationPending: 'To be confirmed',
    verified: 'Verified',
    pendingVerification: 'Verification pending',
    mapLink: 'View map',
    sourceLabel: 'Official source',
    lastVerifiedLabel: 'Last verified',
    saving: 'Saving…',
    exploreTitle: 'Find a Seoul meal at your own pace',
    exploreBody: 'Explore verified Seoul dining information matched to your itinerary and preferences.',
    all: 'All',
    searchLabel: 'Search places',
    searchPlaceholder: 'Search by area, food, or mood',
    budgetLabel: 'Budget',
    allBudgets: 'All budgets',
    waitingFilter: 'Waiting help available',
    waitingBadge: 'Waiting help',
    resetFilters: 'Reset filters',
    noResultsTitle: 'No restaurants match these filters',
    noResultsBody: 'Try another search term or filter.',
    resultUnit: 'places',
    viewDetail: 'View details',
    save: 'Save place',
    loginToSave: 'Log in to save',
    remove: 'Remove saved place',
    savedTitle: 'Saved places',
    savedBody: 'Review the restaurants saved to your account.',
    emptyTitle: 'No saved places yet',
    emptyBody: 'Places you save will collect here.',
    browse: 'Browse places',
    backToList: 'Back to places',
    detailLabel: 'Curation note',
    fitLabel: 'Why it fits this itinerary',
    factsLabel: 'What to confirm before visiting',
    hoursLabel: 'Suggested time',
    accessLabel: 'Area and access',
    signatureLabel: 'Sample menu',
    apply: 'Request 1:1 curation with these preferences',
    mockNotice: 'Information is based on official sources. Recheck current hours, prices, and other details before visiting.',
    notFoundTitle: 'Page not found',
    notFoundBody: 'Check the address or return to the home page.',
    backHome: 'Back home',
  },
} satisfies Record<Language, {
  language: string;
  exploreNav: string;
  savedNav: string;
  apiEyebrow: string;
  loading: string;
  loadError: string;
  retry: string;
  emptyCatalogTitle: string;
  emptyCatalogBody: string;
  informationPending: string;
  verified: string;
  pendingVerification: string;
  mapLink: string;
  sourceLabel: string;
  lastVerifiedLabel: string;
  saving: string;
  exploreTitle: string;
  exploreBody: string;
  all: string;
  searchLabel: string;
  searchPlaceholder: string;
  budgetLabel: string;
  allBudgets: string;
  waitingFilter: string;
  waitingBadge: string;
  resetFilters: string;
  noResultsTitle: string;
  noResultsBody: string;
  resultUnit: string;
  viewDetail: string;
  save: string;
  loginToSave: string;
  remove: string;
  savedTitle: string;
  savedBody: string;
  emptyTitle: string;
  emptyBody: string;
  browse: string;
  backToList: string;
  detailLabel: string;
  fitLabel: string;
  factsLabel: string;
  hoursLabel: string;
  accessLabel: string;
  signatureLabel: string;
  apply: string;
  mockNotice: string;
  notFoundTitle: string;
  notFoundBody: string;
  backHome: string;
}>;
