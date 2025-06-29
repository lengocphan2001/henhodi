import React from 'react';
import GirlCard from './GirlCard';

type Girl = {
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
};

type CardGridProps = {
  girls: Girl[];
};

const CardGrid: React.FC<CardGridProps> = ({ girls }) => {
  return (
    <div
      style={{
        maxWidth: 'var(--container-xl)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-12)',
        padding: '0 var(--space-6)',
        minHeight: '480px',
        justifyContent: 'center',
      }}
    >
      {girls.map((girl, idx) => (
        <div key={idx} style={{ 
          width: '100%', 
          maxWidth: '400px',
          justifySelf: 'center',
          height: '100%'
        }}>
          <GirlCard {...girl} />
        </div>
      ))}
    </div>
  );
};

export default CardGrid; 