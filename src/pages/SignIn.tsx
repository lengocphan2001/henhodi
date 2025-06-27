import React from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
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
            <div className={styles.formTitle}>Đăng Nhập</div>
            <input className={styles.input} type="text" placeholder="Số điện thoại" />
            <input className={styles.input} type="password" placeholder="Mật khẩu" />
            <button className={styles.button} type="submit">Đăng Nhập</button>
            <div className={styles.switchText}>
              Bạn chưa có tài khoản? <a href="/signup" className={styles.link}>Đăng ký</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 