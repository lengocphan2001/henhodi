import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#393e4b',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2) var(--space-3)',
          color: '#fff',
          fontFamily: 'var(--font-primary)',
          fontWeight: 'var(--font-medium)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '140px',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#4a4f5c'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#393e4b'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '16px' }}>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </div>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          background: '#2a2d35',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginTop: 'var(--space-1)',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                background: 'transparent',
                border: 'none',
                color: i18n.language === language.code ? '#ff7a00' : '#fff',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '16px' }}>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 