import * as Girl from '../models/girl.model.js';

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const area = req.query.area || '';
    
    const girls = await Girl.getAllGirls(page, limit, search, area);
    const total = await Girl.getGirlsCount(search, area);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        data: girls,
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get girls error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const girl = await Girl.getGirlById(req.params.id);
    if (!girl) return res.status(404).json({ 
      success: false, 
      message: 'Girl not found' 
    });
    res.json({
      success: true,
      data: girl
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const create = async (req, res) => {
  try {
    const girl = await Girl.createGirl(req.body);
    res.status(201).json({
      success: true,
      data: girl
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const update = async (req, res) => {
  try {
    const girl = await Girl.updateGirl(req.params.id, req.body);
    if (!girl) return res.status(404).json({ 
      success: false, 
      message: 'Girl not found' 
    });
    res.json({
      success: true,
      data: girl
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const remove = async (req, res) => {
  try {
    const girl = await Girl.getGirlById(req.params.id);
    if (!girl) return res.status(404).json({ success: false, message: 'Girl not found' });
    
    await Girl.deleteGirl(req.params.id);
    res.json({ success: true, message: 'Girl deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const girl = await Girl.getGirlById(req.params.id);
    if (!girl) return res.status(404).json({ 
      success: false, 
      message: 'Girl not found' 
    });
    
    const updatedGirl = await Girl.updateGirl(req.params.id, { 
      isActive: !girl.isActive 
    });
    res.json({
      success: true,
      data: updatedGirl
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Detail images functions
export const uploadDetailImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    
    
    // Validate girl ID
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid girl ID provided'
      });
    }
    
    // Check if girl exists
    const girl = await Girl.getGirlById(id);
    if (!girl) {
      return res.status(404).json({
        success: false,
        message: 'Girl not found'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const result = await Girl.uploadDetailImage(id, req.file.buffer, order || 0);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        url: `https://blackphuquoc.com/api/girls${id}/detail-images/${result.id}`
      }
    });
  } catch (error) {
    console.error('Upload detail image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getDetailImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate girl ID
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid girl ID provided'
      });
    }
    
    // Check if girl exists
    const girl = await Girl.getGirlById(id);
    if (!girl) {
      return res.status(404).json({
        success: false,
        message: 'Girl not found'
      });
    }
    
    const images = await Girl.getDetailImages(id);
    
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Get detail images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const serveDetailImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const imageData = await Girl.getDetailImage(id, imageId);
    
    if (!imageData) {
      return res.status(404).json({
        success: false,
        message: 'Detail image not found'
      });
    }
    
    // Set cache headers
    res.set({
      'Cache-Control': 'public, max-age=31536000', // 1 year
      'Content-Type': 'image/jpeg', // Default to JPEG
      'Content-Length': imageData.length
    });
    
    res.send(imageData);
  } catch (error) {
    console.error('Serve detail image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteDetailImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const deleted = await Girl.deleteDetailImage(id, imageId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Detail image not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Detail image deleted successfully'
    });
  } catch (error) {
    console.error('Delete detail image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateDetailImageOrder = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const { order } = req.body;
    
    if (order === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Order is required'
      });
    }
    
    const updated = await Girl.updateDetailImageOrder(id, imageId, order);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Detail image not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Detail image order updated successfully'
    });
  } catch (error) {
    console.error('Update detail image order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 