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
        padding: '0 var(--space-6)'
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
      {/* Right: Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          minWidth: 0
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
    </header>
  );
};

export default Header; 