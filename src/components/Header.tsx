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
  const [isMobile, setIsMobile] = useState(false);

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

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkAuth();
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      apiService.logout();
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate('/signin');
    }
  };

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/admin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <header style={{ 
        background: '#181a20', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        position: 'sticky', 
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 var(--space-4)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        {!isMobile && (
          <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/assets/logo.png" 
              alt="HEHODI Logo" 
              style={{ 
                height: '32px', 
                width: 'auto',
                borderRadius: '6px'
              }} 
            />
          </Link>
        )}
        <div style={{ color: '#fff', fontSize: '14px' }}>{t('common.loading')}</div>
      </header>
    );
  }

  return (
    <>
      <header
        style={{
          background: '#181a20',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'space-between',
          height: '64px',
          padding: '0 var(--space-4)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Left: Logo (hidden on mobile) */}
        {!isMobile && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/assets/logo.png" 
                alt="HEHODI Logo" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  borderRadius: '6px'
                }} 
              />
            </Link>
          </div>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              minWidth: 0,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flexShrink: 0, minWidth: '140px' }}>
              <LanguageSwitcher />
            </div>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #ff5e62, #ffb347)', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    Admin
                  </span>
                )}
                {user.role === 'admin' && (
                  <button 
                    onClick={handleAdminClick}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {t('header.manage')}
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ff5e62, #ffb347)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {t('header.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {t('header.signUp')}
                  </button>
                </Link>
                <Link to="/signin" style={{ textDecoration: 'none' }}>
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #ff5e62, #ffb347)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {t('header.signIn')}
                  </button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile: Hamburger menu button always visible */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              minHeight: '40px',
              minWidth: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              marginLeft: 'auto'
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Mobile: Show user status (optional, can remove if not needed) */}
        {/* {isMobile && user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '14px',
            color: '#fff',
            marginLeft: '8px'
          }}>
            {user.role === 'admin' && (
              <span style={{ 
                background: 'linear-gradient(135deg, #ff5e62, #ffb347)', 
                padding: '2px 6px', 
                borderRadius: '8px', 
                fontSize: '10px',
                fontWeight: 600,
                color: '#fff'
              }}>
                Admin
              </span>
            )}
            <span style={{ 
              color: '#d1d5db',
              fontSize: '12px',
              maxWidth: '80px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.username}
            </span>
          </div>
        )} */}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#181a20',
            zIndex: 999,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            overflowY: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
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
                  <button 
                    onClick={handleAdminClick}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      minHeight: '48px'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {t('header.manage')}
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ff5e62, #ffb347)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    minHeight: '48px'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {t('header.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button 
                    onClick={closeMobileMenu}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      minHeight: '48px'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {t('header.signUp')}
                  </button>
                </Link>
                <Link to="/signin" style={{ textDecoration: 'none' }}>
                  <button 
                    onClick={closeMobileMenu}
                    style={{
                      background: 'linear-gradient(135deg, #ff5e62, #ffb347)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      minHeight: '48px'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {t('header.signIn')}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 