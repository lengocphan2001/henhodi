import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Girl } from '../services/api';
import { formatPriceVND } from '../utils/formatPrice';

type GirlCardProps = Girl;

const GirlCard: React.FC<GirlCardProps> = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { name, area, price, rating, img, zalo } = props;
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    navigate('/detail', { state: { girl: props } });
  };

  const handleZaloClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Get Zalo number from either the zalo field or the info object
    const zaloNumber = zalo || props.info?.ZALO;
    
    if (zaloNumber) {
      // Extract only digits from the phone number
      const phoneNumber = zaloNumber.toString().replace(/\D/g, '');
      
      if (phoneNumber) {
        // Open Zalo with format: https://zalo.me/phonenumber
        const zaloUrl = `https://zalo.me/${phoneNumber}`;
        window.open(zaloUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert(t('detail.zaloNotAvailable'));
      }
    } else {
      // Fallback: show alert if no Zalo number
      alert(t('detail.zaloNotAvailable'));
    }
  };

  // Check if girl is active - handle both boolean false and number 0 from API
  // API returns isActive as 0 (inactive) or 1 (active), or boolean false/true
  const isActiveValue = props.isActive as boolean | number | string | undefined;
  const isActive = isActiveValue !== false && isActiveValue !== 0 && isActiveValue !== '0' && isActiveValue !== null;
  const hasVerified = props.info?.['Người đánh giá'] || false;

  return (
    <div
      onClick={handleClick}
      className="girl-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        maxWidth: isMobile ? 'none' : '280px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-lg)'
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
      {/* Main Image Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: isMobile ? '260px' : '380px',
        overflow: 'hidden'
      }}>
        <img 
          src={img} 
          alt={name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }} 
        />
        
        {/* Badges Container - Top Left */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '4px' : 'var(--space-2)',
          left: isMobile ? '4px' : 'var(--space-2)',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: isMobile ? 'var(--space-1)' : 'var(--space-1)',
          zIndex: 2,
          flexWrap: 'wrap',
          maxWidth: isMobile ? 'calc(100% - 8px)' : 'auto'
        }}>
          {/* Pinned Badge */}
          {props.isPinned && (
            <div style={{
              background: 'linear-gradient(135deg, #ffb347, #ff7a00)',
              color: '#fff',
              padding: isMobile ? '2px 4px' : '4px 8px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? '8px' : 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              boxShadow: '0 2px 8px rgba(255, 179, 71, 0.4)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap'
            }}>
              {isMobile ? '📌' : '📌 GHIM'}
            </div>
          )}
          
          {/* Verified Badge */}
          {hasVerified && (
            <div style={{
              background: '#10b981',
              color: '#fff',
              padding: isMobile ? '2px 4px' : '4px 8px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? '8px' : 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap'
            }}>
              ✓ ĐÃ KIỂM ĐỊNH
            </div>
          )}
        </div>



        {/* Inactive Banner */}
        {!isActive && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            background: '#dc2626',
            color: '#fff',
            padding: isMobile ? 'var(--space-2) 0' : 'var(--space-3) 0',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            letterSpacing: 'var(--tracking-wider)',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
            textTransform: 'uppercase',
            pointerEvents: 'none'
          }}>
            TẠM NGHỈ
          </div>
        )}

        {/* Gradient Overlay for Text */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%)',
          padding: isMobile ? 'var(--space-2) var(--space-1) var(--space-1)' : 'var(--space-4) var(--space-3) var(--space-3)',
          zIndex: 2
        }}>
          {/* Name */}
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 'var(--font-bold)', 
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-xl)', 
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: isMobile ? '2px' : 'var(--space-1)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {name}
          </div>

          {/* Description/Area */}
          {props.description && (
            <div style={{ 
              color: '#fff', 
              fontFamily: 'var(--font-primary)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: isMobile ? 'var(--space-1)' : 'var(--space-2)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              opacity: 0.95,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {props.description}
            </div>
          )}

          {/* Price and Rating Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 'var(--space-1)' : 'var(--space-2)',
            marginBottom: isMobile ? 'var(--space-1)' : 'var(--space-2)',
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}>
            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}>
              <span style={{ 
                color: '#ff7a00', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-xl)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                {formatPriceVND(price).replace(' VND', '')}
              </span>
            </div>

            {/* Stars Rating */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1px'
            }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const value = Number(rating) || 0;
                const star = value >= i + 1 ? '★' : '☆';
                return (
                  <span key={i} style={{ 
                    color: value >= i + 1 ? '#ffb347' : '#666',
                    fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-lg)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    {star}
                  </span>
                );
              })}
            </div>
          </div>

          {/* View and Comment Metrics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 'var(--space-2)' : 'var(--space-3)',
            marginTop: isMobile ? 'var(--space-1)' : 'var(--space-2)',
            paddingTop: isMobile ? 'var(--space-1)' : 'var(--space-2)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Views */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                position: 'relative',
                width: isMobile ? '16px' : '18px',
                height: isMobile ? '16px' : '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Eye icon with thumbs up inside */}
                <svg width={isMobile ? '16' : '18'} height={isMobile ? '16' : '18'} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {/* Thumbs up inside eye */}
                <svg width={isMobile ? '8' : '9'} height={isMobile ? '8' : '9'} viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.9)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <path d="M7 22V11M2 13v2a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4.5a2.5 2.5 0 0 0-2.5-2.5c-.83 0-1.5.67-1.5 1.5V7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H7z"/>
                </svg>
              </div>
              <span style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'var(--font-primary)',
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                {props.viewed ? props.viewed.toLocaleString('vi-VN') : '5,000'}
              </span>
            </div>

            {/* Comments */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width={isMobile ? '16' : '18'} height={isMobile ? '16' : '18'} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'var(--font-primary)',
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                {props.reviewCount || props.reviews?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GirlCard; 