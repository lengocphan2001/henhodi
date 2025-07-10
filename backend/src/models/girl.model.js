import db from '../db.js';

export const getAllGirls = async (page = 1, limit = 10, search = '', area = '') => {
  let query = 'SELECT id, name, area, price, rating, img_url, zalo, phone, description, isActive, info, images, created_at, updated_at FROM girls WHERE 1=1';
  const params = [];
  
  // Add search filter
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  // Add area filter
  if (area) {
    query += ' AND area LIKE ?';
    params.push(`%${area}%`);
  }
  
  // Add ordering
  query += ' ORDER BY created_at DESC';
  
  // Add pagination
  const offset = (page - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const [rows] = await db.query(query, params);
  
  // Get detail images for each girl
  const girlsWithDetailImages = await Promise.all(rows.map(async (row) => {
    // Get detail images for this girl
    const detailImages = await getDetailImages(row.id);
    const detailImageUrls = detailImages.map(img => img.url);
    
    // Determine the image URL
    let imgUrl;
    if (row.img_url && row.img_url.trim() !== '') {
      // If img_url is set, use it
      imgUrl = row.img_url;
    } else {
      // If no img_url, check if there's a BLOB image
      const imageBuffer = await getGirlImage(row.id);
      if (imageBuffer) {
        // There's a BLOB image, use the API endpoint
        imgUrl = `https://blackphuquoc.com/api/girls/${row.id}/image`;
      } else {
        // No image at all, use placeholder
        imgUrl = 'https://via.placeholder.com/300x400?text=No+Image';
      }
    }
    
    return {
      ...row,
      _id: row.id,
      img: imgUrl,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      info: parseJsonSafely(row.info, {}),
      images: detailImageUrls // Use detail image URLs instead of the JSON field
    };
  }));
  
  return girlsWithDetailImages;
};

export const getGirlsCount = async (search = '', area = '') => {
  let query = 'SELECT COUNT(*) as total FROM girls WHERE 1=1';
  const params = [];
  
  // Add search filter
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  // Add area filter
  if (area) {
    query += ' AND area LIKE ?';
    params.push(`%${area}%`);
  }
  
  const [rows] = await db.query(query, params);
  return rows[0].total;
};

export const getGirlById = async (id) => {
  const [rows] = await db.query('SELECT id, name, area, price, rating, img_url, zalo, phone, description, isActive, info, images, created_at, updated_at FROM girls WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  
  const row = rows[0];
  
  
  // Get detail images for this girl
  const detailImages = await getDetailImages(id);
  const detailImageUrls = detailImages.map(img => img.url);
  
  // Determine the image URL
  let imgUrl;
  if (row.img_url && row.img_url.trim() !== '') {
    // If img_url is set, use it
    imgUrl = row.img_url;
    
  } else {
    // If no img_url, check if there's a BLOB image
    const imageBuffer = await getGirlImage(id);
    
    if (imageBuffer) {
      // There's a BLOB image, use the API endpoint
      imgUrl = `https://blackphuquoc.com/api/girls/${id}/image`;
      
    } else {
      // No image at all, use placeholder
      imgUrl = 'https://via.placeholder.com/300x400?text=No+Image';
      
    }
  }
  
  const result = {
    ...row,
    _id: row.id,
    img: imgUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    info: parseJsonSafely(row.info, {}),
    images: detailImageUrls // Use detail image URLs instead of the JSON field
  };
  
  
  return result;
};

export const getGirlImage = async (id) => {
  const [rows] = await db.query('SELECT img FROM girls WHERE id = ?', [id]);
  return rows[0]?.img || null;
};

export const createGirl = async (girl) => {
  // Prepare the data without the img field (BLOB field)
  const defaultInfo = {
    'Người đánh giá': '',
    'ZALO': girl.zalo || '',
    'Giá qua đêm': girl.price || '',
    'Giá phòng': '',
    'Năm sinh': '',
    'Khu vực': girl.area || '',
    'Chiều cao': '',
    'Cân nặng': '',
    'Số đo': ''
  };

  // Ensure we have valid info and images objects
  const info = girl.info || defaultInfo;
  const images = girl.images || [];

  const girlData = {
    name: girl.name,
    area: girl.area,
    price: girl.price,
    rating: girl.rating || 0,
    img_url: '', // Start with empty URL, will be set when image is uploaded
    zalo: girl.zalo || null,
    phone: girl.phone || null,
    description: girl.description || null,
    isActive: girl.isActive !== undefined ? girl.isActive : true,
    info: JSON.stringify(info),
    images: JSON.stringify(images)
  };
  
  // Insert without the img field - explicitly list columns to avoid BLOB issues
  const columns = Object.keys(girlData).join(', ');
  const values = Object.values(girlData);
  const placeholders = values.map(() => '?').join(', ');
  
  const [result] = await db.query(`INSERT INTO girls (${columns}) VALUES (${placeholders})`, values);
  return { id: result.insertId, ...girlData };
};

export const updateGirl = async (id, girl) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (girl.name !== undefined) updateData.name = girl.name;
  if (girl.area !== undefined) updateData.area = girl.area;
  if (girl.price !== undefined) updateData.price = girl.price;
  if (girl.rating !== undefined) updateData.rating = girl.rating;
  if (girl.img !== undefined) updateData.img_url = girl.img;
  if (girl.zalo !== undefined) updateData.zalo = girl.zalo;
  if (girl.phone !== undefined) updateData.phone = girl.phone;
  if (girl.description !== undefined) updateData.description = girl.description;
  if (girl.isActive !== undefined) updateData.isActive = girl.isActive;
  
  // Handle JSON fields carefully
  if (girl.info !== undefined) {
    try {
      updateData.info = JSON.stringify(girl.info);
    } catch (error) {
      console.error('Error stringifying info:', error);
      updateData.info = JSON.stringify({});
    }
  }
  
  if (girl.images !== undefined) {
    try {
      updateData.images = JSON.stringify(girl.images);
    } catch (error) {
      console.error('Error stringifying images:', error);
      updateData.images = JSON.stringify([]);
    }
  }
  
  updateData.updated_at = new Date();
  
  await db.query('UPDATE girls SET ? WHERE id = ?', [updateData, id]);
  return getGirlById(id);
};

export const updateGirlImage = async (id, imageBuffer) => {
  try {
    console.log('updateGirlImage called with id:', id);
    console.log('updateGirlImage - imageBuffer length:', imageBuffer?.length);
    
    // Update both the img field (BLOB) and img_url field with the proper URL
    const imgUrl = `https://blackphuquoc.com/api/girls/${id}/image`;
    console.log('updateGirlImage - setting img_url to:', imgUrl);
    
    const [result] = await db.query(
      'UPDATE girls SET img = ?, img_url = ? WHERE id = ?', 
      [imageBuffer, imgUrl, id]
    );
    
    console.log('updateGirlImage - update result:', result);
    
    if (result.affectedRows === 0) {
      throw new Error('Girl not found');
    }
    
    // Verify the update worked
    const updatedGirl = await getGirlById(id);
    console.log('updateGirlImage - updated girl img_url:', updatedGirl?.img_url);
    console.log('updateGirlImage - updated girl img:', updatedGirl?.img);
    
    return updatedGirl;
  } catch (error) {
    console.error('Error updating girl image:', error);
    throw error;
  }
};

export const deleteGirl = async (id) => {
  await db.query('DELETE FROM girls WHERE id = ?', [id]);
};

export const toggleGirlStatus = async (id) => {
  const girl = await getGirlById(id);
  if (!girl) return null;
  
  const newStatus = !girl.isActive;
  await db.query('UPDATE girls SET isActive = ?, updated_at = ? WHERE id = ?', [newStatus, new Date(), id]);
  return getGirlById(id);
};

export const getTotalGirls = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as total FROM girls');
  return rows[0].total;
};

export const getActiveGirls = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as total FROM girls WHERE isActive = 1');
  return rows[0].total;
};

export const getRecentGirls = async (limit = 5) => {
  const [rows] = await db.query(
    'SELECT id, name, area, price, rating, img_url, created_at FROM girls ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  
  // Get detail images for each girl
  const girlsWithDetailImages = await Promise.all(rows.map(async (row) => {
    const detailImages = await getDetailImages(row.id);
    const detailImageUrls = detailImages.map(img => img.url);
    
    // Determine the image URL
    let imgUrl;
    if (row.img_url && row.img_url.trim() !== '') {
      // If img_url is set, use it
      imgUrl = row.img_url;
    } else {
      // If no img_url, check if there's a BLOB image
      const imageBuffer = await getGirlImage(row.id);
      if (imageBuffer) {
        // There's a BLOB image, use the API endpoint
        imgUrl = `https://blackphuquoc.com/api/girls/${row.id}/image`;
      } else {
        // No image at all, use placeholder
        imgUrl = 'https://via.placeholder.com/300x400?text=No+Image';
      }
    }
    
    return {
      ...row,
      _id: row.id,
      img: imgUrl,
      createdAt: row.created_at,
      images: detailImageUrls
    };
  }));
  
  return girlsWithDetailImages;
};

// Helper function to safely parse JSON
const parseJsonSafely = (jsonString, defaultValue) => {
  // If it's already an object, return it directly
  if (typeof jsonString === 'object' && jsonString !== null) {
    return jsonString;
  }
  
  // Handle null, undefined, or non-string inputs
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }
  
  // Handle empty strings or invalid JSON strings
  if (jsonString === 'null' || jsonString === 'undefined' || jsonString.trim() === '') {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('Error parsing JSON:', error, 'Input:', jsonString);
    return defaultValue;
  }
};

// Detail images functions
export const uploadDetailImage = async (girlId, imageBuffer, order = 0) => {
  try {
    const [result] = await db.query(
      'INSERT INTO detail_images (girl_id, image_data, image_order) VALUES (?, ?, ?)',
      [girlId, imageBuffer, order]
    );
    
    return { id: result.insertId, girlId, order };
  } catch (error) {
    console.error('Error uploading detail image:', error);
    throw error;
  }
};

export const getDetailImages = async (girlId) => {
  try {
    const [rows] = await db.query(
      'SELECT id, image_order, created_at FROM detail_images WHERE girl_id = ? ORDER BY image_order ASC',
      [girlId]
    );
    
    return rows.map(row => ({
      id: row.id,
      order: row.image_order,
      createdAt: row.created_at,
      url: `https://blackphuquoc.com/api/girls/${girlId}/detail-images/${row.id}`
    }));
  } catch (error) {
    console.error('Error getting detail images:', error);
    throw error;
  }
};

export const getDetailImage = async (girlId, imageId) => {
  try {
    const [rows] = await db.query(
      'SELECT image_data FROM detail_images WHERE id = ? AND girl_id = ?',
      [imageId, girlId]
    );
    
    return rows[0]?.image_data || null;
  } catch (error) {
    console.error('Error getting detail image:', error);
    throw error;
  }
};

export const deleteDetailImage = async (girlId, imageId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM detail_images WHERE id = ? AND girl_id = ?',
      [imageId, girlId]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting detail image:', error);
    throw error;
  }
};

export const updateDetailImageOrder = async (girlId, imageId, newOrder) => {
  try {
    const [result] = await db.query(
      'UPDATE detail_images SET image_order = ? WHERE id = ? AND girl_id = ?',
      [newOrder, imageId, girlId]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating detail image order:', error);
    throw error;
  }
}; 