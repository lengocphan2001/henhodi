import express from 'express';
import multer from 'multer';
import * as Girl from '../models/girl.model.js';

const router = express.Router();

// Configure multer for memory storage (to get buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // Increase limit to 30MB to avoid 413 errors on larger images
    fileSize: 30 * 1024 * 1024
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