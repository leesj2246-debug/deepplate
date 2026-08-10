import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CurationFormModal from './components/CurationFormModal';
import CurationGrid from './components/sections/CurationGrid';
import FaqSection from './components/sections/FaqSection';
import HowItWorks from './components/sections/HowItWorks';
import ProblemSolution from './components/sections/ProblemSolution';
import { copy, uiLabels } from './data/content';
import useLanguage from './hooks/useLanguage';
import useScrollReveal from './hooks/useScrollReveal';

export default function App() {
  const [lang, setLang] = useLanguage();
  const [formOpen, setFormOpen] = useState(false);
  useScrollReveal();

  const content = copy[lang];
  const labels = uiLabels[lang];

  return (
    <div className="site-wrapper">
      <a className="skip-link" href="#main-content">{labels.skip}</a>
      <Header
        content={content}
        labels={labels}
        lang={lang}
        onLanguage={setLang}
        onApply={() => setFormOpen(true)}
      />
      <main id="main-content">
        <Hero content={content} labels={labels} onApply={() => setFormOpen(true)} />
        <ProblemSolution content={content} />
        <CurationGrid content={content} />
        <HowItWorks content={content} onApply={() => setFormOpen(true)} />
        <FaqSection content={content} />
      </main>
      <Footer />
      <CurationFormModal
        labels={labels}
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
