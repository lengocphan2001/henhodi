import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LanguageDemo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ 
      background: '#232733', 
      color: 'white',
      minHeight: '100vh',
      padding: 'var(--space-8) var(--space-6)'
    }}>
      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-8)'
        }}>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: 'var(--text-3xl)',
            marginBottom: 'var(--space-4)',
            background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t('main.title')}
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-lg)',
            color: '#d1d5db',
            marginBottom: 'var(--space-6)'
          }}>
            {t('main.subtitle')}
          </p>
          
          {/* Language Switcher */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: 'var(--space-8)'
          }}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Auth Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2a2d35, #232733)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-6)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-4)',
              color: '#ff7a00'
            }}>
              {t('auth.signIn')}
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'var(--space-1)',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#9ca3af'
                }}>
                  {t('auth.email')}
                </label>
                <input 
                  type="email" 
                  placeholder={t('auth.email')}
                  style={{ 
                    width: '100%',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontFamily: 'var(--font-primary)'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'var(--space-1)',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#9ca3af'
                }}>
                  {t('auth.password')}
                </label>
                <input 
                  type="password" 
                  placeholder={t('auth.password')}
                  style={{ 
                    width: '100%',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontFamily: 'var(--font-primary)'
                  }}
                />
              </div>
              <button style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {t('auth.signIn')}
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2a2d35, #232733)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-6)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-4)',
              color: '#ff7a00'
            }}>
              {t('footer.services')}
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ 
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 122, 0, 0.1)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                fontFamily: 'var(--font-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)'}
              >
                {t('footer.service1')}
              </div>
              <div style={{ 
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 122, 0, 0.1)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                fontFamily: 'var(--font-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)'}
              >
                {t('footer.service2')}
              </div>
              <div style={{ 
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 122, 0, 0.1)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                fontFamily: 'var(--font-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)'}
              >
                {t('footer.service3')}
              </div>
              <div style={{ 
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 122, 0, 0.1)',
                border: '1px solid rgba(255, 122, 0, 0.2)',
                fontFamily: 'var(--font-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 122, 0, 0.1)'}
              >
                {t('footer.service4')}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2a2d35, #232733)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-6)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-4)',
              color: '#ff7a00'
            }}>
              {t('footer.contact')}
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                fontFamily: 'var(--font-primary)'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: 'linear-gradient(135deg, #00c3ff, #ffb347)', 
                  borderRadius: '50%' 
                }}></div>
                <span>{t('footer.zalo')}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                fontFamily: 'var(--font-primary)'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: 'linear-gradient(135deg, #ff5e62, #ffb347)', 
                  borderRadius: '50%' 
                }}></div>
                <span>{t('footer.hotline')}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                fontFamily: 'var(--font-primary)'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: 'linear-gradient(135deg, #43e97b, #38f9d7)', 
                  borderRadius: '50%' 
                }}></div>
                <span>{t('footer.email')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ 
          textAlign: 'center',
          padding: 'var(--space-6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 'var(--space-8)'
        }}>
          <p style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)',
            color: '#9ca3af',
            marginBottom: 'var(--space-2)'
          }}>
            {t('footer.description')}
          </p>
          <p style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
            color: '#6b7280'
          }}>
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageDemo; 