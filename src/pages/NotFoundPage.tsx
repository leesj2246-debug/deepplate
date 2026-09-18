import { Link } from 'react-router-dom';
import type { Language } from '../data/content';
import { placeUi } from '../features/places/places';

interface NotFoundPageProps {
  lang: Language;
}

export default function NotFoundPage({ lang }: NotFoundPageProps) {
  const labels = placeUi[lang];

  return (
    <main className="mvp-state-page">
      <span className="mvp-eyebrow">404 · DEEP PLATE</span>
      <h1>{labels.notFoundTitle}</h1>
      <p>{labels.notFoundBody}</p>
      <Link className="mvp-primary-action" to="/">{labels.backHome}</Link>
    </main>
  );
}
