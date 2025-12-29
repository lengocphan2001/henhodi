import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import AdminLayout from '../components/AdminLayout';

interface SiteSettings {
  footerZalo: string;
  hotline: string;
  email: string;
  service1: string;
  service2: string;
  service3: string;
  service4: string;
  [key: string]: string; // Index signature to allow Record<string, string> compatibility
}

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings>({
    footerZalo: '',
    hotline: '',
    email: '',
    service1: '',
    service2: '',
    service3: '',
    service4: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSettings();
      if (response.success && response.data) {
        setSettings({
          footerZalo: response.data.footerZalo || '',
          hotline: response.data.hotline || '',
          email: response.data.email || '',
          service1: response.data.service1 || '',
          service2: response.data.service2 || '',
          service3: response.data.service3 || '',
          service4: response.data.service4 || ''
        });
      } else {
        setError(response.message || t('admin.failedToLoadSettings'));
      }
    } catch (err) {
      setError(t('admin.failedToLoadSettings'));
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log('Saving settings:', settings);
      const response = await apiService.updateSettings(settings);
      console.log('Save response:', response);
      console.log('Response data:', response.data);
      
      if (response.success && response.data) {
        // Update state directly from response data
        console.log('Updating state with response data:', response.data);
        setSettings({
          footerZalo: response.data.footerZalo || '',
          hotline: response.data.hotline || '',
          email: response.data.email || '',
          service1: response.data.service1 || '',
          service2: response.data.service2 || '',
          service3: response.data.service3 || '',
          service4: response.data.service4 || ''
        });
        
        setSuccess(t('admin.settingsSaved'));
        
        // Reload settings to get updated values (double check)
        await loadSettings();
        console.log('Settings reloaded after save');
        
        // Dispatch event to notify other components to reload settings
        window.dispatchEvent(new CustomEvent('settings-updated'));
      } else {
        setError(response.message || t('admin.failedToSaveSettings'));
      }
    } catch (err) {
      setError(t('admin.failedToSaveSettings'));
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            textAlign: 'center'
          }}>
            {t('admin.loading')}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 style={{ 
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--font-bold)',
        marginBottom: 'var(--space-6)',
        color: '#ff7a00'
      }}>
        {t('admin.settings')}
      </h1>

      {error && (
        <div style={{
          background: '#ff5e62',
          color: '#fff',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#43e97b',
          color: '#fff',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)'
        }}>
          {success}
        </div>
      )}

      <div style={{
        background: '#181a20',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-semibold)',
          marginBottom: 'var(--space-4)',
          color: '#ff7a00'
        }}>
          {t('admin.contactInfo')}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)',
              color: '#d1d5db'
            }}>
              Zalo Footer
            </label>
            <input
              type="text"
              value={settings.footerZalo}
              onChange={(e) => handleInputChange('footerZalo', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#232733',
                color: '#fff',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff7a00';
                e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)',
              color: '#d1d5db'
            }}>
              {t('admin.hotline')}
            </label>
            <input
              type="text"
              value={settings.hotline}
              onChange={(e) => {
                // Remove "Hotline: " prefix if user types it
                let value = e.target.value;
                if (value.toLowerCase().startsWith('hotline:')) {
                  value = value.substring(8).trim();
                }
                handleInputChange('hotline', value);
              }}
              placeholder="0375221547"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#232733',
                color: '#fff',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff7a00';
                e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              marginTop: 'var(--space-1)',
              fontSize: 'var(--text-xs)',
              color: '#9ca3af',
              fontFamily: 'var(--font-primary)'
            }}>
              {t('admin.hotlineHint')}
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)',
              color: '#d1d5db'
            }}>
              {t('admin.email')}
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#232733',
                color: '#fff',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff7a00';
                e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-semibold)',
          marginBottom: 'var(--space-4)',
          marginTop: 'var(--space-6)',
          color: '#ff7a00'
        }}>
          {t('admin.services')}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-2)',
                color: '#d1d5db'
              }}>
                {t('admin.service')} {num}
              </label>
              <input
                type="text"
                value={settings[`service${num}` as keyof SiteSettings]}
                onChange={(e) => handleInputChange(`service${num}` as keyof SiteSettings, e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#232733',
                  color: '#fff',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff7a00';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving 
                ? 'rgba(255, 122, 0, 0.5)' 
                : 'linear-gradient(135deg, #ff7a00, #ff5e62)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-5)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-semibold)',
              fontSize: 'var(--text-sm)',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 122, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 122, 0, 0.3)';
              }
            }}
          >
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

