import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CurationFormModal from '../../components/CurationFormModal';
import { uiLabels } from '../../data/content';
import type { Language } from '../../data/content';
import { getBudgetText, getPlaceName, isVerifiedPlace, placeUi } from './places';
import { usePlace } from './usePlaces';
import { recordCurationApplicationSubmission } from '../payments/payment-entry';
import { trackEvent } from '../../analytics/analytics';

interface PlaceDetailPageProps {
  canSave: boolean;
  lang: Language;
  savingId: string | null;
  isSaved: (placeId: string) => boolean;
  onToggleSaved: (placeId: string) => void;
}

function formatVerifiedDate(value: string, lang: Language): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = lang === 'ja' ? 'ja-JP' : lang === 'en' ? 'en-US' : 'ko-KR';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export default function PlaceDetailPage({ canSave, lang, savingId, isSaved, onToggleSaved }: PlaceDetailPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const { placeId } = useParams();
  const { error, isLoading, place, retry } = usePlace(placeId);
  const labels = placeUi[lang];
  const viewedPlaceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!place || viewedPlaceRef.current === place.id) return;
    viewedPlaceRef.current = place.id;
    trackEvent('place_detail_viewed', {
      place_slug: place.slug,
      area: place.area,
      category: place.category,
      verification_status: place.verificationStatus,
    });
  }, [place]);

  if (isLoading) {
    return <main className="mvp-state-page"><p role="status">{labels.loading}</p></main>;
  }

  if (error) {
    return (
      <main className="mvp-state-page">
        <h1>{labels.loadError}</h1>
        <p role="alert">{error}</p>
        <button className="mvp-primary-action" type="button" onClick={retry}>{labels.retry}</button>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="mvp-state-page">
        <span className="mvp-eyebrow">404 · DEEP PLATE</span>
        <h1>{labels.notFoundTitle}</h1>
        <p>{labels.notFoundBody}</p>
        <Link className="mvp-primary-action" to="/places">{labels.backToList}</Link>
      </main>
    );
  }

  const saved = isSaved(place.id);
  const name = getPlaceName(place, lang);
  const budget = getBudgetText(place, lang) || labels.informationPending;
  const verification = isVerifiedPlace(place) ? labels.verified : labels.pendingVerification;
  const finishApplication = (submissionId: string) => {
    if (!recordCurationApplicationSubmission(submissionId)) return false;
    setFormOpen(false);
    navigate('/checkout');
    return true;
  };

  return (
    <>
      <main className="mvp-detail-page">
        <Link className="mvp-back-link" to="/places">← {labels.backToList}</Link>
        <div className="mvp-detail-grid">
          <div className="mvp-detail-image-wrap">
            {place.imageUrl ? (
              <img className="mvp-detail-image" src={place.imageUrl} alt={name} />
            ) : (
              <span className="mvp-place-image-placeholder">DEEP PLATE</span>
            )}
          </div>
          <article className="mvp-detail-copy">
            <span className="mvp-eyebrow">{place.area} · {place.category}</span>
            <h1>{name}</h1>
            <p className="mvp-detail-summary">{place.description || labels.informationPending}</p>

            <dl className="mvp-detail-facts" aria-label={labels.factsLabel}>
              <div><dt>{labels.budgetLabel}</dt><dd>{budget}</dd></div>
              <div><dt>{labels.accessLabel}</dt><dd>{place.area}</dd></div>
              <div><dt>{labels.detailLabel}</dt><dd>{verification}</dd></div>
              {place.mapUrl && <div><dt>{labels.mapLink}</dt><dd><a href={place.mapUrl} target="_blank" rel="noreferrer">{labels.mapLink} ↗</a></dd></div>}
              {place.sourceUrl && <div><dt>{labels.sourceLabel}</dt><dd><a href={place.sourceUrl} target="_blank" rel="noreferrer">{labels.sourceLabel} ↗</a></dd></div>}
              {place.lastVerifiedAt && <div><dt>{labels.lastVerifiedLabel}</dt><dd>{formatVerifiedDate(place.lastVerifiedAt, lang)}</dd></div>}
            </dl>

            <div className="mvp-detail-note">
              <span>{labels.detailLabel}</span>
              <p>{verification}</p>
            </div>
            <div className="mvp-detail-actions">
              <button
                className={`mvp-save-button${saved ? ' is-saved' : ''}${canSave ? '' : ' is-locked'}`}
                type="button"
                aria-pressed={canSave && saved}
                disabled={savingId === place.id}
                onClick={() => onToggleSaved(place.id)}
              >
                {savingId === place.id ? labels.saving : (canSave ? (saved ? labels.remove : labels.save) : labels.loginToSave)}
              </button>
              <button className="mvp-primary-action" type="button" onClick={() => {
                trackEvent('curation_cta_clicked', { cta_location: 'place_detail', place_slug: place.slug });
                setFormOpen(true);
              }}>
                {labels.apply}
              </button>
            </div>
            <small>{labels.mockNotice}</small>
          </article>
        </div>
      </main>
      <CurationFormModal labels={uiLabels[lang]} open={formOpen} source="place_detail" onClose={() => setFormOpen(false)} onSubmitted={finishApplication} />
    </>
  );
}
