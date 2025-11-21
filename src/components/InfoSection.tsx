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

  // Handle Zalo click for contact numbers
  const handleZaloClick = (phoneNumber: string) => {
    if (phoneNumber) {
      // Extract only digits from the phone number
      const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
      
      if (cleanNumber) {
        // Open Zalo with format: https://zalo.me/phonenumber
        const zaloUrl = `https://zalo.me/${cleanNumber}`;
        window.open(zaloUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };
  
  return (
    <div style={{ 
      maxWidth: 'var(--container-xl)', 
      margin: '0 auto', 
      marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)', 
      padding: '0'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: isMobile ? 'var(--space-3)' : 'var(--space-4)',
        alignItems: 'stretch'
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
            {t('infoSection.contactTitle')}
          </div>
          <div style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
            color: '#d1d5db', 
            marginBottom: isMobile ? 'var(--space-2)' : 'var(--space-3)',
            lineHeight: 'var(--leading-relaxed)',
            letterSpacing: 'var(--tracking-normal)'
          }}>
            {t('infoSection.contactDescription')}
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-2)'
          }}>
            <div 
              onClick={() => handleZaloClick(t('infoSection.phoneNumber'))}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                background: 'rgba(255, 122, 0, 0.1)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              
                <img 
                  src="/assets/zalo.png" 
                  alt="Zalo" 
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    objectFit: 'contain'
                  }} 
                />
              
              <span style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)', 
                fontWeight: 'var(--font-semibold)',
                color: '#ff7a00'
              }}>
                {t('infoSection.phoneNumber')}
              </span>
            </div>
            <div 
              onClick={() => handleZaloClick(t('infoSection.phoneNumber2'))}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                background: 'rgba(255, 122, 0, 0.1)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              
                <img 
                  src="/assets/zalo.png" 
                  alt="Zalo" 
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    objectFit: 'contain'
                  }} 
                />
              
              <span style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)', 
                fontWeight: 'var(--font-semibold)',
                color: '#ff7a00'
              }}>
                {t('infoSection.phoneNumber2')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection; 