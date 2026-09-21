import type { AuthUser } from './authUi';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

interface AuthSession {
  user: AuthUser;
  token: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json().catch(() => null) as { message?: unknown } | T | null;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
      ? body.message
      : '서버 요청을 처리하지 못했습니다.';
    throw new Error(message);
  }
  return body as T;
}

export function register(name: string, email: string, password: string): Promise<AuthSession> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string): Promise<AuthSession> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string): Promise<AuthUser> {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
