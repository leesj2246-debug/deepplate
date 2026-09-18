import { Link } from 'react-router-dom';
import type { Language } from '../../data/content';
import type { Restaurant } from './place-api';
import { getBudgetText, getPlaceName, isVerifiedPlace, placeUi } from './places';

interface PlaceCardProps {
  canSave: boolean;
  isSaving: boolean;
  place: Restaurant;
  lang: Language;
  saved: boolean;
  onToggleSaved: (placeId: string) => void;
}

export default function PlaceCard({ canSave, isSaving, place, lang, saved, onToggleSaved }: PlaceCardProps) {
  const labels = placeUi[lang];
  const name = getPlaceName(place, lang);
  const budget = getBudgetText(place, lang) || labels.informationPending;
  const isVerified = isVerifiedPlace(place);
  const verification = isVerified ? labels.verified : labels.pendingVerification;

  return (
    <article className="mvp-place-card">
      <Link className="mvp-place-image-link" to={`/places/${place.slug}`} aria-label={`${name} · ${labels.viewDetail}`}>
        {place.imageUrl ? (
          <img className="mvp-place-image" src={place.imageUrl} alt={name} loading="lazy" />
        ) : (
          <span className="mvp-place-image-placeholder">DEEP PLATE</span>
        )}
      </Link>
      <div className="mvp-place-caption">
        <div>
          <span className="mvp-place-meta">{place.area} · {place.category}</span>
          <h2><Link to={`/places/${place.slug}`}>{name}</Link></h2>
          <p>{place.description || labels.informationPending}</p>
          <div className="mvp-place-facts" aria-label={labels.factsLabel}>
            <span>{budget}</span>
            <span className={isVerified ? 'is-accent' : ''}>{verification}</span>
          </div>
        </div>
        <button
          className={`mvp-save-button${saved ? ' is-saved' : ''}${canSave ? '' : ' is-locked'}`}
          type="button"
          aria-pressed={canSave && saved}
          disabled={isSaving}
          onClick={() => onToggleSaved(place.id)}
        >
          {isSaving ? labels.saving : (canSave ? (saved ? labels.remove : labels.save) : labels.loginToSave)}
        </button>
      </div>
    </article>
  );
}
