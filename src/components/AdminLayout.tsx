import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    apiService.logout();
    navigate('/signin');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/girls', label: 'Girls', icon: '💃' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#232733'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: isMobile ? (sidebarOpen ? '250px' : '0') : '250px',
        background: '#181a20',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        height: isMobile ? '100vh' : 'auto',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo/Header */}
        <div style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xl)' }}>⚙️</span>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: '#ff7a00'
            }}>
              Admin
            </span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 'var(--text-xl)',
                cursor: 'pointer',
                padding: 'var(--space-1)'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-2)',
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: isActive(item.path) ? '#fff' : '#d1d5db',
                background: isActive(item.path) 
                  ? 'linear-gradient(135deg, #ff7a00, #ff5e62)' 
                  : 'transparent',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive(item.path) ? 'var(--font-semibold)' : 'var(--font-medium)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              <span style={{ fontSize: 'var(--text-lg)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Link
            to="/main"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            <span>🏠</span>
            <span>Về trang chủ</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ff5e62',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 94, 98, 0.1)';
              e.currentTarget.style.borderColor = '#ff5e62';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Bar */}
        <header style={{
          background: '#181a20',
          padding: 'var(--space-4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: 'var(--text-xl)',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '36px',
                  minHeight: '36px'
                }}
              >
                ☰
              </button>
            )}
            {/* Logo */}
            <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/assets/logo.png" 
                alt="HEHODI Logo" 
                style={{
                  height: isMobile ? '32px' : '40px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Link>
          </div>
          <div style={{ flex: 1 }} />
          <LanguageSwitcher />
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-4)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

