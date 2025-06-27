import React from 'react';
import styles from '../pages/SignUp.module.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className={styles.header} style={{ background: '#232733', borderBottom: '1px solid #232733', position: 'relative', zIndex: 10 }}>
    <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <div className={styles.logoRow}>
        <div className={styles.logoCircle}></div>
        <span className={styles.logoText}>HEHODI</span>
      </div>
    </Link>
    <div style={{ display: 'flex', gap: 12 }}>
      <Link to="/signup"><button className={styles.button} style={{ background: '#393e4b', color: '#fff', borderRadius: 8, padding: '8px 24px', fontWeight: 600 }}>Đăng Ký</button></Link>
      <Link to="/signin"><button className={styles.button} style={{ background: 'linear-gradient(90deg,#ff5e62,#ffb347)', color: '#fff', borderRadius: 8, padding: '8px 24px', fontWeight: 600 }}>Đăng nhập</button></Link>
    </div>
  </header>
);

export default Header; 