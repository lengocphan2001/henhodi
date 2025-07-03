import express from 'express';
import multer from 'multer';
import * as Girl from '../models/girl.model.js';

const router = express.Router();

// Configure multer for memory storage (to get buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload image for a specific girl
router.post('/girl/:girlId/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const girlId = req.params.girlId;
    
    // Update the girl's image in the database
    await Girl.updateGirlImage(girlId, req.file.buffer);
    
    // Return the full backend URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      success: true,
      data: {
        url: `${baseUrl}/api/girls/${girlId}/image`,
        filename: req.file.originalname,
        size: req.file.size
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image: ' + error.message
    });
  }
});

// Upload image and create new girl
router.post('/girl/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Create a temporary girl record to get an ID (without img field)
    const tempGirl = {
      name: 'Temporary',
      area: 'Temporary',
      price: '0',
      img: '', // Don't set placeholder
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
    };
    
    const girl = await Girl.createGirl(tempGirl);
    
    // Update with the actual image using a separate query
    try {
      await Girl.updateGirlImage(girl.id, req.file.buffer);
    } catch (imageError) {
      console.error('Failed to update image:', imageError);
      // If image update fails, delete the girl record
      await Girl.deleteGirl(girl.id);
      throw new Error('Failed to store image: ' + imageError.message);
    }
    
    // Return the full backend URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      success: true,
      data: {
        url: `${baseUrl}/api/girls/${girl.id}/image`,
        filename: req.file.originalname,
        size: req.file.size
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image: ' + error.message
    });
  }
});

// Simple image upload (without creating a girl)
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Create a temporary girl record to get an ID (without img field)
    const tempGirl = {
      name: 'Temporary',
      area: 'Temporary',
      price: '0',
      img: '', // Don't set placeholder
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
    };
    
    const girl = await Girl.createGirl(tempGirl);
    
    // Update with the actual image using a separate query
    try {
      await Girl.updateGirlImage(girl.id, req.file.buffer);
    } catch (imageError) {
      console.error('Failed to update image:', imageError);
      // If image update fails, delete the girl record
      await Girl.deleteGirl(girl.id);
      throw new Error('Failed to store image: ' + imageError.message);
    }
    
    // Return the full backend URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      success: true,
      data: {
        url: `${baseUrl}/api/girls/${girl.id}/image`,
        filename: req.file.originalname,
        size: req.file.size
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image: ' + error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Upload failed'
  });
});

export default router; 