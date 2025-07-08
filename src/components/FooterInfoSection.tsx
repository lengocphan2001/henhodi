import React from 'react';
import styles from '../pages/SignUp.module.css';

const FooterInfoSection: React.FC = () => (
  <div style={{ 
    maxWidth: 'var(--container-lg)', 
    margin: '0 auto', 
    background: '#181a20', 
    borderRadius: 'var(--radius-2xl)', 
    padding: 'var(--space-10)', 
    color: '#fff', 
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: 'var(--space-12)',
    marginTop: 'var(--space-8)',
    marginLeft: 'var(--space-6)',
    marginRight: 'var(--space-6)'
  }}>
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
      Black Phú Quốc
    </div>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 'var(--space-2)', 
      marginBottom: 'var(--space-5)',
      flexWrap: 'wrap'
    }}>
      <span style={{ 
        color: '#fff', 
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--font-bold)', 
        fontSize: 'var(--text-xl)',
        lineHeight: 'var(--leading-tight)',
        letterSpacing: 'var(--tracking-tight)'
      }}>
        Cộng Đồng Black Gái Phú Quốc
      </span>
      <span style={{ 
        background: '#393e4b', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-1) var(--space-2)', 
        color: '#fff', 
        fontFamily: 'var(--font-primary)',
        fontWeight: 'var(--font-medium)', 
        fontSize: 'var(--text-sm)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-2)',
        lineHeight: 'var(--leading-tight)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase'
      }}>
        <span className={styles.flag}></span>
        Tiếng Việt
      </span>
    </div>
    <div style={{ 
      color: '#d1d5db', 
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-base)', 
      lineHeight: 'var(--leading-relaxed)',
      letterSpacing: 'var(--tracking-normal)',
      opacity: 0.9
    }}>
      Cộng đồng anh chị Vua Gái Gọi Phú Quốc, nơi chia sẻ thông tin các em hàng đang hoạt động tại khu vực với chất lượng được đảm bảo uy tín nhất hiện nay. Chúng tôi cam kết là mạng cộng đồng sân chơi lành mạnh vì lợi ích của anh em Checker Phú Quốc.
    </div>
  </div>
);

export default FooterInfoSection; 