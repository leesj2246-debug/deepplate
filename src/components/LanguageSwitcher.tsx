import { languageLabels, supportedLanguages } from '../data/content';
import type { Language } from '../data/content';

interface LanguageSwitcherProps {
  label: string;
  lang: Language;
  onLanguage: (language: Language) => void;
}

export default function LanguageSwitcher({ label, lang, onLanguage }: LanguageSwitcherProps) {
  return (
    <div className="lang-switcher-wrap" role="group" aria-label={label}>
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
  );
}
