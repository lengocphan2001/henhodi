import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SignUp.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService, Review, User } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { formatPriceVND } from '../utils/formatPrice';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Get girl data from location state (passed from main page)
  const girl: Girl = location.state?.girl || {
    name: 'LYLY GÁI GỌI',
    area: 'Dương Đông',
    price: '700.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1673897224148-32491ab112b6?fm=jpg&q=60&w=3000',
    zalo: '0568369124',
    phone: '0568369124',
    description: 'NHIỆT TÌNH - VUI VẺ',
    info: {
      'Người đánh giá': 'Ngọc Miu',
      'ZALO': '0568369124',
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
  
  // Get stable girlId from location state
  const girlId = React.useMemo(() => {
    const g = location.state?.girl;
    return g?.id || g?._id || girl.id || girl._id;
  }, [location.state?.girl, girl.id, girl._id]);
  
  const girlIdStr = girlId ? girlId.toString() : null;
  
  // Increment view count - only once per girlId using sessionStorage
  useEffect(() => {
    if (!girlIdStr) {
      return;
    }
    
    // Use sessionStorage to track viewed girls in this session
    // This persists across React StrictMode double-mounts
    const storageKey = `viewed_girl_${girlIdStr}`;
    const hasViewed = sessionStorage.getItem(storageKey);
    
    if (hasViewed) {
      // Already incremented view for this girl in this session
      return;
    }
    
    // Mark as viewed immediately (synchronously) to prevent duplicate calls
    sessionStorage.setItem(storageKey, 'true');
    
    // Increment view count asynchronously
    apiService.incrementView(girlIdStr)
      .catch((err) => {
        console.error('Error incrementing view:', err);
        // Remove from sessionStorage on error so it can be retried
        sessionStorage.removeItem(storageKey);
      });
  }, [girlIdStr]);

  // Fetch reviews on mount - only once per girlId using sessionStorage
  useEffect(() => {
    if (!girlIdStr) {
      console.log('No girlId found');
      return;
    }
    
    // Use sessionStorage to track fetched reviews in this session
    // This persists across React StrictMode double-mounts
    const storageKey = `reviews_fetched_${girlIdStr}`;
    const hasFetched = sessionStorage.getItem(storageKey);
    
    if (hasFetched) {
      // Already fetched reviews for this girl in this session
      // Skip to prevent duplicate calls
      return;
    }
    
    // Mark as fetched immediately (synchronously) to prevent duplicate calls
    sessionStorage.setItem(storageKey, 'true');
    
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews for girlId:', girlIdStr);
        const res = await apiService.getReviews(girlIdStr);
        console.log('Review API response:', res);
        if (res.success && res.data) {
          setReviews(res.data.data);
        }
      } catch (err) {
        setError(t('detail.cannotLoadReviews'));
        console.error('Error fetching reviews:', err);
        // Remove from sessionStorage on error so it can be retried
        sessionStorage.removeItem(storageKey);
      }
    };
    
    fetchReviews();
  }, [girlIdStr, t]);

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
        padding: isMobile ? 'var(--space-3)' : 'var(--space-5)',
        paddingTop: isMobile ? 'var(--space-4)' : 'var(--space-6)'
      }}>
        {/* Breadcrumb */}
        <nav style={{ 
          marginBottom: isMobile ? 'var(--space-4)' : 'var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 'var(--space-1)' : 'var(--space-2)',
          flexWrap: 'wrap',
          lineHeight: '1.5'
        }}>
          <Link 
            to="/"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              lineHeight: '1.5'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: '1' }}>🏠</span>
            <span>Trang chủ</span>
          </Link>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: '1.5'
          }}>
            /
          </span>
          <Link 
            to="/"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: '1.5'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            Danh sách
          </Link>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: '1.5'
          }}>
            /
          </span>
          <span style={{
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            maxWidth: isMobile ? '150px' : '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: '1.5'
          }}>
            {girl.name}
          </span>
        </nav>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? 'var(--space-4)' : 'var(--space-6)', 
          alignItems: 'flex-start', 
          marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)'
        }}>
          {/* Left: Main image and info */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            maxWidth: '400px',
            justifySelf: 'center',
            width: '100%'
          }}>
            {/* HOT Badge and Title - Above image */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'start', 
              gap: 'var(--space-3)', 
              marginBottom: 'var(--space-2)', 
              flexWrap: 'nowrap'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-1) var(--space-2)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
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
                fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                wordBreak: 'break-word'
              }}>
                {girl.name} - {girl.area} - {girl.description}
              </span>
            </div>
            <img src={girl.img} alt={girl.name} style={{ 
              width: '100%', 
              height: isMobile ? '280px' : '360px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-xl)', 
              marginBottom: 'var(--space-2)',
              boxShadow: 'var(--shadow-md)'
            }} />
            <div style={{ 
              color: '#fff', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-1)',
              wordBreak: 'break-word',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {girl.name}
            </div>
            <div style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
              lineHeight: 'var(--leading-normal)',
              letterSpacing: 'var(--tracking-normal)',
              marginBottom: isMobile ? 'var(--space-1)' : 'var(--space-2)'
            }}>
              {girl.area}
            </div>
            {girl.description && (
              <div style={{ 
                color: '#fff', 
                fontFamily: 'var(--font-primary)',
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
                lineHeight: 'var(--leading-relaxed)',
                letterSpacing: 'var(--tracking-normal)',
                marginBottom: isMobile ? 'var(--space-2)' : 'var(--space-3)',
                opacity: 0.95,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)'
              }}>
                {girl.description}
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-1)', 
              marginBottom: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const value = Number(girl.rating) || 0;
                let star = '☆';
                if (value >= i + 1) star = '★';
                else if (value >= i + 0.5) star = '⯨';
                return (
                  <span key={i} style={{ 
                    color: '#ffb347', 
                    fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)',
                    textShadow: '0 1px 2px rgba(255, 179, 71, 0.3)'
                  }}>
                    {star}
                  </span>
                );
              })}
              <span style={{
                color: '#fff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                marginLeft: '6px'
              }}>
                {Number(girl.rating || 0).toFixed(1)}
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
                borderRadius: 'var(--radius-md)', 
                padding: isMobile ? 'var(--space-1) var(--space-2)' : 'var(--space-2) var(--space-3)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-semibold)', 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(255, 122, 0, 0.25)',
                whiteSpace: 'nowrap',
                animation: 'colorChange 3s ease-in-out infinite'
              }}>
                {t('detail.quickPrice')} : {formatPriceVND(girl.price)}
              </span>
            </div>
            <button style={{ 
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 'var(--radius-lg)', 
              padding: isMobile ? 'var(--space-2) 0' : 'var(--space-3) 0', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-semibold)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
              cursor: 'pointer',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              width: '100%',
              minHeight: isMobile ? '40px' : '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
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
                    width: isMobile ? '24px' : '28px', 
                    height: isMobile ? '24px' : '28px',
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
              gap: isMobile ? 'var(--space-3)' : 'var(--space-4)',
              minWidth: isMobile ? 'auto' : '300px',
              width: '100%'
            }}>
            {/* Mobile Tabs */}
            {isMobile ? (
              <>
                {/* Tab Buttons */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                  background: '#181a20',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-1)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <button
                    onClick={() => setActiveTab('info')}
                    style={{
                      flex: 1,
                      background: activeTab === 'info' 
                        ? 'linear-gradient(135deg, #ff7a00, #ff5e62)' 
                        : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--space-2)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-semibold)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Thông tin
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    style={{
                      flex: 1,
                      background: activeTab === 'reviews' 
                        ? 'linear-gradient(135deg, #ff7a00, #ff5e62)' 
                        : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--space-2)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-semibold)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Đánh giá
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                  <div style={{ 
                    background: '#181a20', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: 'var(--space-4)', 
                    color: '#fff', 
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-xs)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'var(--shadow-md)',
                    lineHeight: 'var(--leading-relaxed)',
                    letterSpacing: 'var(--tracking-normal)'
                  }}>
                    {Object.entries(girl.info || {}).map(([key, value]) => {
                      const displayValue = (key === 'Giá qua đêm' || key === 'Giá phòng' || key === 'Giá 1 lần') 
                        ? formatPriceVND(value as string)
                        : value;
                      
                      return (
                        <div key={key} style={{ marginBottom: 'var(--space-2)' }}>
                          <span style={{ 
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 'var(--font-semibold)',
                            color: '#ff7a00'
                          }}>
                            {key}:
                          </span> {displayValue}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div style={{ 
                    background: '#181a20', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: 'var(--space-4)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'var(--shadow-md)'
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
                        fontSize: 'var(--text-xs)', 
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
                      gap: 'var(--space-2)', 
                      marginTop: 'var(--space-3)',
                      flexWrap: 'wrap',
                      flexDirection: 'column'
                    }}>
                      <input 
                        placeholder={t('detail.enterYourReview')} 
                        style={{ 
                          width: '100%', 
                          borderRadius: 'var(--radius-sm)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)', 
                          padding: 'var(--space-2)', 
                          fontFamily: 'var(--font-primary)',
                          fontSize: 'var(--text-xs)',
                          background: '#232733',
                          color: '#fff',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          lineHeight: 'var(--leading-normal)',
                          letterSpacing: 'var(--tracking-normal)'
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
                          borderRadius: 'var(--radius-sm)', 
                          padding: 'var(--space-2)', 
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-semibold)', 
                          fontSize: 'var(--text-xs)', 
                          cursor: 'pointer',
                          lineHeight: 'var(--leading-tight)',
                          letterSpacing: 'var(--tracking-wide)',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                          width: '100%'
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
                )}
              </>
            ) : (
              <>
                {/* Desktop: Show both sections */}
                <div style={{ 
                  background: '#181a20', 
                  borderRadius: 'var(--radius-xl)', 
                  padding: 'var(--space-5)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: 'var(--shadow-md)'
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
                      fontSize: 'var(--text-sm)', 
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
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        padding: 'var(--space-3)', 
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'var(--text-sm)',
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
                        borderRadius: 'var(--radius-md)', 
                        padding: 'var(--space-3) var(--space-5)', 
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 'var(--font-semibold)', 
                        fontSize: 'var(--text-sm)', 
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
                  borderRadius: 'var(--radius-xl)', 
                  padding: 'var(--space-5)', 
                  color: '#fff', 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: 'var(--shadow-md)',
                  lineHeight: 'var(--leading-relaxed)',
                  letterSpacing: 'var(--tracking-normal)'
                }}>
                  {Object.entries(girl.info || {}).map(([key, value]) => {
                    const displayValue = (key === 'Giá qua đêm' || key === 'Giá phòng' || key === 'Giá 1 lần') 
                      ? formatPriceVND(value as string)
                      : value;
                    
                    return (
                      <div key={key} style={{ marginBottom: 'var(--space-2)' }}>
                        <span style={{ 
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-semibold)',
                          color: '#ff7a00'
                        }}>
                          {key}:
                        </span> {displayValue}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Image gallery */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
            marginBottom: 'var(--space-2)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-normal)'
          }}>
            <span role="img" aria-label="camera">📷</span> {t('detail.girlPhotos')}
          </div>
          {girl.images && girl.images.length > 0 ? (
            <div style={{ 
              position: 'relative',
              width: '100%',
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex',
                gap: isMobile ? 'var(--space-2)' : 'var(--space-3)',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ff7a00 transparent',
                paddingBottom: 'var(--space-2)'
              }}
              onScroll={(e) => {
                // Smooth scroll behavior
                e.currentTarget.scrollLeft = e.currentTarget.scrollLeft;
              }}
              >
                {girl.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      flex: '0 0 calc(33.333% - var(--space-2))',
                      minWidth: isMobile ? 'calc(33.333% - var(--space-2))' : 'calc(33.333% - var(--space-3))',
                      scrollSnapAlign: 'start',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      window.open(image, '_blank');
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${girl.name} - ${t('detail.photo')} ${index + 1}`} 
                      style={{ 
                        width: '100%', 
                        aspectRatio: '1 / 1',
                        height: 'auto',
                        objectFit: 'cover', 
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth > 768) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth > 768) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
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