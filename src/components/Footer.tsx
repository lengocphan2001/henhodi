import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import styles from '../pages/SignUp.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [settings, setSettings] = useState<{ 
    footerZalo?: string; 
    hotline?: string; 
    email?: string;
    service1?: string;
    service2?: string;
    service3?: string;
    service4?: string;
  }>({});
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Load settings
    const loadSettings = async () => {
      try {
        const response = await apiService.getSettings();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
    
    // Listen for settings update events
    const handleSettingsUpdate = () => {
      loadSettings();
    };
    window.addEventListener('settings-updated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  return (
  <footer style={{ 
    width: '100%',
    background: '#181a20', 
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: isMobile ? 'var(--space-5) 0' : 'var(--space-6) 0',
    marginTop: 'auto'
  }}>
    <div style={{ 
      maxWidth: 'var(--container-xl)', 
      margin: '0 auto', 
      padding: isMobile ? '0 var(--space-3)' : '0 var(--space-6)',
      color: '#fff'
    }}>
      {/* Main Footer Content */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: isMobile ? 'var(--space-4)' : 'var(--space-6)',
        marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)'
      }}>
        {/* Brand Section */}
        <div>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: isMobile ? 'var(--text-base)' : 'var(--text-lg)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: 'var(--space-2)'
          }}>
            {t('footer.community')}
          </div>
          <div style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
            lineHeight: 'var(--leading-relaxed)',
            letterSpacing: 'var(--tracking-normal)',
            opacity: 0.9
          }}>
            {t('footer.description')}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: isMobile ? 'var(--text-base)' : 'var(--text-lg)',
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--leading-tight)'
          }}>
            {t('footer.contact')}
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #00c3ff, #ffb347)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                Z
              </div>
              <span>Zalo: {settings.footerZalo || t('footer.zalo').replace('Zalo: ', '')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #ff5e62, #ffb347)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                📞
              </div>
              <span>Hotline: {settings.hotline || t('footer.hotline').replace('Hotline: ', '')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #43e97b, #38f9d7)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                ✉️
              </div>
              <span>Email: {settings.email || t('footer.email').replace('Email: ', '')}</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h3 style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: 'var(--text-lg)',
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--leading-tight)'
          }}>
            {t('footer.services')}
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}>
            <span style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {settings.service1 || t('footer.service1')}
            </span>
            <span style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {settings.service2 || t('footer.service2')}
            </span>
            <span style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {settings.service3 || t('footer.service3')}
            </span>
            <span style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {settings.service4 || t('footer.service4')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: isMobile ? 'var(--space-4)' : 'var(--space-5)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'center' : 'center',
        flexWrap: 'wrap',
        gap: isMobile ? 'var(--space-3)' : 'var(--space-2)'
      }}>
        <div style={{ 
          color: '#9ca3af', 
          fontFamily: 'var(--font-primary)',
          fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
          opacity: 0.8,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {t('footer.copyright')}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            color: '#9ca3af', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            {t('footer.privacyPolicy')}
          </span>
          <span style={{ 
            color: '#9ca3af', 
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            {t('footer.termsOfService')}
          </span>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer; 