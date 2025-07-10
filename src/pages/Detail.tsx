import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SignUp.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService, Review, User } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Type for the girl prop
type Girl = {
  _id?: string;
  id?: string | number;
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
  zalo?: string;
  phone?: string;
  description?: string;
  info?: Record<string, string>;
  images?: string[];
};

// Helper to mask phone number
function maskPhone(phone?: string) {
  if (!phone || phone.length < 4) return 'Anonymous';
  return phone.slice(0, -4) + 'xxxx';
}

const Detail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // Get girl data from location state (passed from main page)
  const girl: Girl = location.state?.girl || {
    name: 'LYLY GÁI GỌI',
    area: 'Dương Đông',
    price: '700.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1673897224148-32491ab112b6?fm=jpg&q=60&w=3000',
    zalo: '0965209115',
    phone: '0965209115',
    description: 'NHIỆT TÌNH - VUI VẺ',
    info: {
      'Người đánh giá': 'Ngọc Miu',
      'ZALO': '0965209115',
      'Giá qua đêm': '700.000 VND',
      'Giá phòng': '150.000 VND',
      'Năm sinh': '2005',
      'Khu vực': 'Dương Đông',
      'Chiều cao': '160cm',
      'Cân nặng': '46kg',
      'Số đo': '88,60,85',
    },
  };

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      const girlId = girl.id || girl._id;
      if (!girlId) {
        console.log('No girlId found');
        return;
      }
      try {
        console.log('Fetching reviews for girlId:', girlId);
        const res = await apiService.getReviews(girlId.toString());
        console.log('Review API response:', res);
        if (res.success && res.data) {
          setReviews(res.data.data);
          // User information is now included directly in the review data
          // No need to fetch user details separately
        }
      } catch (err) {
        setError(t('detail.cannotLoadReviews'));
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [girl.id, girl._id]);

  // Submit review
  const handleSubmitReview = async () => {
    if (!newReview.trim()) return;
    const girlId = girl.id || girl._id;
    if (!girlId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiService.createReview({
        girlId: girlId.toString(),
        rating: 5, // or allow user to select rating
        comment: newReview.trim(),
      });
      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        // User information should be included in the review response
        // No need to fetch user details separately
        setNewReview('');
      } else {
        setError(res.message || t('detail.submitReviewFailed'));
      }
    } catch (err) {
      setError(t('detail.submitReviewFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Zalo click
  const handleZaloClick = () => {
    // Get Zalo number from either the zalo field or the info object
    const zaloNumber = girl.zalo || girl.info?.ZALO;
    
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
    <div style={{ 
      background: '#232733', 
      flex: 1
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto', 
        padding: 'var(--space-6)',
        paddingTop: 'var(--space-8)'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginBottom: 'var(--space-6)', 
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-3) var(--space-4)', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-medium)', 
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            lineHeight: 'var(--leading-tight)',
            boxShadow: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          {t('detail.backToList')}
        </button>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)', 
          alignItems: 'flex-start', 
          marginBottom: 'var(--space-8)'
        }}>
          {/* Left: Main image and info */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            maxWidth: '400px',
            justifySelf: 'center',
            width: '100%'
          }}>
            <img src={girl.img} alt={girl.name} style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-2xl)', 
              marginBottom: 'var(--space-2)',
              boxShadow: 'var(--shadow-lg)'
            }} />
            <div style={{ 
              color: '#fff', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)', 
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-1)',
              wordBreak: 'break-word'
            }}>
              {girl.name}
            </div>
            <div style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)', 
              lineHeight: 'var(--leading-normal)',
              letterSpacing: 'var(--tracking-normal)',
              marginBottom: 'var(--space-3)'
            }}>
              {girl.area}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-1)', 
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const full = i + 1 <= Math.floor(girl.rating);
                const half = !full && i + 0.5 <= girl.rating;
                return (
                  <span key={i} style={{ 
                    color: '#ffb347', 
                    fontSize: 'var(--text-xl)',
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
                fontSize: 'var(--text-base)',
                marginLeft: '8px'
              }}>
                {Number(girl.rating || 0).toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-2)', 
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-2) var(--space-2)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-semibold)', 
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
                whiteSpace: 'nowrap',
                animation: 'colorChange 3s ease-in-out infinite'
              }}>
                {t('detail.quickPrice')} : {girl.price}
              </span>
            </div>
            <button style={{ 
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
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              width: '100%',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: 'buttonColorChange 4s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={handleZaloClick}
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
              {t('detail.meetGirlClickHere')}
            </button>
          </div>
          {/* Right: Details and comments */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            minWidth: '300px',
            width: '100%'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)', 
              marginBottom: 'var(--space-2)', 
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-1) var(--space-2)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
                whiteSpace: 'nowrap'
              }}>
                HOT
              </span>
              <span style={{ 
                color: '#ff7a00', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: 'var(--text-2xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                wordBreak: 'break-word'
              }}>
                {girl.name} - {girl.area} - {girl.description}
              </span>
            </div>
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ 
                color: '#fff', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-normal)'
              }}>
                {t('detail.checkerReviews')}
              </div>
              {error && <div style={{ color: '#ff5e62', marginBottom: 'var(--space-3)' }}>{error}</div>}
              {reviews.length === 0 && (
                <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: 'var(--space-3)' }}>
                  {t('detail.noReviews')}
                </div>
              )}
              {reviews.map((c, i) => (
                <div key={c._id || i} style={{ 
                  color: '#d1d5db', 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-base)', 
                  marginBottom: 'var(--space-2)',
                  lineHeight: 'var(--leading-relaxed)',
                  letterSpacing: 'var(--tracking-normal)'
                }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#6fa3ff'
                  }}>
                    {maskPhone(c.user?.phone || c.phone)}:
                  </span> {c.comment}
                </div>
              ))}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-3)', 
                marginTop: 'var(--space-2)',
                flexWrap: 'wrap'
              }}>
                <input 
                  placeholder={t('detail.enterYourReview')} 
                  style={{ 
                    flex: 1, 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: 'var(--space-3) var(--space-2)', 
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-base)',
                    background: '#232733',
                    color: '#fff',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    lineHeight: 'var(--leading-normal)',
                    letterSpacing: 'var(--tracking-normal)',
                    minWidth: '200px'
                  }}
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  disabled={submitting}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button 
                  style={{ 
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--space-3) var(--space-6)', 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-semibold)', 
                    fontSize: 'var(--text-base)', 
                    cursor: 'pointer',
                    lineHeight: 'var(--leading-tight)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  {submitting ? t('detail.sending') : t('detail.send')}
                </button>
              </div>
            </div>
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'var(--shadow-lg)',
              lineHeight: 'var(--leading-relaxed)',
              letterSpacing: 'var(--tracking-normal)'
            }}>
              {Object.entries(girl.info || {}).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 'var(--space-3)' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#ff7a00'
                  }}>
                    {key}:
                  </span> {value}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Image gallery */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: 'var(--text-xl)', 
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-normal)'
          }}>
            <span role="img" aria-label="camera">📷</span> {t('detail.girlPhotos')}
          </div>
          {girl.images && girl.images.length > 0 ? (
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-5)',
              justifyContent: 'left'
            }}>
              {girl.images.map((image, index) => (
                <img key={index} src={image} alt={`${girl.name} - ${t('detail.photo')} ${index + 1}`} style={{ 
                  width: '100%', 
                  aspectRatio: '1 / 1',
                  height: 'auto',
                  maxWidth: '200px',
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onClick={() => {
                  // Open image in new tab for full view
                  window.open(image, '_blank');
                }}
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-xl)', 
              padding: 'var(--space-8)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#d1d5db'
            }}>
              <div style={{ 
                fontSize: 'var(--text-4xl)', 
                marginBottom: 'var(--space-2)',
                opacity: 0.5
              }}>
                📷
              </div>
              <div style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                marginBottom: 'var(--space-2)',
                color: '#fff'
              }}>
                {t('detail.noDetailedPhotos')}
              </div>
              <div style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-base)',
                opacity: 0.7
              }}>
                {t('detail.detailedPhotosComingSoon')}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Detail; 