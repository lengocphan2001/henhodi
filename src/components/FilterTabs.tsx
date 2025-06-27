import React from 'react';

type FilterTabsProps = {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ filters, activeFilter, onFilterChange }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {filters.map((f) => (
      <button
        key={f}
        style={{
          background: f === activeFilter ? '#ff7a00' : '#181a20',
          color: f === activeFilter ? '#fff' : '#d1d5db',
          border: 'none',
          borderRadius: 16,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
        }}
        onClick={() => onFilterChange(f)}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterTabs; 