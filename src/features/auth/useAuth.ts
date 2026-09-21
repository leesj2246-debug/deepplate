import { useEffect, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from './auth-api';
import type { AuthUser } from './authUi';

const ACCESS_TOKEN_STORAGE_KEY = 'deepplate_access_token_v1';

function getInitialToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export default function useAuth() {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(Boolean(token));

  useEffect(() => {
    if (!token || user) return;

    let isCancelled = false;
    getMe(token)
      .then((nextUser) => {
        if (!isCancelled) setUser(nextUser);
      })
      .catch(() => {
        if (isCancelled) return;
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (!isCancelled) setIsInitializing(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [token, user]);

  const acceptSession = (nextToken: string, nextUser: AuthUser) => {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setIsInitializing(false);
  };

  const login = async (email: string, password: string) => {
    const session = await loginRequest(email, password);
    acceptSession(session.token, session.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const session = await registerRequest(name, email, password);
    acceptSession(session.token, session.user);
  };

  const logout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setIsInitializing(false);
  };

  return { isInitializing, login, logout, register, token, user };
}
