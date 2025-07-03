import express from 'express';
import * as ReviewController from '../controllers/review.controller.js';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for viewing)
router.get('/', ReviewController.getAll);

// User routes (authenticated users can create reviews)
router.post('/', authenticateToken, requireUser, ReviewController.create);

// Admin only routes
router.get('/:id', authenticateToken, requireAdmin, ReviewController.getOne);
router.delete('/:id', authenticateToken, requireAdmin, ReviewController.remove);

export default router; 