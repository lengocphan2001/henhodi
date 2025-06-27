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

const COLUMNS = 4;
const CARD_WIDTH = 260;
const CARD_HEIGHT = 480;

const CardGrid: React.FC<CardGridProps> = ({ girls }) => {
  // Fill with empty slots to keep grid consistent
  const placeholders = Array((COLUMNS - (girls.length % COLUMNS)) % COLUMNS).fill(null);

  return (
    <div
      style={{
        maxWidth: COLUMNS * (CARD_WIDTH + 24),
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS}, ${CARD_WIDTH}px)`,
        gap: 24,
        marginBottom: 32,
        minHeight: CARD_HEIGHT + 32,
        justifyContent: 'center',
      }}
    >
      {girls.map((girl, idx) => (
        <div key={idx} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
          <GirlCard {...girl} />
        </div>
      ))}
      {placeholders.map((_, idx) => (
        <div key={`ph-${idx}`} style={{ width: CARD_WIDTH, height: CARD_HEIGHT, visibility: 'hidden' }} />
      ))}
    </div>
  );
};

export default CardGrid; 