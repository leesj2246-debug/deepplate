const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

export interface Restaurant {
  id: string;
  slug: string;
  nameKo: string;
  nameJa: string | null;
  nameEn: string | null;
  area: string;
  category: string;
  minBudget: number | null;
  maxBudget: number | null;
  description: string | null;
  imageUrl: string | null;
  mapUrl: string | null;
  verificationStatus: string;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
}

export interface SavedPlaceRecord {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null) as { message?: unknown } | T | null;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
      ? body.message
      : '식당 정보를 불러오지 못했습니다.';
    throw new Error(message);
  }
  return body as T;
}

export function getPlaces(signal?: AbortSignal): Promise<Restaurant[]> {
  return request('/places', { signal });
}

export function getPlace(slug: string, signal?: AbortSignal): Promise<Restaurant> {
  return request(`/places/${encodeURIComponent(slug)}`, { signal });
}

export function getSavedPlaces(token: string, signal?: AbortSignal): Promise<SavedPlaceRecord[]> {
  return request('/saved-places', {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function savePlace(token: string, restaurantId: string): Promise<SavedPlaceRecord> {
  return request(`/saved-places/${encodeURIComponent(restaurantId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function removeSavedPlace(token: string, restaurantId: string): Promise<void> {
  return request(`/saved-places/${encodeURIComponent(restaurantId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
