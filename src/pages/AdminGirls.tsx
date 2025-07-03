import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, Girl, CreateGirlRequest, UpdateGirlRequest, PaginatedResponse } from '../services/api';

const AdminGirls: React.FC = () => {
  const navigate = useNavigate();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGirl, setSelectedGirl] = useState<Girl | null>(null);
  const [formData, setFormData] = useState<Partial<Girl>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [detailImages, setDetailImages] = useState<Array<{
    id: number;
    order: number;
    createdAt: string;
    url: string;
  }>>([]);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);
  const [uploadingDetailImages, setUploadingDetailImages] = useState(false);

  useEffect(() => {
    if (!apiService.isAdmin()) {
      navigate('/signin');
      return;
    }
    loadGirls();
  }, [navigate, currentPage, searchTerm]);

  const loadGirls = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGirls(currentPage, 10, searchTerm);
      console.log('loadGirls - response:', response);
      if (response.success && response.data && Array.isArray(response.data.data)) {
        console.log('Loaded girls:', response.data.data);
        console.log('First girl _id:', response.data.data[0]?._id);
        console.log('First girl _id type:', typeof response.data.data[0]?._id);
        console.log('First girl full object:', response.data.data[0]);
        
        // Check if all girls have _id
        const girlsWithoutId = response.data.data.filter(girl => !girl._id);
        if (girlsWithoutId.length > 0) {
          console.error('Girls without _id:', girlsWithoutId);
        }
        
        setGirls(response.data.data);
        setTotalPages(response.data.totalPages);
      } else if (response.success && response.message === 'Data not modified') {
        // Handle 304 response - data hasn't changed, keep current state
        console.log('Data not modified, keeping current state');
      } else {
        setGirls([]);
        setError(response.message || 'Failed to load girls');
      }
    } catch (err) {
      setGirls([]);
      setError('Failed to load girls');
      console.error('Load girls error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedDetailImages(files);
      
      // Create previews for all selected files
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setDetailImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      
      // Create FormData for the image
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Upload to a temporary endpoint that just returns the image URL
      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      if (data.success && data.data) {
        return data.data.url;
      }
      return null;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadDetailImages = async (girlId: string): Promise<string[]> => {
    console.log('uploadDetailImages called with girlId:', girlId);
    console.log('uploadDetailImages - typeof girlId:', typeof girlId);
    console.log('uploadDetailImages - girlId === "undefined":', girlId === 'undefined');
    
    if (!girlId || girlId === 'undefined' || girlId === 'null') {
      console.error('Invalid girlId:', girlId);
      setError('Invalid girl ID for detail image upload');
      return [];
    }
    
    if (selectedDetailImages.length === 0) return [];
    
    try {
      setUploadingDetailImages(true);
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < selectedDetailImages.length; i++) {
        const file = selectedDetailImages[i];
        console.log(`Uploading detail image ${i + 1}/${selectedDetailImages.length} for girl ${girlId}`);
        const response = await apiService.uploadDetailImage(girlId, file, i);
        
        if (response.success && response.data) {
          uploadedUrls.push(response.data.url);
        } else {
          console.error('Failed to upload detail image:', response.message);
        }
      }
      
      return uploadedUrls;
    } catch (err) {
      console.error('Upload detail images error:', err);
      setError('Failed to upload detail images');
      return [];
    } finally {
      setUploadingDetailImages(false);
    }
  };

  const loadDetailImages = async (girlId: string) => {
    try {
      const response = await apiService.getDetailImages(girlId);
      if (response.success && response.data) {
        setDetailImages(response.data);
      }
    } catch (err) {
      console.error('Load detail images error:', err);
    }
  };

  const deleteDetailImage = async (girlId: string, imageId: number) => {
    try {
      const response = await apiService.deleteDetailImage(girlId, imageId);
      if (response.success) {
        // Reload detail images
        await loadDetailImages(girlId);
      } else {
        setError(response.message || 'Failed to delete detail image');
      }
    } catch (err) {
      console.error('Delete detail image error:', err);
      setError('Failed to delete detail image');
    }
  };

  const openCreateModal = () => {
    setFormData({ 
      name: '', 
      area: '', 
      price: '', 
      phone: '', 
      zalo: '', 
      description: '', 
      img: '',
      rating: 0,
      isActive: true,
      info: {
        'Người đánh': '',
        'ZALO': '',
        'Giá 1 lần': '',
        'Giá phòng': '',
        'Năm sinh': '',
        'Khu vực': '',
        'Chiều cao': '',
        'Cân nặng': '',
        'Số đo': ''
      },
      images: []
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowCreateModal(true);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested info fields
    if (name.startsWith('info.')) {
      const fieldName = name.replace('info.', '');
      setFormData(prev => ({
        ...prev,
        info: {
          ...prev.info,
          [fieldName]: value
        } as Girl['info']
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreateGirl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Upload image first if selected
      let imageUrl = '';
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('Failed to upload image');
          return;
        }
      } else {
        // Use placeholder if no image selected
        imageUrl = 'https://via.placeholder.com/300x400?text=No+Image';
      }

      const girlData = {
        ...formData,
        img: imageUrl
      } as CreateGirlRequest;

      const response = await apiService.createGirl(girlData);
      if (response.success) {
        // Upload detail images if any were selected
        if (selectedDetailImages.length > 0 && response.data) {
          await uploadDetailImages(String(response.data._id));
        }
        
        setShowCreateModal(false);
        setSelectedImage(null);
        setImagePreview(null);
        setSelectedDetailImages([]);
        setDetailImagePreviews([]);
        loadGirls();
      } else {
        setError(response.message || 'Failed to create girl');
      }
    } catch (err) {
      console.error('Create girl error:', err);
      setError('Failed to create girl');
    }
  };

  const openEditModal = (girl: Girl) => {
    console.log('openEditModal - girl:', girl);
    console.log('openEditModal - girl._id:', girl._id);
    console.log('openEditModal - typeof girl._id:', typeof girl._id);
    
    setSelectedGirl(girl);
    const formDataWithInfo = { 
      ...girl,
      info: girl.info || {
        'Người đánh': '',
        'ZALO': '',
        'Giá 1 lần': '',
        'Giá phòng': '',
        'Năm sinh': '',
        'Khu vực': '',
        'Chiều cao': '',
        'Cân nặng': '',
        'Số đo': ''
      },
      images: girl.images || []
    };
    
    setFormData(formDataWithInfo);
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedDetailImages([]);
    setDetailImagePreviews([]);
    setShowEditModal(true);
    
    // Load detail images for this girl
    loadDetailImages(String(girl._id));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isActive' && type === 'checkbox') {
      setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked });
    } else if (name.startsWith('info.')) {
      const fieldName = name.replace('info.', '');
      setFormData(prev => {
        const newFormData = {
          ...prev,
          info: {
            ...prev.info,
            [fieldName]: value
          } as Girl['info']
        };
        return newFormData;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateGirl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGirl) return;
    setError('');
    
    console.log('handleUpdateGirl - selectedGirl:', selectedGirl);
    console.log('handleUpdateGirl - selectedGirl._id:', selectedGirl._id);
    console.log('handleUpdateGirl - selectedDetailImages.length:', selectedDetailImages.length);
    
    if (!selectedGirl._id) {
      console.error('selectedGirl._id is undefined or null');
      setError('Invalid girl ID for update');
      return;
    }
    
    try {
      // Upload image first if selected
      let imageUrl = formData.img;
      if (selectedImage) {
        const uploadedUrl = await apiService.uploadGirlImage(String(selectedGirl._id), selectedImage);
        if (uploadedUrl.success && uploadedUrl.data) {
          imageUrl = uploadedUrl.data.url;
        } else {
          setError('Failed to upload image');
          return;
        }
      }

      const girlData = {
        ...formData,
        img: imageUrl
      } as UpdateGirlRequest;

      const response = await apiService.updateGirl(selectedGirl._id, girlData);
      if (response.success) {
        // Upload detail images if any were selected
        if (selectedDetailImages.length > 0) {
          console.log('Uploading detail images for girl ID:', selectedGirl._id);
          await uploadDetailImages(String(selectedGirl._id));
        }
        
        setShowEditModal(false);
        setSelectedGirl(null);
        setSelectedImage(null);
        setImagePreview(null);
        setSelectedDetailImages([]);
        setDetailImagePreviews([]);
        loadGirls();
      } else {
        setError(response.message || 'Failed to update girl');
      }
    } catch (err) {
      console.error('Update girl error:', err);
      setError('Failed to update girl');
    }
  };

  const openDeleteModal = (girl: Girl) => {
    setSelectedGirl(girl);
    setShowDeleteModal(true);
  };

  const handleDeleteGirl = async () => {
    if (!selectedGirl) return;
    setError('');
    try {
      const girlId = String(selectedGirl._id);
      const response = await apiService.deleteGirl(girlId);
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedGirl(null);
        loadGirls();
      } else {
        setError(response.message || 'Failed to delete girl');
      }
    } catch (err) {
      setError('Failed to delete girl');
    }
  };

  const handleToggleStatus = async (girl: Girl) => {
    const girlId = String(girl._id);
    try {
      const response = await apiService.toggleGirlStatus(girlId);
      if (response.success) {
        loadGirls();
      } else {
        setError(response.message || 'Failed to toggle girl status');
      }
    } catch (err) {
      setError('Failed to toggle girl status');
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
          Loading Girls...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#232733',
        color: '#fff'
      }}>
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
              Girl Management
            </h1>
          </div>
          <button
            onClick={openCreateModal}
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
            + Add Girl
          </button>
        </header>

        <div style={{ 
          maxWidth: 'var(--container-xl)', 
          margin: '0 auto', 
          padding: 'var(--space-6)'
        }}>
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
            Girl Management
          </h1>
        </div>
        <button
          onClick={openCreateModal}
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
          + Add Girl
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
            placeholder="Search girls by name..."
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

        {/* Girls Table */}
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
                    Girl
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Area
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Price
                  </th>
                  <th style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    Rating
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
                {girls.map((girl) => (
                  <tr key={girl._id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <img 
                          src={girl.img} 
                          alt={girl.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: 'var(--radius-lg)',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <div style={{ 
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)',
                            color: '#fff'
                          }}>
                            {girl.name}
                          </div>
                          <div style={{ 
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'var(--text-xs)',
                            color: '#d1d5db'
                          }}>
                            {formatDate(girl.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      color: '#d1d5db'
                    }}>
                      {girl.area}
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: '#ffb347'
                    }}>
                      {girl.price}
                    </td>
                    <td style={{ 
                      padding: 'var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)'
                    }}>
                      <span style={{ color: '#ffb347' }}>★</span>
                      <span style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: '#fff'
                      }}>
                        {girl.rating}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <button
                        onClick={() => handleToggleStatus(girl)}
                        style={{
                          background: girl.isActive ? '#43e97b' : '#ff5e62',
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
                        {girl.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--space-2)', 
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => {
                            console.log('Edit button clicked for girl:', girl);
                            console.log('Girl _id:', girl._id);
                            console.log('Girl _id type:', typeof girl._id);
                            openEditModal(girl);
                          }}
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
                          onClick={() => openDeleteModal(girl)}
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
              Create New Girl
            </h2>
            <form onSubmit={handleCreateGirl}>
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
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleCreateChange}
                    name="name"
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
                    Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={handleCreateChange}
                    name="area"
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
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={handleCreateChange}
                    name="price"
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
                    Zalo
                  </label>
                  <input
                    type="text"
                    value={formData.zalo}
                    onChange={handleCreateChange}
                    name="zalo"
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
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
                  {imagePreview && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div style={{ 
                      marginTop: 'var(--space-2)', 
                      color: '#667eea',
                      fontSize: 'var(--text-xs)'
                    }}>
                      Uploading image...
                    </div>
                  )}
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
                    Detail Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
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
                  {detailImagePreviews.length > 0 && (
                    <div style={{ 
                      marginTop: 'var(--space-2)',
                      display: 'flex',
                      gap: 'var(--space-2)',
                      flexWrap: 'wrap'
                    }}>
                      {detailImagePreviews.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {uploadingDetailImages && (
                    <div style={{ 
                      marginTop: 'var(--space-2)', 
                      color: '#667eea',
                      fontSize: 'var(--text-xs)'
                    }}>
                      Uploading detail images...
                    </div>
                  )}
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
                    Người đánh
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Người đánh'] || ''}
                    onChange={handleCreateChange}
                    name="info.Người đánh"
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
                    Giá 1 lần
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá 1 lần'] || ''}
                    onChange={handleCreateChange}
                    name="info.Giá 1 lần"
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
                    Giá phòng
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá phòng'] || ''}
                    onChange={handleCreateChange}
                    name="info.Giá phòng"
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
                    Năm sinh
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Năm sinh'] || ''}
                    onChange={handleCreateChange}
                    name="info.Năm sinh"
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
                    Chiều cao
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Chiều cao'] || ''}
                    onChange={handleCreateChange}
                    name="info.Chiều cao"
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
                    Cân nặng
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Cân nặng'] || ''}
                    onChange={handleCreateChange}
                    name="info.Cân nặng"
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
                    Số đo
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Số đo'] || ''}
                    onChange={handleCreateChange}
                    name="info.Số đo"
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleCreateChange}
                    name="description"
                    rows={3}
                    style={{
                      width: '100%',
                      background: '#232733',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-3)',
                      color: '#fff',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                      resize: 'vertical'
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
                  Create Girl
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

      {/* EDIT MODAL */}
      {showEditModal && selectedGirl && (
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
              Edit Girl: {selectedGirl.name}
            </h2>
            <form onSubmit={handleUpdateGirl}>
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
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={handleEditChange}
                    name="name"
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
                    Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area || ''}
                    onChange={handleEditChange}
                    name="area"
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
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price || ''}
                    onChange={handleEditChange}
                    name="price"
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
                    Zalo
                  </label>
                  <input
                    type="text"
                    value={formData.zalo || ''}
                    onChange={handleEditChange}
                    name="zalo"
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
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
                  {imagePreview && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>
                  )}
                  {!imagePreview && formData.img && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <img 
                        src={formData.img} 
                        alt="Current" 
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div style={{ 
                      marginTop: 'var(--space-2)', 
                      color: '#667eea',
                      fontSize: 'var(--text-xs)'
                    }}>
                      Uploading image...
                    </div>
                  )}
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
                    Detail Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
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
                  {detailImagePreviews.length > 0 && (
                    <div style={{ 
                      marginTop: 'var(--space-2)',
                      display: 'flex',
                      gap: 'var(--space-2)',
                      flexWrap: 'wrap'
                    }}>
                      {detailImagePreviews.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {detailImages.length > 0 && (
                    <div style={{ 
                      marginTop: 'var(--space-2)',
                      display: 'flex',
                      gap: 'var(--space-2)',
                      flexWrap: 'wrap'
                    }}>
                      {detailImages.map((image) => (
                        <div key={image.id} style={{ position: 'relative' }}>
                          <img 
                            src={image.url} 
                            alt={`Detail ${image.order}`} 
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-lg)',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                          />
                          <button
                            onClick={() => deleteDetailImage(String(selectedGirl?._id), image.id)}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              background: '#ff5e62',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadingDetailImages && (
                    <div style={{ 
                      marginTop: 'var(--space-2)', 
                      color: '#667eea',
                      fontSize: 'var(--text-xs)'
                    }}>
                      Uploading detail images...
                    </div>
                  )}
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
                    Người đánh
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Người đánh'] || ''}
                    onChange={handleEditChange}
                    name="info.Người đánh"
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
                    Giá 1 lần
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá 1 lần'] || ''}
                    onChange={handleEditChange}
                    name="info.Giá 1 lần"
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
                    Giá phòng
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá phòng'] || ''}
                    onChange={handleEditChange}
                    name="info.Giá phòng"
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
                    Năm sinh
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Năm sinh'] || ''}
                    onChange={handleEditChange}
                    name="info.Năm sinh"
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
                    Chiều cao
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Chiều cao'] || ''}
                    onChange={handleEditChange}
                    name="info.Chiều cao"
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
                    Cân nặng
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Cân nặng'] || ''}
                    onChange={handleEditChange}
                    name="info.Cân nặng"
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
                    Số đo
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Số đo'] || ''}
                    onChange={handleEditChange}
                    name="info.Số đo"
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
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={handleEditChange}
                    name="description"
                    rows={3}
                    style={{
                      width: '100%',
                      background: '#232733',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-3)',
                      color: '#fff',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
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
                    Active
                  </label>
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
                  Update Girl
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

      {/* DELETE MODAL */}
      {showDeleteModal && selectedGirl && (
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
              Delete Girl: {selectedGirl.name}
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              Are you sure you want to delete this girl? This action cannot be undone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              marginTop: 'var(--space-6)'
            }}>
              <button
                type="button"
                onClick={handleDeleteGirl}
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
                Delete Girl
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGirls; 