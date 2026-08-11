import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { copy } from '../data/content';
import type { Language } from '../data/content';

const LANGUAGE_STORAGE_KEY = 'deepplate_user_lang';

function isLanguage(value: string): value is Language {
  return Object.hasOwn(copy, value);
}

function getInitialLanguage(): Language {
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && isLanguage(savedLanguage)) return savedLanguage;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ko')) return 'ko';
  if (browserLanguage.startsWith('ja')) return 'ja';
  return 'en';
}

export default function useLanguage(): readonly [Language, Dispatch<SetStateAction<Language>>] {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.dataset.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  return [language, setLanguage] as const;
}
