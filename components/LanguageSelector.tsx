import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  const languages = [
    { code: Language.DE, label: '🇩🇪 Deutsch' },
    { code: Language.EN, label: '🇬🇧 English' },
    { code: Language.TR, label: '🇹🇷 Türkçe' },
  ];

  return (
    <div className="flex space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            current === lang.code
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;