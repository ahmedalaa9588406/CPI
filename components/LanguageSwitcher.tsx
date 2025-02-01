'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  // Add more languages as needed
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (langCode: string) => {
    // Store the selected language in localStorage
    localStorage.setItem('preferred-locale', langCode);
    // Refresh the page with the new language
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
      >
        <span>🌐</span>
        <span>Language</span>
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    switchLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
