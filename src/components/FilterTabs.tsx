import React from 'react';

type FilterTabsProps = {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ filters, activeFilter, onFilterChange }) => (
  <div style={{ 
    maxWidth: 'var(--container-xl)', 
    margin: '0 auto', 
    marginBottom: 'var(--space-8)', 
    display: 'flex', 
    gap: 'var(--space-3)', 
    flexWrap: 'wrap',
    padding: '0 var(--space-6)',
    justifyContent: 'center'
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
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-3) var(--space-6)',
          fontFamily: 'var(--font-heading)',
          fontWeight: f === activeFilter 
            ? 'var(--font-semibold)' 
            : 'var(--font-medium)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          boxShadow: f === activeFilter 
            ? '0 4px 12px rgba(255, 122, 0, 0.3)' 
            : 'var(--shadow-sm)',
          transform: f === activeFilter ? 'translateY(-1px)' : 'translateY(0)',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content'
        }}
        onClick={() => onFilterChange(f)}
        onMouseEnter={(e) => {
          if (f !== activeFilter) {
            e.currentTarget.style.background = '#2a2d35';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }
        }}
        onMouseLeave={(e) => {
          if (f !== activeFilter) {
            e.currentTarget.style.background = '#181a20';
            e.currentTarget.style.color = '#d1d5db';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }
        }}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterTabs; 