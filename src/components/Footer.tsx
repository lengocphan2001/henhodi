import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../pages/SignUp.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
  <footer style={{ 
    width: '100%',
    background: '#181a20', 
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: 'var(--space-8) 0',
    marginTop: 'auto'
  }}>
    <div style={{ 
      maxWidth: 'var(--container-xl)', 
      margin: '0 auto', 
      padding: '0 var(--space-6)',
      color: '#fff'
    }}>
      {/* Main Footer Content */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-8)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Brand Section */}
        <div>
          <div style={{ 
            background: 'linear-gradient(135deg, #232733, #2a2d35)', 
            color: '#ff7a00', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: 'var(--text-xl)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-3) var(--space-7)', 
            display: 'inline-block', 
            marginBottom: 'var(--space-5)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(255, 122, 0, 0.2)'
          }}>
            {t('footer.brand')}
          </div>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: 'var(--space-2)'
          }}>
            {t('footer.community')}
          </div>
          <div style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)', 
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
            fontSize: 'var(--text-lg)',
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
              fontSize: 'var(--text-base)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #00c3ff, #ffb347)', 
                borderRadius: '50%' 
              }}></div>
              <span>{t('footer.zalo')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #ff5e62, #ffb347)', 
                borderRadius: '50%' 
              }}></div>
              <span>{t('footer.hotline')}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: 'linear-gradient(135deg, #43e97b, #38f9d7)', 
                borderRadius: '50%' 
              }}></div>
              <span>{t('footer.email')}</span>
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
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {t('footer.service1')}
            </span>
            <span style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {t('footer.service2')}
            </span>
            <span style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {t('footer.service3')}
            </span>
            <span style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff7a00'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {t('footer.service4')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: 'var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-2)'
      }}>
        <div style={{ 
          color: '#9ca3af', 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)',
          opacity: 0.8
        }}>
          {t('footer.copyright')}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)',
          flexWrap: 'wrap'
        }}>
          <LanguageSwitcher />
          <span style={{ 
            color: '#9ca3af', 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
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
            fontSize: 'var(--text-sm)',
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