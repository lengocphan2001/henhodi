import React from 'react';

interface FilterTabsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filters, activeFilter, onFilterChange }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
  <div style={{ 
    maxWidth: 'var(--container-xl)', 
    margin: '0 auto', 
    marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)', 
    display: 'flex', 
    gap: isMobile ? 'var(--space-2)' : 'var(--space-3)', 
    flexWrap: 'wrap',
    padding: '0',
    justifyContent: 'center',
    overflowX: isMobile ? 'auto' : 'visible',
    WebkitOverflowScrolling: 'touch'
  }}>
    {filters.map((f) => (
      <button
        key={f}
        style={{
          background: f === activeFilter 
            ? 'linear-gradient(135deg, #ff7a00, #ff5e62)' 
            : '#181a20',
          color: f === activeFilter ? '#fff' : '#d1d5db',
          border: f === activeFilter 
            ? 'none' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: isMobile ? 'var(--space-2) var(--space-4)' : 'var(--space-2) var(--space-5)',
          fontFamily: 'var(--font-heading)',
          fontWeight: f === activeFilter 
            ? 'var(--font-semibold)' 
            : 'var(--font-medium)',
          fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          boxShadow: f === activeFilter 
            ? '0 2px 8px rgba(255, 122, 0, 0.25)' 
            : 'var(--shadow-sm)',
          transform: f === activeFilter ? 'translateY(-1px)' : 'translateY(0)',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
          minHeight: isMobile ? '36px' : '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onClick={() => onFilterChange(f)}
        onMouseEnter={(e) => {
          if (window.innerWidth > 768 && f !== activeFilter) {
            e.currentTarget.style.background = '#2a2d35';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }
        }}
        onMouseLeave={(e) => {
          if (window.innerWidth > 768 && f !== activeFilter) {
            e.currentTarget.style.background = '#181a20';
            e.currentTarget.style.color = '#d1d5db';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }
        }}
        onTouchStart={(e) => {
          if (f !== activeFilter) {
            e.currentTarget.style.transform = 'scale(0.98)';
          }
        }}
        onTouchEnd={(e) => {
          if (f !== activeFilter) {
            e.currentTarget.style.transform = f === activeFilter ? 'translateY(-1px)' : 'translateY(0)';
          }
        }}
      >
        {f}
      </button>
    ))}
  </div>
  );
};

export default FilterTabs; 