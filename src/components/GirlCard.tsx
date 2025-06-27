import React from 'react';
import { useNavigate } from 'react-router-dom';

type GirlCardProps = {
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
};

const GirlCard: React.FC<GirlCardProps> = (props) => {
  const navigate = useNavigate();
  const { name, area, price, rating, img } = props;

  const handleClick = () => {
    navigate('/detail', { state: { girl: props } });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#181a20',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <img src={img} alt={name} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{name}</div>
        <div style={{ color: '#d1d5db', fontSize: 13, marginBottom: 8 }}>{area}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          {[...Array(rating)].map((_, i) => <span key={i} style={{ color: '#ffb347', fontSize: 16 }}>★</span>)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <span style={{ background: '#ff7a00', color: '#fff', borderRadius: 8, padding: '4px 10px', fontWeight: 600, fontSize: 13 }}>Tẩu nhanh : {price}</span>
        </div>
        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Hẹn gặp bé click vào đây</button>
      </div>
    </div>
  );
};

export default GirlCard; 