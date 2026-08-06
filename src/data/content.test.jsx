import { describe, expect, it } from 'vitest';
import { copy, languageLabels, uiLabels } from './content.jsx';

const languages = Object.keys(languageLabels);

describe('다국어 콘텐츠 계약', () => {
  it('지원 언어가 동일한 콘텐츠와 UI 키를 제공한다', () => {
    const contentKeys = Object.keys(copy[languages[0]]).sort();
    const labelKeys = Object.keys(uiLabels[languages[0]]).sort();

    languages.forEach((language) => {
      expect(Object.keys(copy[language]).sort()).toEqual(contentKeys);
      expect(Object.keys(uiLabels[language]).sort()).toEqual(labelKeys);
    });
  });

  it('주요 반복 콘텐츠의 개수가 모든 언어에서 일치한다', () => {
    languages.forEach((language) => {
      expect(copy[language].nav).toHaveLength(4);
      expect(copy[language].hero).toHaveLength(3);
      expect(copy[language].cardTitles).toHaveLength(4);
      expect(copy[language].steps).toHaveLength(3);
      expect(copy[language].faqs).toHaveLength(4);
    });
  });
});
