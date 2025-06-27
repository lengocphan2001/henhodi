import React from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div className={styles.logoRow}>
            <div className={styles.logoCircle}></div>
            <span className={styles.logoText}>HEHODI</span>
          </div>
        </Link>
        <div className={styles.languageSwitch}>
          <span className={styles.flag}></span>
          <span>Tiếng Việt</span>
        </div>
      </header>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.title}>Black Phú Quốc</div>
          <div className={styles.subtitle}>
            Đặt lịch hẹn gặp các bé vui lòng nhắn vui lòng nhắn Zalo dưới đây
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <span role="img" aria-label="thumbs up" className={styles.emoji}>👍</span>
              <span>ĐẲNG CẤP GÁI GỌI</span>
            </div>
            <div className={styles.zaloRow}>
              <div className={styles.zaloIcon}></div>
              <span className={styles.phone}>0965209115</span>
            </div>
            <div className={styles.zaloRow}>
              <div className={styles.zaloIcon}></div>
              <span className={styles.phone}>0965209115</span>
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form}>
            <div className={styles.formTitle}>Đăng Ký Tài Khoản</div>
            <input className={styles.input} type="text" placeholder="Số điện thoại" />
            <input className={styles.input} type="password" placeholder="Mật khẩu" />
            <input className={styles.input} type="password" placeholder="Nhập lại mật khẩu" />
            <button className={styles.button} type="submit">Đăng Ký</button>
            <div className={styles.switchText}>
              Bạn đã có tài khoản <a href="/signin" className={styles.link}>Đăng nhập</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 