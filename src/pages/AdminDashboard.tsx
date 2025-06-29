import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, User, Girl } from '../services/api';

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
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard stats');
      }
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/signin');
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
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
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
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #00c3ff, #ffb347, #ff5e62)', 
            borderRadius: '50%' 
          }}></div>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: '#ff7a00'
          }}>
            Admin Dashboard
          </h1>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-3)',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
            color: '#d1d5db'
          }}>
            Welcome, {apiService.getUser()?.username}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: '#ff5e62',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2) var(--space-4)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff4757';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ff5e62';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto', 
        padding: 'var(--space-6)'
      }}>
        {/* Navigation Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            >
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                marginBottom: 'var(--space-2)'
              }}>
                👥
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 'var(--space-2)'
              }}>
                User Management
              </h3>
              <p style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                opacity: 0.9
              }}>
                Manage users, roles, and permissions
              </p>
            </div>
          </Link>

          <Link to="/admin/girls" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb, #f5576c)', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            >
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                marginBottom: 'var(--space-2)'
              }}>
                💃
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 'var(--space-2)'
              }}>
                Girl Management
              </h3>
              <p style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                opacity: 0.9
              }}>
                Manage girls, profiles, and information
              </p>
            </div>
          </Link>

          <Link to="/admin/reviews" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            >
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                marginBottom: 'var(--space-2)'
              }}>
                ⭐
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 'var(--space-2)'
              }}>
                Review Management
              </h3>
              <p style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                opacity: 0.9
              }}>
                Manage reviews and ratings
              </p>
            </div>
          </Link>

          <Link to="/main" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            >
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                marginBottom: 'var(--space-2)'
              }}>
                🏠
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 'var(--space-2)'
              }}>
                View Site
              </h3>
              <p style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--text-sm)',
                opacity: 0.9
              }}>
                Go to main website
              </p>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        {stats && (
          <>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-6)',
              color: '#ff7a00'
            }}>
              Dashboard Statistics
            </h2>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)'
            }}>
              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-xl)', 
                padding: 'var(--space-5)', 
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
                  Total Users
                </div>
              </div>

              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-xl)', 
                padding: 'var(--space-5)', 
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
                  Total Girls
                </div>
              </div>

              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-xl)', 
                padding: 'var(--space-5)', 
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
                  Total Reviews
                </div>
              </div>

              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-xl)', 
                padding: 'var(--space-5)', 
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
                  Active Items
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              {/* Recent Users */}
              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-4)',
                  color: '#667eea'
                }}>
                  Recent Users
                </h3>
                {stats.recentUsers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {stats.recentUsers.slice(0, 5).map((user) => (
                      <div key={user._id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--space-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-lg)'
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
                          {user.isActive ? 'Active' : 'Inactive'}
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
                    padding: 'var(--space-4)'
                  }}>
                    No recent users
                  </div>
                )}
              </div>

              {/* Recent Girls */}
              <div style={{ 
                background: '#181a20', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-4)',
                  color: '#f093fb'
                }}>
                  Recent Girls
                </h3>
                {stats.recentGirls.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {stats.recentGirls.slice(0, 5).map((girl) => (
                      <div key={girl._id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--space-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-lg)'
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
                            {girl.area} • {girl.price}
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
                    padding: 'var(--space-4)'
                  }}>
                    No recent girls
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 