import { useCallback, useEffect, useState } from 'react';
import { getPlace, getPlaces } from './place-api';
import type { Restaurant } from './place-api';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '식당 정보를 불러오지 못했습니다.';
}

export function usePlaces() {
  const [places, setPlaces] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getPlaces(controller.signal)
      .then(setPlaces)
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(errorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };
  return { error, isLoading, places, retry };
}

export function usePlace(slug: string | undefined) {
  const [place, setPlace] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    getPlace(slug, controller.signal)
      .then((nextPlace) => {
        setPlace(nextPlace);
        setLoadedSlug(slug);
      })
      .catch((requestError) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setLoadedSlug(slug);
        setError(errorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey, slug]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);
  const isCurrentSlug = loadedSlug === slug;
  return {
    error: isCurrentSlug ? error : null,
    isLoading: Boolean(slug) && (!isCurrentSlug || isLoading),
    place: isCurrentSlug ? place : null,
    retry,
  };
}
