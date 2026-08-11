import { useState } from 'react';
import { languageLabels, supportedLanguages } from '../data/content';
import type { Language, LocalizedContent, UiLabels } from '../data/content';

const anchors = ['about', 'curations', 'how-it-works', 'faq'];

interface HeaderProps {
  content: LocalizedContent;
  labels: UiLabels;
  lang: Language;
  onLanguage: (language: Language) => void;
  onApply: () => void;
}

function BrandMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect width="44" height="44" rx="10.5" fill="#B81D24" />
      <path d="M 14.8 30.5 A 10.8 10.8 0 1 1 29.2 30.5" stroke="#FFFFFF" strokeWidth="3.8" strokeLinecap="round" />
      <circle cx="22" cy="22" r="6.6" fill="#FFFFFF" />
      <circle cx="22" cy="22" r="2.3" fill="#B81D24" />
    </svg>
  );
}

export default function Header({ content, labels, lang, onLanguage, onApply }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-bar-outer">
      <nav className="nav-bar" aria-label={labels.primaryNav}>
        <div className="nav-left-group">
          <a href="#top" className="brand-logo-lockup" aria-label={labels.home}>
            <div className="logo-icon-wrap"><BrandMark /></div>
            <span className="logo-main-text">DEEP PLATE</span>
          </a>

          <ul className={`nav-menu${menuOpen ? ' active' : ''}`} id="nav-menu">
            {content.nav.map((label, index) => (
              <li key={anchors[index]}>
                <a href={`#${anchors[index]}`} onClick={() => setMenuOpen(false)}>{label}</a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="nav-apply-button"
                onClick={() => {
                  setMenuOpen(false);
                  onApply();
                }}
              >
                {content.apply}
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-right-group">
          <div className="lang-switcher-wrap" role="group" aria-label={labels.language}>
            {supportedLanguages.map((code) => (
              <button
                key={code}
                className={`lang-btn${lang === code ? ' active' : ''}`}
                type="button"
                aria-pressed={lang === code}
                aria-label={languageLabels[code]}
                onClick={() => onLanguage(code)}
              >
                {code === 'ko' ? 'KO' : code.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="mobile-menu-btn"
            type="button"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            aria-controls="nav-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}
