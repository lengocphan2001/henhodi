import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService, User, CreateUserRequest, UpdateUserRequest, PaginatedResponse } from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminUsers: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

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
      if (response.success && response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setUsers([]);
        setError(response.message || t('admin.failedToLoadUsers'));
      }
    } catch (err) {
      setUsers([]);
      setError(t('admin.failedToLoadUsers'));
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ username: '', email: '', phone: '', role: 'user', isActive: true });
    setShowCreateModal(true);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiService.createUser(formData as any);
      if (response.success) {
        setShowCreateModal(false);
        loadUsers();
      } else {
        setError(response.message || t('admin.failedToCreateUser'));
      }
    } catch (err) {
      setError(t('admin.failedToCreateUser'));
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    console.log('Selected user:', user);
    setFormData({
      ...user,
      phone: user.phone || '',
      fullName: user.profile?.fullName || ''
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'isActive' && type === 'checkbox') {
      setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked });
    } else if (name === 'fullName') {
      setFormData({ ...formData, fullName: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError('');
    try {
      const updatePayload = {
        ...selectedUser,
        ...formData,
        profile: {
          ...selectedUser.profile,
          fullName: formData.fullName || selectedUser.profile?.fullName || ''
        },
        phone: formData.phone
      };
      const response = await apiService.updateUser(updatePayload);
      if (response.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        setError(response.message || t('admin.failedToUpdateUser'));
      }
    } catch (err) {
      setError(t('admin.failedToUpdateUser'));
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setError('');
    try {
      const userId = String(selectedUser.id || selectedUser._id);
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        setError(response.message || t('admin.failedToDeleteUser'));
      }
    } catch (err) {
      setError(t('admin.failedToDeleteUser'));
    }
  };

  const handleToggleStatus = async (user: User) => {
    const userId = String(user.id || user._id);
    try {
      const response = await apiService.toggleUserStatus(userId);
      if (response.success) {
        loadUsers();
      } else {
        setError(response.message || t('admin.failedToToggleStatus'));
      }
    } catch (err) {
      setError(t('admin.failedToToggleStatus'));
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

  if (loading) {
    return (
      <div style={{ 
        background: '#232733', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 1
      }}>
        <div style={{ 
          color: '#fff', 
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          textAlign: 'center'
        }}>
          {t('admin.loadingUsers')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ 
          background: '#ff5e62', 
          color: '#fff', 
          padding: 'var(--space-2)', 
          borderRadius: 'var(--radius-sm)', 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          color: '#ff7a00',
          margin: 0
        }}>
          {t('admin.userManagement')}
        </h1>
        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-2) var(--space-4)',
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
          + {t('admin.addUser')}
        </button>
      </div>
      {/* Search Bar */}
      <div style={{ 
        marginBottom: 'var(--space-4)',
          display: 'flex',
          gap: 'var(--space-2)',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder={t('admin.searchUsersPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: '#181a20',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-2)',
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
          padding: 'var(--space-2)', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)'
          }}>
            {error}
          </div>
      )}

      {/* Users Table */}
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
                    color: '#667eea'
                  }}>
                    {t('admin.user')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.role')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.status')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.created')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: 'var(--space-2)' }}>
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
                    <td style={{ padding: 'var(--space-2)' }}>
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
                    <td style={{ padding: 'var(--space-2)' }}>
                      <button
                        onClick={() => handleToggleStatus(user)}
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
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {user.isActive ? '✅' : '❌'} {user.isActive ? t('admin.active') : t('admin.inactive')}
                      </button>
                    </td>
                    <td style={{ padding: 'var(--space-2)' }}>
                      <div style={{ 
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'var(--text-xs)',
                        color: '#d1d5db'
                      }}>
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-2)', textAlign: 'center' }}>
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
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ✏️ {t('admin.edit')}
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          style={{
                            background: '#ff5e62',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-1) var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-heading)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🗑️ {t('admin.delete')}
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
                padding: 'var(--space-2) var(--space-2)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              {t('admin.previous')}
            </button>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 'var(--space-2) var(--space-2)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              {t('admin.page')} {currentPage} {t('admin.of')} {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? '#374151' : '#667eea',
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
              {t('admin.next')}
            </button>
          </div>
        )}

      {/* CREATE MODAL */}
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
              {t('admin.createNewUser')}
            </h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    {t('admin.username')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleCreateChange}
                    name="username"
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
                    {t('admin.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleCreateChange}
                    name="email"
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
                    {t('admin.password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleCreateChange}
                    name="password"
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
                    {t('admin.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleCreateChange}
                    name="phone"
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
                    {t('admin.role')}
                  </label>
                  <select
                    value={formData.role}
                    onChange={handleCreateChange}
                    name="role"
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

              </div>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-2)', 
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
                  {t('admin.createUser')}
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
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
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
              {t('admin.editUser')}: {selectedUser?.username || ''}
            </h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    {t('admin.username')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username || ''}
                    onChange={handleEditChange}
                    name="username"
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
                    {t('admin.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={handleEditChange}
                    name="email"
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
                    {t('admin.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={handleEditChange}
                    name="phone"
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
                    {t('admin.role')}
                  </label>
                  <select
                    value={formData.role || 'user'}
                    onChange={handleEditChange}
                    name="role"
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive ?? true}
                      onChange={handleEditChange}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#4facfe'
                      }}
                    />
                    {t('admin.active')}
                  </label>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-2)', 
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
                  {t('admin.updateUser')}
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
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedUser && (
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
              color: '#ff5e62'
            }}>
              {t('admin.deleteUser')}: {selectedUser?.username || ''}
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              {t('admin.deleteUserConfirm')}
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-2)', 
              marginTop: 'var(--space-6)'
            }}>
              <button
                type="button"
                onClick={handleDeleteUser}
                style={{
                  background: 'linear-gradient(135deg, #ff5e62, #ff9a9e)',
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
                {t('admin.deleteUser')}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
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
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers; 