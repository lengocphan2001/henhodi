import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService, Review, Girl, User } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { formatPriceVND } from '../utils/formatPrice';

const AdminReviews: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [girlFilter, setGirlFilter] = useState('');
  const [girlMap, setGirlMap] = useState<Record<string, Girl>>({});
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  useEffect(() => {
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, currentPage, searchTerm, girlFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReviews(girlFilter || undefined, currentPage, 10);
      if (response.success && response.data) {
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages);
        // Fetch all unique girls for this page
        const uniqueGirlIds = Array.from(new Set(response.data.data.map(r => r.girlId)));
        const girlResults = await Promise.all(uniqueGirlIds.map(id => apiService.getGirlById(id)));
        const girlMapTemp: Record<string, Girl> = {};
        uniqueGirlIds.forEach((id, idx) => {
          if (girlResults[idx].success && girlResults[idx].data) {
            girlMapTemp[id] = girlResults[idx].data as Girl;
          }
        });
        setGirlMap(girlMapTemp);
        // Fetch all unique users for this page
        const uniqueUserIds = Array.from(new Set(response.data.data.map(r => r.userId)));
        const userResults = await Promise.all(uniqueUserIds.map(id => apiService.getUserById(id)));
        const userMapTemp: Record<string, User> = {};
        uniqueUserIds.forEach((id, idx) => {
          if (userResults[idx].success && userResults[idx].data) {
            userMapTemp[id] = userResults[idx].data as User;
          }
        });
        setUserMap(userMapTemp);
      } else {
        setError(response.message || t('admin.failedToLoadReviews'));
      }
    } catch (err) {
      setError(t('admin.failedToLoadReviews'));
      console.error('Load reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm(t('admin.deleteReviewConfirm'))) return;

    try {
      const response = await apiService.deleteReview(reviewId);
      if (response.success) {
        loadReviews();
      } else {
        setError(response.message || t('admin.failedToDeleteReview'));
      }
    } catch (err) {
      setError(t('admin.failedToDeleteReview'));
      console.error('Delete review error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffb347' : '#374151' }}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          color: '#fff', 
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          textAlign: 'center'
        }}>
          {t('admin.loadingReviews')}
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <h1 style={{ 
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--font-bold)',
        color: '#ff7a00',
        marginBottom: 'var(--space-4)',
        margin: 0
      }}>
        {t('admin.reviewManagement')}
      </h1>

      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#ff5e62', 
          color: '#fff', 
          padding: 'var(--space-2)', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ 
        background: '#181a20', 
        borderRadius: 'var(--radius-sm)', 
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-2)'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                color: '#d1d5db'
              }}>
                {t('admin.searchReviews')}
              </label>
              <input
                type="text"
                placeholder={t('admin.searchReviewsPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#232733',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3)',
                  color: '#fff',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                color: '#d1d5db'
              }}>
                {t('admin.filterByGirlId')}
              </label>
              <input
                type="text"
                placeholder={t('admin.filterByGirlIdPlaceholder')}
                value={girlFilter}
                onChange={(e) => setGirlFilter(e.target.value)}
                style={{
                  width: '100%',
                  background: '#232733',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3)',
                  color: '#fff',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div style={{ 
          background: '#181a20', 
          borderRadius: 'var(--radius-sm)', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            overflowX: 'auto'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ 
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.user')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.girlId')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.rating')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.comment')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.date')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => {
                  const girl = girlMap[review.girlId];
                  const user = userMap[review.userId];
                  return (
                    <tr key={review._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: 'var(--space-2)' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#fff' }}>
                            {user?.username || review.user?.username || 'Unknown User'}
                          </div>
                          <div style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--text-xs)', color: '#d1d5db' }}>
                            {user?.fullName || user?.profile?.fullName || review.user?.profile?.fullName || 'No name provided'}
                          </div>
                          {user?.email && (
                            <div style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--text-xs)', color: '#d1d5db' }}>Email: {user.email}</div>
                          )}
                          {user?.phone && (
                            <div style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--text-xs)', color: '#d1d5db' }}>Phone: {user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-primary)', fontSize: 'var(--text-sm)', color: '#d1d5db' }}>
                        {girl ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{girl.name}</div>
                            <div style={{ fontSize: '12px' }}>ID: {girl._id || girl.id}</div>
                            {girl.phone && <div style={{ fontSize: '12px' }}>Phone: {girl.phone}</div>}
                            {girl.zalo && <div style={{ fontSize: '12px' }}>Zalo: {girl.zalo}</div>}
                            {girl.price && <div style={{ fontSize: '12px' }}>Price: {formatPriceVND(girl.price)}</div>}
                            {girl.area && <div style={{ fontSize: '12px' }}>Area: {girl.area}</div>}
                          </div>
                        ) : (
                          review.girlId
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        {renderStars(review.rating)}
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#fff', marginLeft: 'var(--space-2)' }}>
                          {review.rating}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-2)', maxWidth: '300px' }}>
                        <div style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--text-sm)', color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {review.comment}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-primary)', fontSize: 'var(--text-sm)', color: '#d1d5db' }}>
                        {formatDate(review.createdAt)}
                      </td>
                      <td style={{ padding: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            style={{
                              background: '#ff5e62',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              padding: 'var(--space-2) var(--space-3)',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-xs)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--space-2)', 
            marginTop: 'var(--space-6)' 
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? '#374151' : '#4facfe',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2) var(--space-2)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 'var(--space-2) var(--space-2)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? '#374151' : '#4facfe',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2) var(--space-2)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {reviews.length === 0 && !loading && (
          <div style={{ 
            background: '#181a20', 
            borderRadius: 'var(--radius-sm)', 
            padding: 'var(--space-12)', 
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: 'var(--text-4xl)', 
              marginBottom: 'var(--space-2)',
              color: '#4facfe'
            }}>
              ⭐
            </div>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)',
              color: '#fff'
            }}>
              No Reviews Found
            </h3>
            <p style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              There are no reviews matching your current filters.
            </p>
          </div>
        )}
    </AdminLayout>
  );
};

export default AdminReviews; 