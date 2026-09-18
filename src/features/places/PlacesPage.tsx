import { useState } from 'react';
import type { Language } from '../../data/content';
import PlaceCard from './PlaceCard';
import type { Restaurant } from './place-api';
import { getPlaceName, placeUi } from './places';

interface PlacesPageProps {
  canSave: boolean;
  error: string | null;
  isLoading: boolean;
  savingId: string | null;
  places: Restaurant[];
  lang: Language;
  isSaved: (placeId: string) => boolean;
  onRetry: () => void;
  onToggleSaved: (placeId: string) => void;
}

const budgets = [30_000, 50_000, 100_000];

export default function PlacesPage({ canSave, error, isLoading, savingId, places, lang, isSaved, onRetry, onToggleSaved }: PlacesPageProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const labels = placeUi[lang];
  const filters = Array.from(new Set(places.map((place) => place.category))).sort();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visiblePlaces = places.filter((place) => {
    const matchesCategory = activeFilter === 'all' || place.category === activeFilter;
    const referenceBudget = place.minBudget ?? place.maxBudget;
    const matchesBudget = activeBudget === null || (referenceBudget !== null && referenceBudget <= activeBudget);
    const searchableText = [
      getPlaceName(place, lang),
      place.area,
      place.category,
      place.description ?? '',
    ].join(' ').toLocaleLowerCase();

    return matchesCategory
      && matchesBudget
      && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  const resetFilters = () => {
    setActiveFilter('all');
    setActiveBudget(null);
    setQuery('');
  };

  return (
    <main className="mvp-page">
      <section className="mvp-page-intro">
        <span className="mvp-eyebrow">{labels.apiEyebrow}</span>
        <h1>{labels.exploreTitle}</h1>
        <p>{labels.exploreBody}</p>
      </section>

      <section className="mvp-catalog" aria-label={labels.exploreNav}>
        {isLoading ? (
          <div className="mvp-filter-empty"><p role="status">{labels.loading}</p></div>
        ) : error ? (
          <div className="mvp-filter-empty">
            <h2>{labels.loadError}</h2>
            <p role="alert">{error}</p>
            <button className="mvp-primary-action" type="button" onClick={onRetry}>{labels.retry}</button>
          </div>
        ) : places.length === 0 ? (
          <div className="mvp-filter-empty">
            <span className="mvp-empty-number">00</span>
            <h2>{labels.emptyCatalogTitle}</h2>
            <p>{labels.emptyCatalogBody}</p>
          </div>
        ) : (
          <>
        <div className="mvp-search-wrap">
          <label htmlFor="place-search">{labels.searchLabel}</label>
          <div className="mvp-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="place-search"
              type="search"
              value={query}
              placeholder={labels.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="mvp-filter-bar">
          <div className="mvp-filter-groups">
            <div className="mvp-filter-list" role="group" aria-label={labels.exploreNav}>
              {['all', ...filters].map((filter) => (
                <button
                  key={filter}
                  className={activeFilter === filter ? 'is-active' : ''}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' ? labels.all : filter}
                </button>
              ))}
            </div>
            <div className="mvp-filter-list mvp-secondary-filters" role="group" aria-label={labels.budgetLabel}>
              {budgets.map((budget) => (
                <button
                  key={budget}
                  className={activeBudget === budget ? 'is-active' : ''}
                  type="button"
                  aria-pressed={activeBudget === budget}
                  onClick={() => setActiveBudget(activeBudget === budget ? null : budget)}
                >
                  ≤ ₩{budget.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <span className="mvp-result-count">{visiblePlaces.length} {labels.resultUnit}</span>
        </div>

        {visiblePlaces.length > 0 ? (
          <div className="mvp-place-grid">
            {visiblePlaces.map((place) => (
              <PlaceCard
                canSave={canSave}
                isSaving={savingId === place.id}
                key={place.id}
                place={place}
                lang={lang}
                saved={isSaved(place.id)}
                onToggleSaved={onToggleSaved}
              />
            ))}
          </div>
        ) : (
          <div className="mvp-filter-empty">
            <span className="mvp-empty-number">00</span>
            <h2>{labels.noResultsTitle}</h2>
            <p>{labels.noResultsBody}</p>
            <button className="mvp-primary-action" type="button" onClick={resetFilters}>{labels.resetFilters}</button>
          </div>
        )}
          </>
        )}
      </section>
    </main>
  );
}
