import { useEffect, useState } from 'react';
import { formUrl } from '../data/content.jsx';
import ResponsiveImage from './ResponsiveImage.jsx';

const images = ['hero_architecture', 'hero_slide_2', 'hero_slide_3'];

function HeroHeadline({ item }) {
  if (item.second) {
    return (
      <>
        <span className="hero-line">{item.firstBefore}<span className="text-crimson-emphasis">{item.firstAccent}</span>{item.firstAfter}</span>
        <br />
        <span className="hero-line">{item.second}</span>
      </>
    );
  }

  return (
    <>
      <span className="hero-line">{item.first}</span>
      <br />
      <span className="hero-line">{item.before}<span className="text-crimson-emphasis">{item.accent}</span>{item.after}</span>
    </>
  );
}

export default function Hero({ content }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const move = (direction) => setCurrent((value) => (value + direction + images.length) % images.length);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="hero-banner"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label="Deep Plate highlights"
    >
      <div className="hero-slider" aria-live="off">
        {images.map((src, index) => (
          <div className={`hero-slide${index === current ? ' active' : ''}`} key={src} aria-hidden={index !== current}>
            <ResponsiveImage
              name={src}
              alt=""
              className="hero-bg-img"
              sizes="100vw"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      <div className="hero-content-inner">
        <div className="hero-main-info">
          <div className="hero-meta-year"><span>2026</span> / <span>CULINARY ARCHIVE</span></div>
          <h1 className="hero-title" aria-live="polite">
            <div className="hero-title-slide active"><HeroHeadline item={content.hero[current]} /></div>
          </h1>
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="hero-see-project">
            {content.apply}<span className="red-arrow" aria-hidden="true">→</span>
          </a>
          <div className="hero-controls-wrap">
            <button className="slide-nav-btn" type="button" onClick={() => move(-1)} aria-label="Previous slide">←</button>
            <div className="hero-slide-num" aria-label={`Slide ${current + 1} of ${images.length}`}>
              <span>{String(current + 1).padStart(2, '0')}</span><span>/ 03</span>
            </div>
            <button className="slide-nav-btn" type="button" onClick={() => move(1)} aria-label="Next slide">→</button>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-down-indicator" aria-label="Scroll to introduction">
        <span>SCROLL DOWN</span><span className="scroll-chevron" aria-hidden="true">⌄</span>
      </a>
    </section>
  );
}
