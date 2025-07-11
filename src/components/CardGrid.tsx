import React from 'react';
import GirlCard from './GirlCard';
import { Girl } from '../services/api';

interface CardGridProps {
  girls: Girl[];
}

const CardGrid: React.FC<CardGridProps> = ({ girls }) => {
  return (
    <div
      style={{
        maxWidth: 'var(--container-xl)',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-12)',
        padding: '0 var(--space-6)',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      {girls.map((girl, idx) => (
        <div key={idx} style={{ 
          width: '100%', 
          maxWidth: '300px',
          justifySelf: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <GirlCard {...girl} />
        </div>
      ))}
    </div>
  );
};

export default CardGrid; 