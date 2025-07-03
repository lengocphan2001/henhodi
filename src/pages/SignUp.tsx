import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from './SignUp.module.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });

      if (response.success) {
        // Registration successful, redirect to login
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/signin');
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formTitle}>Đăng Ký Tài Khoản</div>
            
            {error && (
              <div style={{
                background: '#ff5e62',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <input 
              className={styles.input} 
              type="text" 
              name="username"
              placeholder="Tên đăng nhập" 
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
            />
            <input 
              className={styles.input} 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            <input 
              className={styles.input} 
              type="password" 
              name="password"
              placeholder="Mật khẩu" 
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            <input 
              className={styles.input} 
              type="password" 
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button 
              className={styles.button} 
              type="submit"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
            <div className={styles.switchText}>
              Bạn đã có tài khoản <Link to="/signin" className={styles.link}>Đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 