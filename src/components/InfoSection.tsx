import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoSection: React.FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div style={{ 
      maxWidth: 'var(--container-xl)', 
      margin: '0 auto', 
      marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)', 
      padding: '0'
    }}>
      <div style={{ 
        background: '#181a20', 
        borderRadius: 'var(--radius-sm)', 
        padding: isMobile ? 'var(--space-4)' : 'var(--space-5)', 
        color: '#fff', 
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (window.innerWidth > 768) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (window.innerWidth > 768) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      >
        <div style={{ 
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--font-bold)', 
          fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
          marginBottom: isMobile ? 'var(--space-2)' : 'var(--space-3)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)'
        }}>
          {t('infoSection.title')}
        </div>
        <div style={{ 
          fontFamily: 'var(--font-primary)',
          fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
          color: '#d1d5db', 
          marginBottom: isMobile ? 'var(--space-2)' : 'var(--space-3)',
          lineHeight: 'var(--leading-relaxed)',
          letterSpacing: 'var(--tracking-normal)'
        }}>
          {t('infoSection.description')}
        </div>
        <div style={{ 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)', 
          color: '#ff7a00', 
          lineHeight: 'var(--leading-normal)',
          letterSpacing: 'var(--tracking-wide)',
          fontWeight: 'var(--font-medium)'
        }}>
          {t('infoSection.disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default InfoSection; 