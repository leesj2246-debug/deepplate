import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import { CurationGrid, FAQ, HowItWorks, ProblemSolution } from './components/Sections.jsx';
import Footer from './components/Footer.jsx';
import { copy, uiLabels } from './data/content.jsx';

function getInitialLanguage() {
  const saved = window.localStorage.getItem('deepplate_user_lang');
  if (saved && copy[saved]) return saved;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ko')) return 'ko';
  if (browserLanguage.startsWith('ja')) return 'ja';
  return 'en';
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const content = useMemo(() => copy[lang], [lang]);
  const labels = uiLabels[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: '0px 0px -20px 0px', threshold: 0.05 },
    );

    document.querySelectorAll('.fade-up').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const changeLanguage = (nextLanguage) => {
    setLang(nextLanguage);
    window.localStorage.setItem('deepplate_user_lang', nextLanguage);
  };

  return (
    <div className="site-wrapper">
      <a className="skip-link" href="#main-content">{labels.skip}</a>
      <Header
        content={content}
        labels={labels}
        lang={lang}
        menuOpen={menuOpen}
        onLanguage={changeLanguage}
        onMenu={setMenuOpen}
      />
      <main id="main-content">
        <Hero content={content} labels={labels} />
        <ProblemSolution content={content} />
        <CurationGrid content={content} />
        <HowItWorks content={content} />
        <FAQ content={content} openIndex={openFaq} onToggle={setOpenFaq} />
      </main>
      <Footer />
    </div>
  );
}
