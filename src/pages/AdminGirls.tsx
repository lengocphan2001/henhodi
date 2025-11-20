import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService, Girl, CreateGirlRequest, UpdateGirlRequest, PaginatedResponse } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { formatPriceVND } from '../utils/formatPrice';

const AdminGirls: React.FC = () => {
  const { t } = useTranslation();
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
      console.log('LoadGirls response:', response);
      if (response.success && response.data && Array.isArray(response.data.data)) {
        console.log('Girls data:', response.data.data);
        // Log each girl's image info
        response.data.data.forEach((girl, index) => {
          console.log(`Girl ${index + 1}:`, {
            id: girl._id,
            name: girl.name,
            img: girl.img,
            img_url: (girl as any).img_url // Log the raw img_url field
          });
        });
        setGirls(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setGirls([]);
        setError(response.message || t('admin.failedToLoadGirls'));
      }
    } catch (err) {
      setGirls([]);
      setError(t('admin.failedToLoadGirls'));
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

  const uploadDetailImages = async (girlId: string): Promise<string[]> => {
    console.log('uploadDetailImages called with girlId:', girlId);
    console.log('uploadDetailImages - typeof girlId:', typeof girlId);
    console.log('uploadDetailImages - girlId === "undefined":', girlId === 'undefined');
    console.log('uploadDetailImages - girlId === "null":', girlId === 'null');
    console.log('uploadDetailImages - girlId === "":', girlId === '');
    console.log('uploadDetailImages - selectedDetailImages.length:', selectedDetailImages.length);
    
    if (!girlId || girlId === 'undefined' || girlId === 'null' || girlId === '') {
      console.error('Invalid girlId:', girlId);
      setError('Invalid girl ID for detail image upload');
      return [];
    }
    
    if (selectedDetailImages.length === 0) {
      console.log('No detail images selected, skipping upload');
      return [];
    }
    
    try {
      setUploadingDetailImages(true);
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < selectedDetailImages.length; i++) {
        const file = selectedDetailImages[i];
        console.log(`Uploading detail image ${i + 1}/${selectedDetailImages.length} for girl ${girlId}`);
        console.log('File info:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        const response = await apiService.uploadDetailImage(girlId, file, i);
        console.log('Upload response:', response);
        
        if (response.success && response.data) {
          uploadedUrls.push(response.data.url);
          console.log('Successfully uploaded detail image:', response.data.url);
        } else {
          console.error('Failed to upload detail image:', response.message);
          setError(`Failed to upload detail image ${i + 1}: ${response.message}`);
        }
      }
      
      console.log('All detail images uploaded:', uploadedUrls);
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
      isPinned: false,
      displayOrder: 0,
      info: {
        'Người đánh giá': '',
        'ZALO': '',
        'Giá qua đêm': '',
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
    } else if (name === 'rating') {
      setFormData({ ...formData, rating: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreateGirl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Ensure info object has ZALO and Khu vực populated from top-level fields
      const updatedInfo = {
        ...formData.info,
        'ZALO': formData.zalo || '',
        'Khu vực': formData.area || ''
      };

      // Create girl first with placeholder image
      const girlData = {
        ...formData,
        info: updatedInfo,
        img: 'https://via.placeholder.com/300x400?text=No+Image' // Start with placeholder
      } as CreateGirlRequest;

      console.log('Creating girl with data:', girlData);
      const response = await apiService.createGirl(girlData);
      if (response.success && response.data) {
        const createdGirlId = response.data._id || response.data.id;
        console.log('Girl created with ID:', createdGirlId);
        console.log('Created girl data:', response.data);
        
        // Upload main image if selected
        if (selectedImage) {
          console.log('Uploading main image for new girl');
          const uploadedUrl = await apiService.uploadGirlImage(String(createdGirlId), selectedImage);
          console.log('Upload response:', uploadedUrl);
          if (!uploadedUrl.success) {
            console.error('Failed to upload main image:', uploadedUrl.message);
            setError('Girl created but failed to upload main image');
            return;
          }
          console.log('Image uploaded successfully, URL:', uploadedUrl.data?.url);
        }
        
        // Upload detail images if any were selected
        if (selectedDetailImages.length > 0) {
          console.log('Uploading detail images for new girl');
          await uploadDetailImages(String(createdGirlId));
        }
        
        console.log('All uploads completed, reloading girls list...');
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
    console.log('openEditModal - girl.id:', girl.id);
    console.log('openEditModal - typeof girl._id:', typeof girl._id);
    
    setSelectedGirl(girl);
    const formDataWithInfo = { 
      ...girl,
      info: girl.info || {
        'Người đánh giá': '',
        'ZALO': '',
        'Giá qua đêm': '',
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
    const girlId = girl._id || girl.id;
    if (girlId) {
      console.log('openEditModal - loading detail images for girlId:', girlId);
      loadDetailImages(String(girlId));
    } else {
      console.error('openEditModal - no valid girl ID found');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isActive' && type === 'checkbox') {
      setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked });
    } else if (name === 'isPinned' && type === 'checkbox') {
      setFormData({ ...formData, isPinned: (e.target as HTMLInputElement).checked });
    } else if (name === 'displayOrder') {
      setFormData({ ...formData, displayOrder: Number(value) || 0 });
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
    } else if (name === 'rating') {
      setFormData({ ...formData, rating: Number(value) });
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
    console.log('handleUpdateGirl - selectedGirl.id:', selectedGirl.id);
    console.log('handleUpdateGirl - selectedDetailImages.length:', selectedDetailImages.length);
    
    // Get the girl ID, trying both _id and id properties
    const girlId = selectedGirl._id || selectedGirl.id;
    
    if (!girlId) {
      console.error('selectedGirl._id and selectedGirl.id are both undefined or null');
      setError('Invalid girl ID for update');
      return;
    }
    
    console.log('handleUpdateGirl - using girlId:', girlId);
    
    try {
      // Ensure info object has ZALO and Khu vực populated from top-level fields
      const updatedInfo = {
        ...formData.info,
        'ZALO': formData.zalo || '',
        'Khu vực': formData.area || ''
      };

      // Upload image first if selected
      let imageUrl = formData.img;
      if (selectedImage) {
        const uploadedUrl = await apiService.uploadGirlImage(String(girlId), selectedImage);
        if (uploadedUrl.success && uploadedUrl.data) {
          imageUrl = uploadedUrl.data.url;
        } else {
          setError('Failed to upload image');
          return;
        }
      }

      const girlData = {
        ...formData,
        info: updatedInfo,
        img: imageUrl
      } as UpdateGirlRequest;

      const response = await apiService.updateGirl(String(girlId), girlData);
      if (response.success) {
        // Upload detail images if any were selected
        if (selectedDetailImages.length > 0) {
          console.log('Uploading detail images for girl ID:', girlId);
          await uploadDetailImages(String(girlId));
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
          {t('admin.loadingGirls')}
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
          {t('admin.girlManagement')}
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
          + {t('admin.addGirl')}
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
            placeholder={t('admin.searchGirlsPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: '#181a20',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2) var(--space-3)',
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

      {/* Girls Table */}
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
                    {t('admin.girl')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.area')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.price')}
                  </th>
                  <th style={{ 
                    padding: 'var(--space-2)', 
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#667eea'
                  }}>
                    {t('admin.rating')}
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
                {girls.map((girl) => (
                  <tr key={girl._id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: 'var(--space-2)' }}>
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
                      padding: 'var(--space-2)',
                      fontFamily: 'var(--font-primary)',
                      fontSize: 'var(--text-sm)',
                      color: '#d1d5db'
                    }}>
                      {girl.area}
                    </td>
                    <td style={{ 
                      padding: 'var(--space-2)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: '#ffb347'
                    }}>
                      {formatPriceVND(girl.price)}
                    </td>
                    <td style={{ 
                      padding: 'var(--space-2)',
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
                    <td style={{ padding: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {girl.isActive ? '✅' : '❌'} {girl.isActive ? t('admin.active') : t('admin.inactive')}
                        </button>
                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'var(--text-xs)',
                          color: '#d1d5db',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          📍 Vị trí: {girl.displayOrder || 0}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-2)', textAlign: 'center' }}>
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
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ✏️ {t('admin.edit')}
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
              {t('admin.createNewGirl')}
            </h2>
            <form onSubmit={handleCreateGirl}>
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
                    {t('admin.name')} *
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
                    {t('admin.area')} *
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
                    {t('admin.price')} *
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
                    {t('admin.zalo')}
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
                    {t('admin.image')}
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
                        src={imagePreview || ''} 
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
                    Người đánh giá
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Người đánh giá'] || ''}
                    onChange={handleCreateChange}
                    name="info.Người đánh giá"
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
                    Giá qua đêm
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá qua đêm'] || ''}
                    onChange={handleCreateChange}
                    name="info.Giá qua đêm"
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
                    {t('admin.description')}
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
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    {t('admin.rating')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={formData.rating}
                    onChange={handleCreateChange}
                    name="rating"
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
                    📍 Vị trí xuất hiện (số càng lớn, xuất hiện càng trước)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder ?? 0}
                    onChange={handleCreateChange}
                    name="displayOrder"
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
                  <div style={{
                    marginTop: 'var(--space-1)',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-xs)',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Gợi ý: 0 = bình thường, 1-10 = ưu tiên, 10+ = rất ưu tiên
                  </div>
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
                  {t('admin.createGirl')}
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
              {t('admin.editGirl')}: {selectedGirl?.name || ''}
            </h2>
            <form onSubmit={handleUpdateGirl}>
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
                    {t('admin.name')} *
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
                    {t('admin.area')} *
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
                        src={imagePreview || ''} 
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
                    Người đánh giá
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Người đánh giá'] || ''}
                    onChange={handleEditChange}
                    name="info.Người đánh giá"
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
                    Giá qua đêm
                  </label>
                  <input
                    type="text"
                    value={formData.info?.['Giá qua đêm'] || ''}
                    onChange={handleEditChange}
                    name="info.Giá qua đêm"
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
                    {t('admin.description')}
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
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#d1d5db'
                  }}>
                    📍 Vị trí xuất hiện (số càng lớn, xuất hiện càng trước)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder ?? 0}
                    onChange={handleEditChange}
                    name="displayOrder"
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
                  <div style={{
                    marginTop: 'var(--space-1)',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-xs)',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Gợi ý: 0 = bình thường, 1-10 = ưu tiên, 10+ = rất ưu tiên
                  </div>
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
                    {t('admin.rating')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={formData.rating}
                    onChange={handleEditChange}
                    name="rating"
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
              {t('admin.deleteGirl')}: {selectedGirl?.name || ''}
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-sm)',
              color: '#d1d5db'
            }}>
              {t('admin.deleteGirlConfirm')}
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-2)', 
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
                {t('admin.deleteGirl')}
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

export default AdminGirls; 