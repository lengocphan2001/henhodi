import React, { useState, useEffect } from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection';
import FilterTabs from '../components/FilterTabs';
import CardGrid from '../components/CardGrid';
import FooterInfoSection from '../components/FooterInfoSection';
import { apiService, Girl } from '../services/api';



const Main: React.FC = () => {
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
          setError('Failed to load girls data');
        }
      } catch (err) {
        console.error('Error loading girls:', err);
        setError('Failed to load girls data');
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
          fontSize: 'var(--text-xl)'
        }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            Loading girls...
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(255, 255, 255, 0.1)', 
            borderTop: '4px solid #667eea', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
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
          <div style={{ marginBottom: 'var(--space-4)', color: '#ff5e62' }}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-6)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#232733', 
      padding: '20px',
      color: 'white'
    }}>
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733', 
        paddingBottom: 'var(--space-8)',
        overflowX: 'hidden'
      }}>
        <Header />
        <InfoSection />
        <FilterTabs filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <CardGrid girls={filteredGirls} />
        <FooterInfoSection />
      </div>
    </div>
  );
};

export default Main; 