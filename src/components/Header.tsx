import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from '../pages/SignUp.module.css';

const Header: React.FC = () => {
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
          <div className={styles.logoRow}>
            <div className={styles.logoCircle}></div>
            <span className={styles.logoText}>HEHODI</span>
          </div>
        </Link>
        <div style={{ color: '#fff' }}>Loading...</div>
      </header>
    );
  }

  return (
    <header className={styles.header} style={{ 
      background: '#232733', 
      borderBottom: '1px solid #232733', 
      position: 'relative', 
      zIndex: 10 
    }}>
      <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <div className={styles.logoRow}>
          <div className={styles.logoCircle}></div>
          <span className={styles.logoText}>HEHODI</span>
        </div>
      </Link>
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {user ? (
          <>
            <div style={{ 
              color: '#fff', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Xin chào, {user.username}</span>
              {user.role === 'admin' && (
                <span style={{ 
                  background: '#ff5e62', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }}>
                  Admin
                </span>
              )}
            </div>
            {user.role === 'admin' && (
              <button 
                className={`${styles.button} button-text-small`} 
                style={{ 
                  background: '#4a90e2', 
                  color: '#fff', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: 'var(--space-2) var(--space-6)', 
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content'
                }}
                onClick={handleAdminClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#357abd';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4a90e2';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Quản lý
              </button>
            )}
            <button 
              className={`${styles.button} button-text-small`} 
              style={{ 
                background: '#ff5e62', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-2) var(--space-6)', 
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e53e3e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff5e62';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button 
                className={`${styles.button} button-text-small`} 
                style={{ 
                  background: '#393e4b', 
                  color: '#fff', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: 'var(--space-2) var(--space-6)', 
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4a5568';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#393e4b';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Đăng Ký
              </button>
            </Link>
            <Link to="/signin">
              <button 
                className={`${styles.button} button-text-small`} 
                style={{ 
                  background: 'linear-gradient(90deg,#ff5e62,#ffb347)', 
                  color: '#fff', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: 'var(--space-2) var(--space-6)', 
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 94, 98, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Đăng nhập
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 