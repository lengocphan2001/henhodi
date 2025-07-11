import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Girl } from '../services/api';

type GirlCardProps = Girl;

const GirlCard: React.FC<GirlCardProps> = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { name, area, price, rating, img, zalo } = props;

  const handleClick = () => {
    navigate('/detail', { state: { girl: props } });
  };

  const handleZaloClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Get Zalo number from either the zalo field or the info object
    const zaloNumber = zalo || props.info?.ZALO;
    
    if (zaloNumber) {
      // Open Zalo in a new tab
      const zaloUrl = `https://zalo.me/${zaloNumber.replace(/\D/g, '')}`;
      window.open(zaloUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: show alert if no Zalo number
      alert(t('detail.zaloNotAvailable'));
    }
  };

  return (
    <div
      onClick={handleClick}
      className="girl-card"
      style={{
        background: '#181a20',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: 'auto',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto'
      }}
      onMouseEnter={(e) => {
        if (window.innerWidth > 768) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (window.innerWidth > 768) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={img} 
          alt={name} 
          style={{ 
            width: '100%', 
            height: '280px', 
            objectFit: 'cover',
            flexShrink: 0,
            transition: 'transform 0.3s ease'
          }} 
        />
        {/* Rating overlay for mobile */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-2)',
          right: 'var(--space-2)',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-1) var(--space-2)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ color: '#ffb347', fontSize: 'var(--text-sm)' }}>★</span>
          <span style={{ 
            color: '#fff', 
            fontSize: 'var(--text-sm)', 
            fontWeight: 'var(--font-semibold)' 
          }}>
            {Number(rating || 0).toFixed(1)}
          </span>
        </div>
      </div>
      
      <div style={{ 
        padding: 'var(--space-5)', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        gap: 'var(--space-2)'
      }}>
        <div style={{ 
          color: '#fff', 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 'var(--font-bold)', 
          fontSize: 'var(--text-lg)', 
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)',
          marginBottom: 'var(--space-1)',
          wordBreak: 'break-word'
        }}>
          {name}
        </div>
        <div style={{ 
          color: '#d1d5db', 
          fontFamily: 'var(--font-primary)', 
          fontSize: 'var(--text-sm)', 
          lineHeight: 'var(--leading-normal)',
          letterSpacing: 'var(--tracking-normal)',
          marginBottom: 'var(--space-2)'
        }}>
          {area}
        </div>
        
        {/* Desktop rating display */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-1)', 
          marginBottom: 'var(--space-2)'
        }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const full = i + 1 <= Math.floor(Number(rating));
            const half = !full && i + 0.5 <= Number(rating);
            return (
              <span key={i} style={{ 
                color: '#ffb347', 
                fontSize: 'var(--text-lg)',
                textShadow: '0 1px 2px rgba(255, 179, 71, 0.3)'
              }}>
                {full ? '★' : half ? '⯨' : '☆'}
              </span>
            );
          })}
          <span style={{
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            marginLeft: '8px'
          }}>
            {Number(rating || 0).toFixed(2)}
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-1)', 
          marginBottom: 'var(--space-2)',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
            color: '#fff', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-1) var(--space-2)', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
            whiteSpace: 'nowrap'
          }}>
            {t('girlCard.quickDeal')}: {price}
          </span>
        </div>
        
        <button 
          onClick={handleZaloClick}
          style={{ 
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-2) 0', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: 'var(--text-base)', 
            cursor: 'pointer',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            marginTop: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
            }
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src="/assets/zalo.png" 
            alt="Zalo" 
            style={{ 
              width: '32px', 
              height: '32px',
              objectFit: 'contain'
            }} 
          />
          {t('girlCard.meetClickHere')}
        </button>
      </div>
    </div>
  );
};

export default GirlCard; 