import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import FilterTabs from '../components/FilterTabs';
import CardGrid from '../components/CardGrid';
import { apiService, Girl } from '../services/api';

const Main: React.FC = () => {
  const { t } = useTranslation();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>(['Full Phú Quốc']);
  const [activeFilter, setActiveFilter] = useState('Full Phú Quốc');

  // Fetch girls data from API
  useEffect(() => {
    const loadGirls = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getGirls(1, 50, '', ''); // Get first 50 girls
        
        if (response.success && response.data && Array.isArray(response.data.data)) {
          const girlsData = response.data.data.filter(girl => girl.isActive); // Only show active girls
          setGirls(girlsData);
          
          // Generate filters from unique areas
          const uniqueAreas = Array.from(new Set(girlsData.map(girl => girl.area)));
          setFilters(['Full Phú Quốc', ...uniqueAreas]);
        } else {
          setError(t('main.failedToLoadGirls'));
        }
      } catch (err) {
        console.error('Error loading girls:', err);
        setError(t('main.failedToLoadGirls'));
      } finally {
        setLoading(false);
      }
    };

    loadGirls();
  }, []);

  // Filter girls based on selected area
  const filteredGirls = activeFilter === 'Full Phú Quốc'
    ? girls
    : girls.filter(girl => girl.area === activeFilter);

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ 
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #ff7a00', 
            borderTop: '3px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-2)'
          }}></div>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ 
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)'
        }}>
          <div style={{ marginBottom: 'var(--space-2)', color: '#ff5e62' }}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="pretty-button danger"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#232733', 
      color: 'white',
      flex: 1,
      maxWidth: 'var(--container-xl)',
      margin: '0 auto',
      padding: 'var(--space-6)',
      marginTop: 'var(--space-6)'
    }}>
      <InfoSection />
      <FilterTabs filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <CardGrid girls={filteredGirls} />
    </div>
  );
};

export default Main; 