import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.update);
router.put('/:id/password', authenticateToken, UserController.changePassword);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, UserController.getAll);
router.get('/:id', authenticateToken, requireAdmin, UserController.getOne);
router.put('/:id', authenticateToken, requireAdmin, UserController.update);
router.delete('/:id', authenticateToken, requireAdmin, UserController.remove);

export default router; 