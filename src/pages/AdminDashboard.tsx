import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService, User, Girl } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { formatPriceVND } from '../utils/formatPrice';

interface DashboardStats {
  totalUsers: number;
  totalGirls: number;
  totalReviews: number;
  activeUsers: number;
  activeGirls: number;
  recentUsers: User[];
  recentGirls: Girl[];
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }

    loadDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || t('admin.failedToLoadStats'));
      }
    } catch (err) {
      setError(t('admin.failedToLoadStatistics'));
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            textAlign: 'center'
          }}>
            {t('admin.loadingDashboard')}
          </div>
        </div>
      )}

      {error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ 
            color: '#ff5e62', 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--space-6)',
            color: '#ff7a00'
          }}>
            Dashboard
          </h1>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ 
                  fontSize: 'var(--text-3xl)', 
                  marginBottom: 'var(--space-2)'
                }}>
                  👥
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: '#667eea'
                }}>
                  {stats.totalUsers}
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#d1d5db'
                }}>
                  {t('admin.totalUsers')}
                </div>
              </div>

            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ 
                  fontSize: 'var(--text-3xl)', 
                  marginBottom: 'var(--space-2)'
                }}>
                  💃
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: '#f093fb'
                }}>
                  {stats.totalGirls}
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#d1d5db'
                }}>
                  {t('admin.totalGirls')}
                </div>
              </div>

            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ 
                  fontSize: 'var(--text-3xl)', 
                  marginBottom: 'var(--space-2)'
                }}>
                  ⭐
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: '#4facfe'
                }}>
                  {stats.totalReviews}
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#d1d5db'
                }}>
                  {t('admin.totalReviews')}
                </div>
              </div>

            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ 
                  fontSize: 'var(--text-3xl)', 
                  marginBottom: 'var(--space-2)'
                }}>
                  ✅
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: '#43e97b'
                }}>
                  {stats.activeUsers + stats.activeGirls}
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-sm)',
                  color: '#d1d5db'
                }}>
                  {t('admin.activeItems')}
                </div>
              </div>
            </div>

          {/* Recent Activity */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {/* Recent Users */}
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-2)',
                  color: '#667eea'
                }}>
                  {t('admin.recentUsers')}
                </h3>
                {stats.recentUsers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {stats.recentUsers.slice(0, 5).map((user, idx) => (
                      <div key={user._id || idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--space-2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div>
                          <div style={{ 
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {user.username}
                          </div>
                          <div style={{ 
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'var(--text-xs)',
                            color: '#d1d5db'
                          }}>
                            {user.email}
                          </div>
                        </div>
                        <span style={{ 
                          background: user.isActive ? '#43e97b' : '#ff5e62',
                          color: '#fff',
                          padding: 'var(--space-1) var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-medium)'
                        }}>
                          {user.isActive ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    color: '#d1d5db', 
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    padding: 'var(--space-2)'
                  }}>
                    {t('admin.noRecentUsers')}
                  </div>
                )}
              </div>

            {/* Recent Girls */}
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-sm)', 
              padding: 'var(--space-4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-2)',
                  color: '#f093fb'
                }}>
                  {t('admin.recentGirls')}
                </h3>
                {stats.recentGirls.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {stats.recentGirls.slice(0, 5).map((girl, idx) => (
                      <div key={girl._id || idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--space-2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div>
                          <div style={{ 
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {girl.name}
                          </div>
                          <div style={{ 
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'var(--text-xs)',
                            color: '#d1d5db'
                          }}>
                            {girl.area} • {formatPriceVND(girl.price)}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-1)'
                        }}>
                          <span style={{ color: '#ffb347' }}>★</span>
                          <span style={{ 
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {girl.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    color: '#d1d5db', 
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    padding: 'var(--space-2)'
                  }}>
                    {t('admin.noRecentGirls')}
                  </div>
                )}
              </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard; 