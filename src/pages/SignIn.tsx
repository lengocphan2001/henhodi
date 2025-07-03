import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from './SignUp.module.css';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      const response = await apiService.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.success && response.data) {
        console.log('Login successful, user data:', response.data.user);
        // Store token and user data
        apiService.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else {
          console.log('Redirecting to main page');
          navigate('/main');
        }
      } else {
        console.log('Login failed:', response.message);
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
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
            <div className={styles.formTitle}>Đăng Nhập</div>
            
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
            <button 
              className={styles.button} 
              type="submit"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
            <div className={styles.switchText}>
              Bạn chưa có tài khoản? <Link to="/signup" className={styles.link}>Đăng ký</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 