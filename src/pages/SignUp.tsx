import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import styles from './SignUp.module.css';
import LanguageSwitcher from '../components/LanguageSwitcher';

const SignUp: React.FC = () => {
  const { t } = useTranslation();
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
      setError(t('auth.fillAllFields'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('auth.invalidEmail'));
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
        alert(t('auth.registerSuccess'));
        navigate('/signin');
      } else {
        setError(response.message || t('auth.registerFailed'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('auth.registerFailedTryAgain'));
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
            <div className={styles.formTitle}>{t('auth.registerAccount')}</div>
            
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
              placeholder={t('auth.username')} 
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
            />
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
            <input 
              className={styles.input} 
              type="password" 
              name="confirmPassword"
              placeholder={t('auth.confirmPassword')} 
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
              {loading ? t('auth.registering') : t('auth.signUp')}
            </button>
            <div className={styles.switchText}>
              {t('auth.alreadyHaveAccount')} <Link to="/signin" className={styles.link}>{t('auth.signIn')}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 