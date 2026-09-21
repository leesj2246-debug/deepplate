import { Link } from 'react-router-dom';
import type { Language } from '../../data/content';
import PlaceCard from './PlaceCard';
import type { Restaurant } from './place-api';
import { placeUi } from './places';

interface SavedPlacesPageProps {
  error: string | null;
  isLoading: boolean;
  lang: Language;
  places: Restaurant[];
  savingId: string | null;
  onRetry: () => void;
  onToggleSaved: (placeId: string) => void;
}

export default function SavedPlacesPage({ error, isLoading, lang, places, savingId, onRetry, onToggleSaved }: SavedPlacesPageProps) {
  const labels = placeUi[lang];

  return (
    <main className="mvp-page">
      <section className="mvp-page-intro mvp-page-intro-compact">
        <span className="mvp-eyebrow">DEEP PLATE · ACCOUNT</span>
        <h1>{labels.savedTitle}</h1>
        <p>{labels.savedBody}</p>
      </section>

      {isLoading ? (
        <section className="mvp-empty-state"><p role="status">{labels.loading}</p></section>
      ) : error ? (
        <section className="mvp-empty-state">
          <h2>{labels.loadError}</h2>
          <p role="alert">{error}</p>
          <button className="mvp-primary-action" type="button" onClick={onRetry}>{labels.retry}</button>
        </section>
      ) : places.length > 0 ? (
        <section className="mvp-place-grid mvp-saved-grid" aria-label={labels.savedTitle}>
          {places.map((place) => (
            <PlaceCard
              canSave
              isSaving={savingId === place.id}
              key={place.id}
              place={place}
              lang={lang}
              saved
              onToggleSaved={onToggleSaved}
            />
          ))}
        </section>
      ) : (
        <section className="mvp-empty-state">
          <span className="mvp-empty-number">00</span>
          <h2>{labels.emptyTitle}</h2>
          <p>{labels.emptyBody}</p>
          <Link className="mvp-primary-action" to="/places">{labels.browse}</Link>
        </section>
      )}
    </main>
  );
}
