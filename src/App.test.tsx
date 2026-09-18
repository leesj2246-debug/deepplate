import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const restaurant = {
  id: 'place-1',
  slug: 'euljiro-test',
  nameKo: '을지로 테스트 식당',
  nameJa: 'ウルチロテスト食堂',
  nameEn: 'Euljiro Test Restaurant',
  area: '을지로',
  category: '한식',
  minBudget: 20_000,
  maxBudget: 30_000,
  description: 'API 연결을 검증하는 테스트 데이터입니다.',
  imageUrl: null,
  mapUrl: null,
  verificationStatus: 'OFFICIAL_SOURCE',
  sourceUrl: 'https://example.com/official-source',
  lastVerifiedAt: '2026-09-01T00:00:00.000Z',
};

const account = {
  id: 'user-1',
  name: 'Yuki',
  email: 'yuki@example.com',
  createdAt: '2026-09-01T00:00:00.000Z',
};

let isSaved = false;
let failNextSave = false;
let placesGate: Promise<Response> | null = null;
let meGate: Promise<Response> | null = null;

function jsonResponse(body: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}

describe('Deep Plate 주요 사용자 흐름', () => {
  beforeEach(() => {
    window.localStorage.setItem('deepplate_user_lang', 'ja');
    window.localStorage.removeItem('deepplate_saved_places_v1');
    window.localStorage.removeItem('deepplate_demo_user_v1');
    window.localStorage.removeItem('deepplate_access_token_v1');
    window.sessionStorage.clear();
    isSaved = false;
    failNextSave = false;
    placesGate = null;
    meGate = null;

    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = requestUrl(input);
      const method = init?.method ?? 'GET';

      if (url.endsWith('/auth/me')) return meGate ?? jsonResponse(account);
      if (url.endsWith('/auth/login') || url.endsWith('/auth/register')) {
        return jsonResponse({ user: account, token: 'test-token' });
      }
      if (url.endsWith(`/places/${restaurant.slug}`)) return jsonResponse(restaurant);
      if (url.endsWith('/places')) return placesGate ?? jsonResponse([restaurant]);
      if (url.endsWith('/saved-places') && method === 'GET') {
        return jsonResponse(isSaved ? [{ id: 'saved-1', restaurantId: restaurant.id, restaurant }] : []);
      }
      if (url.endsWith(`/saved-places/${restaurant.id}`) && method === 'POST') {
        if (failNextSave) {
          failNextSave = false;
          return jsonResponse({ message: '저장 서버 오류' }, 500);
        }
        isSaved = true;
        return jsonResponse({ id: 'saved-1', restaurantId: restaurant.id, restaurant }, 201);
      }
      if (url.endsWith(`/saved-places/${restaurant.id}`) && method === 'DELETE') {
        isSaved = false;
        return jsonResponse(null, 204);
      }
      return jsonResponse({ message: '테스트에서 처리하지 않은 요청입니다.' }, 500);
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it('언어를 변경하면 화면과 브라우저 언어 설정을 함께 갱신한다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '한국어' }));

    expect(document.documentElement).toHaveAttribute('lang', 'ko');
    expect(document.body).toHaveAttribute('data-lang', 'ko');
    expect(window.localStorage.getItem('deepplate_user_lang')).toBe('ko');
    expect(screen.getAllByRole('button', { name: '1:1 큐레이션 신청하기' })).not.toHaveLength(0);
  });

  it('신청 버튼으로 설문을 열고 Escape 키로 닫는다', async () => {
    const user = userEvent.setup();
    renderApp();

    const applyButton = screen.getAllByRole('button', { name: 'キュレーションを申し込む' })[0];
    expect(applyButton).toBeDefined();
    await user.click(applyButton!);

    expect(screen.getByRole('dialog', { name: '1:1キュレーション申込書' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('status')).toHaveTextContent('申込書を読み込んでいます');

    const firstIframe = screen.getByTitle('1:1キュレーション申込書');
    await user.click(screen.getByRole('button', { name: '再読み込み' }));
    const reloadedIframe = screen.getByTitle('1:1キュレーション申込書');
    expect(reloadedIframe).not.toBe(firstIframe);
    fireEvent.load(reloadedIframe);
    expect(screen.getByRole('status')).toHaveTextContent('申込書を読み込んでいます');
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://tally.so',
        source: (reloadedIframe as HTMLIFrameElement).contentWindow,
        data: JSON.stringify({ event: 'Tally.FormLoaded', payload: { formId: 'ZjAlQe' } }),
      }));
    });
    expect(screen.queryByText('申込書を読み込んでいます…')).not.toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('Tally 신청 완료 이벤트를 확인한 뒤 결제 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_user_lang', 'ko');
    renderApp();

    await user.click(screen.getAllByRole('button', { name: '1:1 큐레이션 신청하기' })[0]!);
    const iframe = screen.getByTitle('1:1 큐레이션 신청서') as HTMLIFrameElement;

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://tally.so',
        source: iframe.contentWindow,
        data: JSON.stringify({
          event: 'Tally.FormSubmitted',
          payload: { formId: 'ZjAlQe', id: 'submission-test-1' },
        }),
      }));
    });

    expect(await screen.findByText('DEEP PLATE · CHECKOUT')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /신청이 끝났어요\.\s+이제 결제를 확인해 주세요\./ })).toBeInTheDocument();
    expect(window.sessionStorage.getItem('deepplate_curation_application_v1')).toContain('submission-test-1');
  });

  it('브라우저 저장이 막히면 제출 ID를 메모리에 보존하고 결제 진입을 다시 시도한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_user_lang', 'ko');
    renderApp();

    await user.click(screen.getAllByRole('button', { name: '1:1 큐레이션 신청하기' })[0]!);
    const iframe = screen.getByTitle('1:1 큐레이션 신청서') as HTMLIFrameElement;
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('blocked'); });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        origin: 'https://tally.so',
        source: iframe.contentWindow,
        data: JSON.stringify({
          event: 'Tally.FormSubmitted',
          payload: { formId: 'ZjAlQe', id: 'submission-storage-retry' },
        }),
      }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent('이 브라우저에 결제 정보를 저장하지 못했어요');
    storage.mockRestore();
    await user.click(screen.getByRole('button', { name: '결제 화면 다시 열기' }));
    expect(await screen.findByText('DEEP PLATE · CHECKOUT')).toBeInTheDocument();
    expect(window.sessionStorage.getItem('deepplate_curation_application_v1')).toContain('submission-storage-retry');
  });

  it('목록을 API에서 불러와 상세로 이동하고 계정에 저장한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_access_token_v1', 'existing-token');
    renderApp(['/places']);

    await user.click(await screen.findByRole('link', { name: 'ウルチロテスト食堂 · 詳しく見る' }));
    expect(await screen.findByRole('heading', { name: 'ウルチロテスト食堂' })).toBeInTheDocument();
    expect(screen.getAllByText('検証済み')).not.toHaveLength(0);
    expect(screen.getByRole('link', { name: '公式情報 ↗' })).toHaveAttribute('href', restaurant.sourceUrl);

    await user.click(screen.getByRole('button', { name: '保存する' }));

    expect(await screen.findByRole('button', { name: '保存を解除' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem('deepplate_saved_places_v1')).toBeNull();
  });

  it('로그인 전 저장을 누르면 로그인 뒤 원래 화면으로 돌아온다', async () => {
    const user = userEvent.setup();
    renderApp([`/places/${restaurant.slug}`]);

    await user.click(await screen.findByRole('button', { name: 'ログインして保存' }));

    expect(screen.getByRole('heading', { name: '保存した好みを、次の画面でも続ける' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('保存機能はログイン後に利用できます。');
    await user.type(screen.getByRole('textbox', { name: 'メールアドレス' }), 'yuki@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'sample123');
    const loginButtons = screen.getAllByRole('button', { name: 'ログイン' });
    await user.click(loginButtons[loginButtons.length - 1]!);

    expect(await screen.findByRole('heading', { name: 'ウルチロテスト食堂' })).toBeInTheDocument();
    expect(window.localStorage.getItem('deepplate_access_token_v1')).toBe('test-token');
    expect(window.localStorage.getItem('deepplate_access_token_v1')).not.toContain('sample123');
  });

  it('로그인 전 저장 목록에 직접 접근하면 로그인 화면을 보여준다', () => {
    renderApp(['/saved']);

    expect(screen.getByRole('heading', { name: '保存した好みを、次の画面でも続ける' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('保存機能はログイン後に利用できます。');
  });

  it('로그인과 회원가입을 제공하고 토큰만 저장한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_user_lang', 'ko');
    renderApp(['/login']);

    await user.click(screen.getByRole('button', { name: '회원가입' }));
    await user.type(screen.getByRole('textbox', { name: '이름' }), '성진');
    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'hello@deepplate.test');
    await user.type(screen.getByLabelText('비밀번호'), 'sample123');
    await user.click(screen.getByRole('button', { name: '계정 만들기' }));

    expect(await screen.findByRole('heading', { name: '내 속도에 맞춰, 서울의 한 끼를 찾다' })).toBeInTheDocument();
    expect(window.localStorage.getItem('deepplate_access_token_v1')).toBe('test-token');
    expect(window.localStorage.getItem('deepplate_demo_user_v1')).toBeNull();

    await user.click(screen.getByRole('button', { name: '로그아웃' }));
    expect(window.localStorage.getItem('deepplate_access_token_v1')).toBeNull();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('저장 처리 오류를 화면에 표시한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_access_token_v1', 'existing-token');
    failNextSave = true;
    renderApp(['/places']);

    await user.click(await screen.findByRole('button', { name: '保存する' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('저장 서버 오류');
    expect(screen.getByRole('button', { name: '保存する' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('인증 초기 확인이 끝날 때까지 저장 화면 이동을 기다린다', async () => {
    let resolveMe!: (response: Response) => void;
    meGate = new Promise<Response>((resolve) => { resolveMe = resolve; });
    window.localStorage.setItem('deepplate_access_token_v1', 'existing-token');
    renderApp(['/saved']);

    expect(screen.getByRole('status')).toHaveTextContent('Deep Plate…');

    await act(async () => resolveMe(jsonResponse(account)));
    expect(await screen.findByRole('heading', { name: '保存した場所' })).toBeInTheDocument();
  });

  it('식당 목록을 불러오는 동안 로딩 상태를 표시하고 빈 응답을 처리한다', async () => {
    let resolvePlaces!: (response: Response) => void;
    placesGate = new Promise<Response>((resolve) => { resolvePlaces = resolve; });
    renderApp(['/places']);

    expect(screen.getByRole('status')).toHaveTextContent('レストラン情報を読み込んでいます');

    await act(async () => resolvePlaces(jsonResponse([])));
    expect(await screen.findByRole('heading', { name: '現在公開中のレストランはありません' })).toBeInTheDocument();
  });

  it('검색어에 맞는 API 식당만 보여준다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('deepplate_user_lang', 'ko');
    renderApp(['/places']);

    await user.type(await screen.findByRole('searchbox', { name: '맛집 검색' }), '없는 지역');
    expect(screen.getByRole('heading', { name: '조건에 맞는 식당이 없습니다' })).toBeInTheDocument();

    await user.clear(screen.getByRole('searchbox', { name: '맛집 검색' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '을지로 테스트 식당' })).toBeInTheDocument());
  });
});
