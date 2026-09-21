import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CurationFormModal from '../components/CurationFormModal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CurationGrid from '../components/sections/CurationGrid';
import FaqSection from '../components/sections/FaqSection';
import HowItWorks from '../components/sections/HowItWorks';
import ProblemSolution from '../components/sections/ProblemSolution';
import { copy, uiLabels } from '../data/content';
import type { Language } from '../data/content';
import { placeUi } from '../features/places/places';
import { recordCurationApplicationSubmission } from '../features/payments/payment-entry';
import useScrollReveal from '../hooks/useScrollReveal';

interface LandingPageProps {
  lang: Language;
  onLanguage: (language: Language) => void;
}

export default function LandingPage({ lang, onLanguage }: LandingPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useScrollReveal();

  const content = copy[lang];
  const labels = uiLabels[lang];
  const requestedForm = new URLSearchParams(location.search).get('apply') === '1';

  const closeForm = () => {
    setFormOpen(false);
    if (requestedForm) navigate('/', { replace: true });
  };

  const finishApplication = (submissionId: string) => {
    if (!recordCurationApplicationSubmission(submissionId)) return false;
    setFormOpen(false);
    navigate('/checkout', { replace: requestedForm });
    return true;
  };

  return (
    <div className="site-wrapper">
      <a className="skip-link" href="#main-content">{labels.skip}</a>
      <Header
        content={content}
        labels={labels}
        lang={lang}
        exploreLabel={placeUi[lang].exploreNav}
        onLanguage={onLanguage}
        onApply={() => setFormOpen(true)}
      />
      <main id="main-content">
        <Hero
          content={content}
          exploreLabel={placeUi[lang].exploreNav}
          labels={labels}
          onApply={() => setFormOpen(true)}
        />
        <ProblemSolution content={content} />
        <CurationGrid content={content} />
        <HowItWorks content={content} onApply={() => setFormOpen(true)} />
        <FaqSection content={content} />
      </main>
      <Footer exploreLabel={placeUi[lang].exploreNav} />
      <CurationFormModal
        labels={labels}
        open={formOpen || requestedForm}
        onClose={closeForm}
        onSubmitted={finishApplication}
      />
    </div>
  );
}
