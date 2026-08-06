import { useEffect, useState } from 'react';
import { copy } from '../data/content.jsx';

const LANGUAGE_STORAGE_KEY = 'deepplate_user_lang';

function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && Object.hasOwn(copy, savedLanguage)) return savedLanguage;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ko')) return 'ko';
  if (browserLanguage.startsWith('ja')) return 'ja';
  return 'en';
}

export default function useLanguage() {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.dataset.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  return [language, setLanguage];
}
