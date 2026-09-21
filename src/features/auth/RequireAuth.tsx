import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
  reason?: 'save' | 'payment';
}

export default function RequireAuth({ children, isAuthenticated, isLoading, reason = 'save' }: RequireAuthProps) {
  const location = useLocation();

  if (isLoading) {
    return <main className="mvp-state-page"><p role="status">Deep Plate…</p></main>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: `${location.pathname}${location.search}${location.hash}`, reason }}
      />
    );
  }

  return children;
}
