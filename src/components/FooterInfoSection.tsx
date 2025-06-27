import React from 'react';
import styles from '../pages/SignUp.module.css';

const FooterInfoSection: React.FC = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', background: '#181a20', borderRadius: 16, padding: 32, color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    <div style={{ background: '#232733', color: '#ff7a00', fontWeight: 700, fontSize: 22, borderRadius: 12, padding: '8px 24px', display: 'inline-block', marginBottom: 16 }}>Black Phú Quốc</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Cộng Đồng Black Gái Phú Quốc</span>
      <span style={{ background: '#393e4b', borderRadius: 8, padding: '4px 12px', color: '#fff', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className={styles.flag}></span>Tiếng Việt
      </span>
    </div>
    <div style={{ color: '#d1d5db', fontSize: 16 }}>
      Cộng đồng anh chị Vua Gái Gọi Phú Quốc, nơi chia sẻ thông tin các em hàng đang hoạt động tại khu vực với chất lượng được đảm bảo uy tín nhất hiện nay. Chúng tôi cam kết là mạng cộng đồng sân chơi lành mạnh vì lợi ích của anh em Checker Phú Quốc.
    </div>
  </div>
);

export default FooterInfoSection; 