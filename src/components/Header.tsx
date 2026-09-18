import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Language, LocalizedContent, UiLabels } from '../data/content';
import BrandMark from './BrandMark';
import LanguageSwitcher from './LanguageSwitcher';

const anchors = ['about', 'curations', 'how-it-works', 'faq'];

interface HeaderProps {
  content: LocalizedContent;
  labels: UiLabels;
  lang: Language;
  exploreLabel: string;
  onLanguage: (language: Language) => void;
  onApply: () => void;
}

export default function Header({ content, labels, lang, exploreLabel, onLanguage, onApply }: HeaderProps) {
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
              <Link className="nav-explore-link" to="/places" onClick={() => setMenuOpen(false)}>
                {exploreLabel}
              </Link>
            </li>
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
          <LanguageSwitcher lang={lang} label={labels.language} onLanguage={onLanguage} />
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
