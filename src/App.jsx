import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import CurationGrid from './components/sections/CurationGrid.jsx';
import FaqSection from './components/sections/FaqSection.jsx';
import HowItWorks from './components/sections/HowItWorks.jsx';
import ProblemSolution from './components/sections/ProblemSolution.jsx';
import { copy, uiLabels } from './data/content.jsx';
import useLanguage from './hooks/useLanguage.js';
import useScrollReveal from './hooks/useScrollReveal.js';

export default function App() {
  const [lang, setLang] = useLanguage();
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
      />
      <main id="main-content">
        <Hero content={content} labels={labels} />
        <ProblemSolution content={content} />
        <CurationGrid content={content} />
        <HowItWorks content={content} />
        <FaqSection content={content} />
      </main>
      <Footer />
    </div>
  );
}
