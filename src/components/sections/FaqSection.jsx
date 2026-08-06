import { useState } from 'react';

export default function FaqSection({ content }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section" id="faq">
      <div className="content-container">
        <div className="faq-container-inner fade-up">
          <div className="faq-header-wrap"><span className="faq-tag-mini">FAQ & HELP</span><h2 className="faq-block-title">{content.faqTitle}</h2></div>
          <div className="faq-accordion-list">
            {content.faqs.map(([question, answer], index) => {
              const expanded = openIndex === index;
              const buttonId = `faq-button-${index}`;
              const answerId = `faq-answer-${index}`;

              return (
                <div className={`faq-item${expanded ? ' active' : ''}`} key={question}>
                  <button
                    className="faq-btn"
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(expanded ? -1 : index)}
                  >
                    <span className="faq-q-text"><span className="faq-q-num">0{index + 1}</span>{question}</span>
                    <span className="faq-icon-toggle" aria-hidden="true">⌄</span>
                  </button>
                  <div className="faq-answer-content" id={answerId} role="region" aria-labelledby={buttonId} hidden={!expanded}>
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
