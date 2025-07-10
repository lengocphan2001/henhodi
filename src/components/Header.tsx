import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from '../pages/SignUp.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (apiService.isAuthenticated()) {
          const userData = apiService.getUser();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        apiService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      apiService.logout();
      setUser(null);
      navigate('/signin');
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <header className={styles.header} style={{ 
        background: '#232733', 
        borderBottom: '1px solid #232733', 
        position: 'relative', 
        zIndex: 10 
      }}>
        <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/logo.png" 
            alt="HEHODI Logo" 
            style={{ 
              height: '40px', 
              width: 'auto',
              borderRadius: '8px'
            }} 
          />
        </Link>
        <div style={{ color: '#fff' }}>{t('common.loading')}</div>
      </header>
    );
  }

  return (
    <header
      className={styles.header}
      style={{
        background: '#232733',
        borderBottom: '1px solid #232733',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        padding: '0 var(--space-6)',
        flexWrap: 'wrap'
      }}
    >
      {/* Left: Logo */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/logo.png" 
            alt="HEHODI Logo" 
            style={{ 
              height: '40px', 
              width: 'auto',
              borderRadius: '8px'
            }} 
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div style={{ display: 'none' }}>
        <button
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Desktop Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          minWidth: 0,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flexShrink: 0, minWidth: '160px' }}>
          <LanguageSwitcher />
        </div>
        {user ? (
          <>
            {user.role === 'admin' && (
              <span style={{ 
                background: '#ff5e62', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                marginLeft: '4px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 1
              }}>
                Admin
              </span>
            )}
            {user.role === 'admin' && (
              <button 
                className="pretty-button header"
                onClick={handleAdminClick}
                style={{ whiteSpace: 'nowrap', flexShrink: 1 }}
              >
                {t('header.manage')}
              </button>
            )}
            <button 
              className="pretty-button header danger"
              onClick={handleLogout}
              style={{ whiteSpace: 'nowrap', flexShrink: 1 }}
            >
              {t('header.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="signup">
              <button 
                className="pretty-button header"
                style={{ whiteSpace: 'nowrap', flexShrink: 1 }}
              >
                {t('header.signUp')}
              </button>
            </Link>
            <Link to="/signin">
              <button 
                className="pretty-button header danger"
                style={{ whiteSpace: 'nowrap', flexShrink: 1 }}
              >
                {t('header.signIn')}
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#232733',
            zIndex: 1000,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            overflowY: 'auto'
          }}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-3)',
            alignItems: 'stretch'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              padding: 'var(--space-2)'
            }}>
              <LanguageSwitcher />
            </div>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                    <span style={{ 
                      background: '#ff5e62', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff'
                    }}>
                      Admin
                    </span>
                  </div>
                )}
                {user.role === 'admin' && (
                  <button 
                    className="pretty-button"
                    onClick={() => {
                      handleAdminClick();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ width: '100%', maxWidth: 'none' }}
                  >
                    {t('header.manage')}
                  </button>
                )}
                <button 
                  className="pretty-button danger"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ width: '100%', maxWidth: 'none' }}
                >
                  {t('header.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="signup" style={{ textDecoration: 'none' }}>
                  <button 
                    className="pretty-button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ width: '100%', maxWidth: 'none' }}
                  >
                    {t('header.signUp')}
                  </button>
                </Link>
                <Link to="/signin" style={{ textDecoration: 'none' }}>
                  <button 
                    className="pretty-button danger"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ width: '100%', maxWidth: 'none' }}
                  >
                    {t('header.signIn')}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 