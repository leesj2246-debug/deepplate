import { useEffect, useState } from 'react';
import { getSavedPlaces, removeSavedPlace, savePlace } from './place-api';
import type { Restaurant, SavedPlaceRecord } from './place-api';

export default function useSavedPlaces(token: string | null) {
  const [records, setRecords] = useState<SavedPlaceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedToken, setLoadedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    getSavedPlaces(token, controller.signal)
      .then((nextRecords) => {
        setRecords(nextRecords);
        setLoadedToken(token);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadedToken(token);
        setLoadError(error instanceof Error ? error.message : '저장 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey, token]);

  const isCurrentToken = Boolean(token && loadedToken === token);
  const currentRecords = isCurrentToken ? records : [];
  const savedIds = currentRecords.map((record) => record.restaurantId);

  const toggleSaved = async (placeId: string) => {
    if (!token || savingId) return;
    setSavingId(placeId);
    setActionError(null);
    try {
      if (savedIds.includes(placeId)) {
        await removeSavedPlace(token, placeId);
        setRecords((currentRecords) => currentRecords.filter((record) => record.restaurantId !== placeId));
      } else {
        const record = await savePlace(token, placeId);
        setRecords((currentRecords) => [record, ...currentRecords.filter((item) => item.restaurantId !== placeId)]);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '저장 상태를 변경하지 못했습니다.');
    } finally {
      setSavingId(null);
    }
  };

  return {
    actionError,
    isLoading: Boolean(token) && (!isCurrentToken || isLoading),
    loadError: isCurrentToken ? loadError : null,
    places: currentRecords.map((record): Restaurant => record.restaurant),
    retry: () => {
      setIsLoading(true);
      setLoadError(null);
      setReloadKey((key) => key + 1);
    },
    savedIds,
    savingId,
    isSaved: (placeId: string) => savedIds.includes(placeId),
    toggleSaved,
  };
}
