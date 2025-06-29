import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, User, CreateUserRequest, UpdateUserRequest, PaginatedResponse } from '../services/api';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    profile: {
      fullName: '',
      avatar: '',
      address: ''
    }
  });

  useEffect(() => {
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }
    loadUsers();
  }, [navigate, currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers(currentPage, 10, searchTerm);
      if (response.success && response.data) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createUser(formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          phone: '',
          role: 'user',
          profile: {
            fullName: '',
            avatar: '',
            address: ''
          }
        });
        loadUsers();
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user');
      console.error('Create user error:', err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updateData: UpdateUserRequest = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        profile: formData.profile
      };

      const response = await apiService.updateUser(selectedUser._id, updateData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        setError(response.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
      console.error('Update user error:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        loadUsers();
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error('Delete user error:', err);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await apiService.toggleUserStatus(userId);
      if (response.success) {
        loadUsers();
      } else {
        setError(response.message || 'Failed to toggle user status');
      }
    } catch (err) {
      setError('Failed to toggle user status');
      console.error('Toggle status error:', err);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
      profile: {
        fullName: user.profile?.fullName || '',
        avatar: user.profile?.avatar || '',
        address: user.profile?.address || ''
      }
    });
    setShowEditModal(true);
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
          Loading Users...
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
            color: '#667eea'
          }}>
            User Management
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3) var(--space-6)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          + Add User
        </button>
      </header>

      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto', 
        padding: 'var(--space-6)'
      }}>
        {/* Search Bar */}
        <div style={{ 
          marginBottom: 'var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: '#181a20',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              color: '#fff',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            background: '#ff5e62', 
            color: '#fff', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: 'var(--space-6)',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)'
          }}>
            {error}
          </div>
        )}

        {/* Users Table */}
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
                    color: '#667eea'
                  }}>
                    User
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Role
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Created
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div>
                        <div style={{ 
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-semibold)',
                          marginBottom: 'var(--space-1)'
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
                        {user.phone && (
                          <div style={{ 
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'var(--text-xs)',
                            color: '#d1d5db'
                          }}>
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ 
                        background: user.role === 'admin' ? '#ff7a00' : '#667eea',
                        color: '#fff',
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 'var(--font-medium)',
                        textTransform: 'uppercase'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        style={{
                          background: user.isActive ? '#43e97b' : '#ff5e62',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-1) var(--space-3)',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-medium)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ 
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'var(--text-xs)',
                        color: '#d1d5db'
                      }}>
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--space-2)', 
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => openEditModal(user)}
                          style={{
                            background: '#4facfe',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-1) var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-heading)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={{
                            background: '#ff5e62',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-1) var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-heading)',
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? '#374151' : '#667eea',
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? '#374151' : '#667eea',
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
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: '#181a20', 
            borderRadius: 'var(--radius-2xl)', 
            padding: 'var(--space-8)', 
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-6)',
              color: '#667eea'
            }}>
              Create New User
            </h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
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
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile?.fullName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, fullName: e.target.value}
                    })}
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
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-4)', 
                marginTop: 'var(--space-6)'
              }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-6)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: 'transparent',
                    color: '#d1d5db',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-6)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: '#181a20', 
            borderRadius: 'var(--radius-2xl)', 
            padding: 'var(--space-8)', 
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-6)',
              color: '#4facfe'
            }}>
              Edit User: {selectedUser.username}
            </h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
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
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile?.fullName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, fullName: e.target.value}
                    })}
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
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-4)', 
                marginTop: 'var(--space-6)'
              }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-6)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: 'transparent',
                    color: '#d1d5db',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-6)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 