import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ 
      maxWidth: 'var(--container-xl)', 
      margin: '0 auto', 
      marginBottom: 'var(--space-8)', 
      padding: '0 var(--space-6)'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--space-5)',
        alignItems: 'stretch'
      }}>
        <div style={{ 
          background: '#181a20', 
          borderRadius: 'var(--radius-2xl)', 
          padding: 'var(--space-6)', 
          color: '#fff', 
          boxShadow: 'var(--shadow-lg)',
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
            fontSize: 'var(--text-2xl)', 
            marginBottom: 'var(--space-3)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)'
          }}>
            {t('infoSection.title')}
          </div>
          <div style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)', 
            color: '#d1d5db', 
            marginBottom: 'var(--space-3)',
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
          borderRadius: 'var(--radius-2xl)', 
          padding: 'var(--space-6)', 
          color: '#fff', 
          boxShadow: 'var(--shadow-lg)',
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
            fontSize: 'var(--text-2xl)', 
            marginBottom: 'var(--space-3)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)'
          }}>
            {t('infoSection.contactTitle')}
          </div>
          <div style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)', 
            color: '#d1d5db', 
            marginBottom: 'var(--space-3)',
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              padding: 'var(--space-2)',
              background: 'rgba(255, 122, 0, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 122, 0, 0.2)'
            }}>
              
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
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-semibold)',
                color: '#ff7a00'
              }}>
                {t('infoSection.phoneNumber')}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              padding: 'var(--space-2)',
              background: 'rgba(255, 122, 0, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 122, 0, 0.2)'
            }}>
              
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
                fontSize: 'var(--text-lg)', 
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