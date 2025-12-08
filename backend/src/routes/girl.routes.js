import express from 'express';
import * as GirlController from '../controllers/girl.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import * as Girl from '../models/girl.model.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for detail image uploads
const detailImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // Increase limit to 30MB to reduce 413 errors when admins upload/edit images
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Public routes
router.get('/', GirlController.getAll);
router.get('/:id', GirlController.getOne);
router.post('/:id/view', GirlController.incrementView);
router.get('/:id/image', async (req, res) => {
  try {
    const imageBuffer = await Girl.getGirlImage(req.params.id);
    if (!imageBuffer) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Try to determine content type from the buffer
    let contentType = 'image/jpeg'; // default
    
    // Check for PNG signature
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47) {
      contentType = 'image/png';
    }
    // Check for GIF signature
    else if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49 && imageBuffer[2] === 0x46) {
      contentType = 'image/gif';
    }
    // Check for WebP signature
    else if (imageBuffer[0] === 0x52 && imageBuffer[1] === 0x49 && imageBuffer[2] === 0x46 && imageBuffer[3] === 0x46) {
      contentType = 'image/webp';
    }
    
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ success: false, message: 'Failed to get image' });
  }
});

// Detail images routes (public)
router.get('/:id/detail-images', GirlController.getDetailImages);
router.get('/:id/detail-images/:imageId', GirlController.serveDetailImage);

// Protected routes
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', GirlController.create);
router.put('/:id', GirlController.update);
router.delete('/:id', GirlController.remove);
router.patch('/:id/toggle-status', GirlController.toggleStatus);

// Image upload route for existing girls
router.post('/:id/image', detailImageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const girlId = req.params.id;
    
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

// Detail images routes (protected)
router.post('/:id/detail-images', detailImageUpload.single('image'), GirlController.uploadDetailImage);
router.delete('/:id/detail-images/:imageId', GirlController.deleteDetailImage);
router.patch('/:id/detail-images/:imageId/order', GirlController.updateDetailImageOrder);

export default router; 