import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { Language } from '../data/content';
import { syncAnalyticsIdentity, trackEvent } from './analytics';

interface RouteAnalyticsProps {
  language: Language;
  userId: string | null;
}

export default function RouteAnalytics({ language, userId }: RouteAnalyticsProps) {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    syncAnalyticsIdentity(userId, language);
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    trackEvent('page_viewed');
  }, [language, location.pathname, userId]);

  return null;
}
