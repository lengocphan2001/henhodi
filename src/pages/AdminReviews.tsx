import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, Review, PaginatedResponse } from '../services/api';

const AdminReviews: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [girlFilter, setGirlFilter] = useState('');

  useEffect(() => {
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }
    loadReviews();
  }, [navigate, currentPage, searchTerm, girlFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReviews(girlFilter || undefined, currentPage, 10);
      if (response.success && response.data) {
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.message || 'Failed to load reviews');
      }
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Load reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await apiService.deleteReview(reviewId);
      if (response.success) {
        loadReviews();
      } else {
        setError(response.message || 'Failed to delete review');
      }
    } catch (err) {
      setError('Failed to delete review');
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
          Loading Reviews...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#232733',
      color: '#fff'
    }}>
      {/* Header */}
      <header style={{ 
        background: '#181a20', 
        padding: 'var(--space-6)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-4)'
        }}>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2) var(--space-4)',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              ← Back to Dashboard
            </button>
          </Link>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: '#4facfe'
          }}>
            Review Management
          </h1>
        </div>
      </header>

      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto', 
        padding: 'var(--space-6)'
      }}>
        {/* Info Section */}
        <div style={{ 
          background: '#181a20', 
          borderRadius: 'var(--radius-2xl)', 
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-4)',
            color: '#4facfe'
          }}>
            Review Management Dashboard
          </h2>
          <p style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
            color: '#d1d5db'
          }}>
            Manage user reviews and ratings. You can view, search, and delete reviews as needed.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            background: '#ff5e62', 
            color: '#fff', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: 'var(--space-6)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)'
          }}>
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div style={{ 
          background: '#181a20', 
          borderRadius: 'var(--radius-2xl)', 
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)'
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
                Search Reviews
              </label>
              <input
                type="text"
                placeholder="Search by comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#232733',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-lg)',
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
                Filter by Girl ID
              </label>
              <input
                type="text"
                placeholder="Enter girl ID to filter..."
                value={girlFilter}
                onChange={(e) => setGirlFilter(e.target.value)}
                style={{
                  width: '100%',
                  background: '#232733',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-lg)',
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
          borderRadius: 'var(--radius-2xl)', 
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
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    User
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    Girl ID
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    Rating
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    Comment
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    Date
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#4facfe'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div>
                        <div style={{ 
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-semibold)',
                          color: '#fff'
                        }}>
                          {review.user?.username || 'Unknown User'}
                        </div>
                        <div style={{ 
                          fontFamily: 'var(--font-primary)',
                          fontSize: 'var(--text-xs)',
                          color: '#d1d5db'
                        }}>
                          {review.user?.profile?.fullName || 'No name provided'}
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      color: '#d1d5db'
                    }}>
                      {review.girlId}
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)'
                    }}>
                      {renderStars(review.rating)}
                      <span style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: '#fff',
                        marginLeft: 'var(--space-2)'
                      }}>
                        {review.rating}
                      </span>
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      maxWidth: '300px'
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'var(--text-sm)',
                        color: '#d1d5db',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {review.comment}
                      </div>
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      color: '#d1d5db'
                    }}>
                      {formatDate(review.createdAt)}
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={{
                            background: '#ff5e62',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-2) var(--space-3)',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-xs)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                padding: 'var(--space-2) var(--space-4)',
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
              padding: 'var(--space-2) var(--space-4)',
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
                padding: 'var(--space-2) var(--space-4)',
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
            borderRadius: 'var(--radius-2xl)', 
            padding: 'var(--space-12)', 
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: 'var(--text-4xl)', 
              marginBottom: 'var(--space-4)',
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
      </div>
    </div>
  );
};

export default AdminReviews; 