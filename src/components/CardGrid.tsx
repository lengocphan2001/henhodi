import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GirlCard from './GirlCard';
import { Girl } from '../services/api';
import { formatPriceVND } from '../utils/formatPrice';

interface CardGridProps {
  girls: Girl[];
}

const CardGrid: React.FC<CardGridProps> = ({ girls }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth <= 1024 && window.innerWidth > 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Find the girl with highest displayOrder for featured display (both mobile and PC)
  // Only show featured if there's at least one girl with displayOrder > 0
  const featuredGirl = girls.length > 0 
    ? (() => {
        const sorted = [...girls].sort((a, b) => {
          const aOrder = a.displayOrder || 0;
          const bOrder = b.displayOrder || 0;
          return bOrder - aOrder;
        });
        const topGirl = sorted[0];
        // Only feature if displayOrder > 0
        return (topGirl.displayOrder || 0) > 0 ? topGirl : null;
      })()
    : null;
  
  // Filter out featured girl from regular grid
  const regularGirls = featuredGirl
    ? girls.filter((girl, idx) => {
        // Use index as fallback if _id doesn't match
        const girlId = girl._id || girl.id || idx;
        const featuredId = featuredGirl._id || featuredGirl.id || girls.indexOf(featuredGirl);
        return girlId !== featuredId;
      })
    : girls;
  
  return (
    <div style={{
      maxWidth: 'var(--container-xl)',
      margin: '0 auto',
      marginBottom: isMobile ? 'var(--space-8)' : 'var(--space-10)',
      padding: '0',
    }}>
      {/* Featured Girl - Different layout for Mobile and PC */}
      {featuredGirl && (
        isMobile ? (
          <FeaturedCard girl={featuredGirl} />
        ) : (
          <FeaturedCardPC girl={featuredGirl} />
        )
      )}
      
      {/* Regular Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : isTablet
            ? 'repeat(auto-fill, minmax(260px, 1fr))' 
            : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? 'var(--space-1)' : 'var(--space-3)',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {regularGirls.map((girl, idx) => (
          <div key={idx} style={{ 
            width: '100%', 
            maxWidth: isMobile ? 'none' : '280px',
            justifySelf: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <GirlCard {...girl} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Featured Card Component for Mobile
const FeaturedCard: React.FC<{ girl: Girl }> = ({ girl }) => {
  const navigate = useNavigate();
  const [isMobile] = React.useState(window.innerWidth <= 768);
  
  const handleClick = () => {
    navigate('/detail', { state: { girl } });
  };


  const isActiveValue = girl.isActive as boolean | number | string | undefined;
  const isActive = isActiveValue !== false && isActiveValue !== 0 && isActiveValue !== '0' && isActiveValue !== null;
  const hasVerified = girl.info?.['Người đánh giá'] || false;

  return (
    <div style={{
      marginBottom: 'var(--space-4)',
      padding: '0'
    }}>
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          background: '#181a20',
          boxShadow: '0 8px 24px rgba(255, 122, 0, 0.4), 0 0 0 3px rgba(255, 122, 0, 0.3)',
          animation: 'pulse 2s ease-in-out infinite',
          cursor: 'pointer'
        }}
      >
        {/* Featured Badge */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-2)',
          right: 'var(--space-2)',
          background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
          color: '#fff',
          padding: '2px 4px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-heading)',
          fontSize: '8px',
          fontWeight: 'var(--font-bold)',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(255, 122, 0, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          whiteSpace: 'nowrap'
        }}>
          ⭐ NỔI BẬT
        </div>

        {/* Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          overflow: 'hidden'
        }}>
          <img 
            src={girl.img} 
            alt={girl.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center'
            }}
          />
          
          {/* Badges on Image */}
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            left: 'var(--space-2)',
            display: 'flex',
            flexDirection: 'row',
            gap: 'var(--space-1)',
            zIndex: 2,
            flexWrap: 'wrap'
          }}>
            {girl.isPinned && (
              <div style={{
                background: 'linear-gradient(135deg, #ffb347, #ff7a00)',
                color: '#fff',
                padding: '2px 4px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: '8px',
                fontWeight: 'var(--font-bold)',
                boxShadow: '0 2px 8px rgba(255, 179, 71, 0.4)',
                lineHeight: '1.2',
                whiteSpace: 'nowrap'
              }}>
                📌
              </div>
            )}
            {hasVerified && (
              <div style={{
                background: '#10b981',
                color: '#fff',
                padding: '2px 4px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: '8px',
                fontWeight: 'var(--font-bold)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                lineHeight: '1.2',
                whiteSpace: 'nowrap'
              }}>
                ✓ Đã kiểm định
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
              padding: 'var(--space-2) 0',
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              zIndex: 10,
              textTransform: 'uppercase'
            }}>
              TẠM NGHỈ
            </div>
          )}

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%)',
            padding: 'var(--space-4) var(--space-3) var(--space-2)',
            zIndex: 2
          }}>
            <div style={{
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)',
              fontSize: 'var(--text-lg)',
              marginBottom: 'var(--space-1)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {girl.name}
            </div>
            <div style={{
              color: '#ff7a00',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-1)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>
              {girl.area}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          padding: 'var(--space-3)',
          background: '#181a20'
        }}>
          {/* HOT Badge and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
              color: '#fff',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              textTransform: 'uppercase'
            }}>
              HOT
            </span>
            <span style={{
              color: '#ff7a00',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-bold)'
            }}>
              {girl.name} - {girl.area}
            </span>
          </div>

          {/* Description */}
          {girl.description && (
            <div style={{
              color: '#d1d5db',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-xs)',
              lineHeight: 'var(--leading-normal)',
              marginBottom: 'var(--space-2)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {girl.description}
            </div>
          )}

          {/* Service Badges */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
            flexWrap: 'wrap'
          }}>
            {hasVerified && (
              <span style={{
                background: '#10b981',
                color: '#fff',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)'
              }}>
                UY TÍN
              </span>
            )}
            {girl.info?.['Giá qua đêm'] && (
              <span style={{
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
                color: '#fff',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)'
              }}>
                QUA ĐÊM
              </span>
            )}
          </div>

          {/* Price and Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span style={{ color: '#4facfe', fontSize: 'var(--text-base)' }}>💰</span>
              <span style={{
                color: '#ff7a00',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-bold)'
              }}>
                {formatPriceVND(girl.price)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const value = Number(girl.rating) || 0;
                return (
                  <span key={i} style={{
                    color: value >= i + 1 ? '#ffb347' : '#666',
                    fontSize: 'var(--text-base)'
                  }}>
                    {value >= i + 1 ? '★' : '☆'}
                  </span>
                );
              })}
              <span style={{
                color: '#d1d5db',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                marginLeft: 'var(--space-1)'
              }}>
                {Number(girl.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: '#d1d5db',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-2)'
          }}>
            <span style={{ color: '#4facfe', fontSize: 'var(--text-sm)' }}>📍</span>
            <span>{girl.area}, Phú Quốc</span>
          </div>

          {/* View and Comment Metrics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-2)',
            paddingTop: 'var(--space-2)',
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
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Eye icon with thumbs up inside */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {/* Thumbs up inside eye */}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.9)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <path d="M7 22V11M2 13v2a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4.5a2.5 2.5 0 0 0-2.5-2.5c-.83 0-1.5.67-1.5 1.5V7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H7z"/>
                </svg>
              </div>
              <span style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
              }}>
                {girl.viewed ? girl.viewed.toLocaleString('vi-VN') : '5,000'}
              </span>
            </div>

            {/* Comments */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
              }}>
                {girl.reviewCount || girl.reviews?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Card Component for PC - Horizontal Layout (Image Left, Info Right)
const FeaturedCardPC: React.FC<{ girl: Girl }> = ({ girl }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    navigate('/detail', { state: { girl } });
  };


  const isActiveValue = girl.isActive as boolean | number | string | undefined;
  const isActive = isActiveValue !== false && isActiveValue !== 0 && isActiveValue !== '0' && isActiveValue !== null;
  const hasVerified = girl.info?.['Người đánh giá'] || false;

  return (
    <div style={{
      marginBottom: 'var(--space-6)',
      padding: '0',
      display: 'flex',
      justifyContent: 'flex-start'
    }}>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          background: '#181a20',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(255, 122, 0, 0.4), 0 0 0 3px rgba(255, 122, 0, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 122, 0, 0.2)',
          width: 'fit-content',
          maxWidth: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 122, 0, 0.5), 0 0 0 4px rgba(255, 122, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 122, 0, 0.4), 0 0 0 3px rgba(255, 122, 0, 0.3)';
        }}
      >
        {/* Image Section - Left Side */}
        <div style={{
          position: 'relative',
          width: '280px',
          minWidth: '280px',
          height: '280px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img 
            src={girl.img} 
            alt={girl.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Badges on Image */}
          <div style={{
            position: 'absolute',
            top: 'var(--space-3)',
            left: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            zIndex: 2
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
              color: '#fff',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              whiteSpace: 'nowrap'
            }}>
              ⭐ NỔI BẬT
            </div>
            {girl.isPinned && (
              <div style={{
                background: 'linear-gradient(135deg, #ffb347, #ff7a00)',
                color: '#fff',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                boxShadow: '0 2px 8px rgba(255, 179, 71, 0.4)',
                whiteSpace: 'nowrap'
              }}>
                📌 GHIM
              </div>
            )}
            {hasVerified && (
              <div style={{
                background: '#10b981',
                color: '#fff',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
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
              padding: 'var(--space-3) 0',
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              zIndex: 10,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)'
            }}>
              TẠM NGHỈ
            </div>
          )}
        </div>

        {/* Info Section - Right Side */}
        <div style={{
          width: '400px',
          maxWidth: '400px',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #181a20 0%, #1a1d26 100%)'
        }}>
          {/* Top Section */}
          <div>
            {/* HOT Badge and Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
                color: '#fff',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-bold)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)'
              }}>
                HOT
              </span>
              <span style={{
                color: '#ff7a00',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                letterSpacing: 'var(--tracking-tight)'
              }}>
                {girl.name} {girl.zalo ? `- ${girl.zalo}` : ''}
              </span>
            </div>

            {/* Description */}
            {girl.description && (
              <div style={{
                color: '#d1d5db',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-3)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {girl.description}
              </div>
            )}

            {/* Service Badges */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              {hasVerified && (
                <span style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  textTransform: 'uppercase'
                }}>
                  UY TÍN
                </span>
              )}
              {girl.info?.['Giá qua đêm'] && (
                <span style={{
                  background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
                  color: '#fff',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  textTransform: 'uppercase'
                }}>
                  QUA ĐÊM
                </span>
              )}
              {girl.info?.['Giá phòng'] && (
                <span style={{
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  color: '#fff',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  textTransform: 'uppercase'
                }}>
                  SHIP
                </span>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div>
            {/* Price and Rating Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <span style={{ 
                  color: '#ff7a00', 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-bold)', 
                  fontSize: 'var(--text-xl)'
                }}>
                  {formatPriceVND(girl.price).replace(' VND', '')}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = Number(girl.rating) || 0;
                  return (
                    <span key={i} style={{
                      color: value >= i + 1 ? '#ffb347' : '#666',
                      fontSize: 'var(--text-lg)'
                    }}>
                      {value >= i + 1 ? '★' : '☆'}
                    </span>
                  );
                })}
                <span style={{
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  marginLeft: 'var(--space-1)'
                }}>
                  {Number(girl.rating || 0).toFixed(1)}
                </span>
                <span style={{
                  color: '#d1d5db',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  marginLeft: 'var(--space-2)'
                }}>
                  {girl.reviewCount || girl.reviews?.length || 0} Review
                </span>
              </div>
            </div>

            {/* Location and Metrics */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap',
              gap: 'var(--space-2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: '#d1d5db',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)'
              }}>
                <span style={{ color: '#4facfe', fontSize: 'var(--text-base)' }}>📍</span>
                <span>{girl.area}, Phú Quốc</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#d1d5db',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{girl.viewed ? girl.viewed.toLocaleString('vi-VN') : '5,000'}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#d1d5db',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{girl.reviewCount || girl.reviews?.length || 0}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGrid; 