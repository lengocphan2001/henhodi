import React from 'react';
import GirlCard from './GirlCard';

import { Girl } from '../services/api';

type CardGridProps = {
  girls: Girl[];
};

const CardGrid: React.FC<CardGridProps> = ({ girls }) => {
  return (
    <div
      style={{
        maxWidth: 'var(--container-xl)',
        // margin: '0 auto',
        display: 'flex',
        // gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)) ',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-12)',
        justifyContent: 'center',
        // padding: '0 var(--space-6)',
        minHeight: '480px',
        // justifyContent: 'center',
      }}
    >
      {girls.map((girl, idx) => (
        <div key={idx} style={{ 
          width: '100%', 
          maxWidth: '300px',
          justifySelf: 'center'
        }}>
          <GirlCard {...girl} />
        </div>
      ))}
    </div>
  );
};

export default CardGrid; 