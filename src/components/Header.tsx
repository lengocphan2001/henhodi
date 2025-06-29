import React from 'react';
import styles from '../pages/SignUp.module.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
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
    </div>
  </header>
);

export default Header; 