import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('Deep Plate 주요 사용자 흐름', () => {
  beforeEach(() => {
    window.localStorage.setItem('deepplate_user_lang', 'ja');
  });

  it('언어를 변경하면 화면과 브라우저 언어 설정을 함께 갱신한다', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '한국어' }));

    expect(document.documentElement).toHaveAttribute('lang', 'ko');
    expect(document.body).toHaveAttribute('data-lang', 'ko');
    expect(window.localStorage.getItem('deepplate_user_lang')).toBe('ko');
    expect(screen.getAllByRole('button', { name: '1:1 큐레이션 신청하기' })).not.toHaveLength(0);
  });

  it('신청 버튼으로 설문을 열고 Escape 키로 닫는다', async () => {
    const user = userEvent.setup();
    render(<App />);

    const applyButton = screen.getAllByRole('button', { name: 'キュレーションを申し込む' })[0];
    expect(applyButton).toBeDefined();
    await user.click(applyButton!);

    expect(screen.getByRole('dialog', { name: '1:1キュレーション申込書' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});
