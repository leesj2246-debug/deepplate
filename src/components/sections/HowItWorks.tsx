import type { LocalizedContent } from '../../data/content';

interface HowItWorksProps {
  content: LocalizedContent;
  onApply: () => void;
}

export default function HowItWorks({ content, onApply }: HowItWorksProps) {
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
          <button type="button" className="cta-button-wide fade-up delay-4" onClick={onApply}>
            {content.applyWide}<span className="red-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
