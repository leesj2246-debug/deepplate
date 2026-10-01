import { Link, NavLink, Outlet } from 'react-router-dom';
import BrandMark from '../../components/BrandMark';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import type { Language } from '../../data/content';
import { trackEvent } from '../../analytics/analytics';
import { placeUi } from './places';
import './places.css';

interface ExploreLayoutProps {
  lang: Language;
  loginLabel: string;
  applyLabel: string;
  ordersLabel: string;
  onLanguage: (language: Language) => void;
  onLogout: () => void;
  logoutLabel: string;
  saveError: string | null;
  savedCount: number;
  signedInLabel: string;
  userName: string | null;
}

export default function ExploreLayout({
  lang,
  loginLabel,
  applyLabel,
  ordersLabel,
  onLanguage,
  onLogout,
  logoutLabel,
  saveError,
  savedCount,
  signedInLabel,
  userName,
}: ExploreLayoutProps) {
  const labels = placeUi[lang];

  return (
    <div className="mvp-shell">
      <header className="mvp-header">
        <Link className="mvp-brand" to="/" aria-label={labels.backHome}>
          <BrandMark />
          <span>DEEP PLATE</span>
        </Link>
        <nav className="mvp-nav" aria-label={labels.exploreNav}>
          <NavLink to="/places">{labels.exploreNav}</NavLink>
          <NavLink to="/saved">{labels.savedNav}<span className="mvp-saved-count">{savedCount}</span></NavLink>
          <Link to="/?apply=1" onClick={() => trackEvent('curation_cta_clicked', { cta_location: 'explore_header' })}>{applyLabel}</Link>
          <NavLink to="/orders">{ordersLabel}</NavLink>
        </nav>
        <div className="mvp-header-actions">
          {userName ? (
            <div className="mvp-account-summary">
              <span><small>{signedInLabel}</small>{userName}</span>
              <button type="button" onClick={onLogout}>{logoutLabel}</button>
            </div>
          ) : (
            <NavLink className="mvp-login-link" to="/login">{loginLabel}</NavLink>
          )}
          <LanguageSwitcher lang={lang} label={labels.language} onLanguage={onLanguage} />
        </div>
      </header>
      {saveError && <p className="mvp-api-alert" role="alert">{saveError}</p>}
      <Outlet />
    </div>
  );
}
