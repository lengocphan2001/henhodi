import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from './SignUp.module.css';
import LanguageSwitcher from '../components/LanguageSwitcher';

const SignIn: React.FC = () => {
  const { t } = useTranslation();
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
      setError(t('auth.fillAllFields'));
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
        // Dispatch custom event for header update
        window.dispatchEvent(new Event('henhodi-auth-change'));
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
        setError(response.message || t('auth.loginFailed'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.loginFailedTryAgain'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/main" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/logo.png" 
            alt="HEHODI Logo" 
            style={{ 
              height: '40px', 
              width: 'auto',
              borderRadius: '8px'
            }} 
          />
        </Link>
        <LanguageSwitcher />
      </header>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.title}>{t('main.title')}</div>
          <div className={styles.subtitle}>
            {t('auth.scheduleAppointment')}
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <span role="img" aria-label="thumbs up" className={styles.emoji}>👍</span>
              <span>{t('auth.premiumCallGirls')}</span>
            </div>
            <div className={styles.zaloRow}>
              <div className={styles.zaloIcon}></div>
              <span className={styles.phone}>0568369124</span>
            </div>
            <div className={styles.zaloRow}>
              <div className={styles.zaloIcon}></div>
              <span className={styles.phone}>0375221547</span>
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formTitle}>{t('auth.signIn')}</div>
            
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
              placeholder={t('auth.email')} 
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            <input 
              className={styles.input} 
              type="password" 
              name="password"
              placeholder={t('auth.password')} 
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
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
            <div className={styles.switchText}>
              {t('auth.dontHaveAccount')} <Link to="/signup" className={styles.link}>{t('auth.signUp')}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 