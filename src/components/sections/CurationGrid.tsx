import type { LocalizedContent } from '../../data/content';
import ResponsiveImage from '../ResponsiveImage';

interface CurationCardData {
  image: string;
  category: string;
  alt: string;
}

interface CurationCardProps {
  card: CurationCardData;
  index: number;
  title: string;
}

interface CurationGridProps {
  content: LocalizedContent;
}

const cards = [
  { image: 'dining_space', category: 'CURATED SPACES', alt: 'Curated local dining space' },
  { image: 'hidden_alley', category: 'COMING SOON — SEOUL STORY', alt: 'A hidden alley in Seoul' },
  { image: 'tea_eatery', category: 'DIRECT VERIFICATION', alt: 'A local tea eatery verified in person' },
  { image: 'korean_local_eatery', category: '1:1 CURATION', alt: 'A Korean local eatery' },
] as const satisfies readonly CurationCardData[];

function CurationCard({ card, index, title }: CurationCardProps) {
  return (
    <article className={`asymmetric-card card-${index + 1} fade-up delay-${index % 2 + 1}`}>
      <div className="card-img-wrap">
        <ResponsiveImage
          name={card.image}
          alt={card.alt}
          className="card-img"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="card-caption-block">
        <span className="card-category">{card.category}</span>
        <h3 className="card-title">{title}</h3>
      </div>
    </article>
  );
}

export default function CurationGrid({ content }: CurationGridProps) {
  return (
    <div className="content-container">
      <section className="main-grid-container" id="curations" aria-labelledby="curations-heading">
        <div className="left-column">
          <div className="left-intro-block fade-up">
            <span className="tag-since">Since 2026</span>
            <h2 className="left-main-heading" id="curations-heading">{content.curationTitle}</h2>
          </div>
          <CurationCard card={cards[0]} index={0} title={content.cardTitles[0]} />
          <CurationCard card={cards[1]} index={1} title={content.cardTitles[1]} />
        </div>
        <div className="right-column">
          <CurationCard card={cards[2]} index={2} title={content.cardTitles[2]} />
          <CurationCard card={cards[3]} index={3} title={content.cardTitles[3]} />
        </div>
      </section>
    </div>
  );
}
