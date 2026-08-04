import diningSpace from '../../assets/images/dining_space.png';
import hiddenAlley from '../../assets/images/hidden_alley.png';
import teaEatery from '../../assets/images/tea_eatery.png';
import koreanLocalEatery from '../../assets/images/korean_local_eatery.png';
import { formUrl } from '../data/content.jsx';

const cards = [
  { image: diningSpace, category: 'CURATED SPACES', alt: 'Curated local dining space' },
  { image: hiddenAlley, category: 'COMING SOON — SEOUL STORY', alt: 'A hidden alley in Seoul' },
  { image: teaEatery, category: 'DIRECT VERIFICATION', alt: 'A local tea eatery verified in person' },
  { image: koreanLocalEatery, category: '1:1 CURATION', alt: 'A Korean local eatery' },
];

export function ProblemSolution({ content }) {
  return (
    <section className="problem-solution-section" id="about">
      <div className="content-container">
        <div className="problem-solution-card fade-up">
          <div className="problem-tag-wrap"><span className="problem-tag-line" /><span className="problem-tag">PROBLEM & SOLUTION</span><span className="problem-tag-line" /></div>
          <h2 className="problem-subtitle">{content.problemTitle}</h2>
          <p className="problem-body">{content.problemBody}</p>
          <div className="problem-highlight-inline">
            <span className="highlight-badge-mini">DEEP PLATE SOLUTION</span>
            <div className="highlight-text">{content.solution}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CurationGrid({ content }) {
  const renderCard = (index) => (
    <article className={`asymmetric-card card-${index + 1} fade-up delay-${index % 2 + 1}`} key={cards[index].category}>
      <div className="card-img-wrap">
        <img src={cards[index].image} alt={cards[index].alt} className="card-img" loading="lazy" decoding="async" />
      </div>
      <div className="card-caption-block">
        <span className="card-category">{cards[index].category}</span>
        <h3 className="card-title">{content.cardTitles[index]}</h3>
      </div>
    </article>
  );

  return (
    <div className="content-container">
      <section className="main-grid-container" id="curations" aria-labelledby="curations-heading">
        <div className="left-column">
          <div className="left-intro-block fade-up">
            <span className="tag-since">Since 2026</span>
            <h2 className="left-main-heading" id="curations-heading">{content.curationTitle}</h2>
          </div>
          {renderCard(0)}
          {renderCard(1)}
        </div>
        <div className="right-column">{renderCard(2)}{renderCard(3)}</div>
      </section>
    </div>
  );
}

export function HowItWorks({ content }) {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="content-container">
        <div className="how-it-works-card fade-up">
          <div className="how-header-wrap">
            <h2 className="how-block-title">{content.howTitle}</h2>
            <p className="how-block-subtitle">{content.howSubtitle}</p>
          </div>
          <div className="step-horizontal-grid">
            {content.steps.map(([title, description], index) => (
              <div className={`step-item-wide fade-up delay-${index + 1}`} data-step-num={`0${index + 1}`} key={title}>
                <span className="step-badge">STEP 0{index + 1}</span>
                <div className="step-info-title">{title}</div>
                <div className="step-info-desc">{description}</div>
              </div>
            ))}
          </div>
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="cta-button-wide fade-up delay-4">
            {content.applyWide}<span className="red-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function FAQ({ content, openIndex, onToggle }) {
  return (
    <section className="faq-section" id="faq">
      <div className="content-container">
        <div className="faq-container-inner fade-up">
          <div className="faq-header-wrap"><span className="faq-tag-mini">FAQ & HELP</span><h2 className="faq-block-title">{content.faqTitle}</h2></div>
          <div className="faq-accordion-list">
            {content.faqs.map(([question, answer], index) => {
              const expanded = openIndex === index;
              return (
                <div className={`faq-item${expanded ? ' active' : ''}`} key={question}>
                  <button
                    className="faq-btn"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => onToggle(expanded ? -1 : index)}
                  >
                    <span className="faq-q-text"><span className="faq-q-num">0{index + 1}</span>{question}</span>
                    <span className="faq-icon-toggle" aria-hidden="true">⌄</span>
                  </button>
                  <div className="faq-answer-content" id={`faq-answer-${index}`} role="region" hidden={!expanded}>
                    <div className="faq-answer-text">{answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
