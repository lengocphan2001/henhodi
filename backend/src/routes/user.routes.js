import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// User routes (authenticated)
router.get('/profile', authenticateToken, requireUser, UserController.getProfile);
router.put('/:id/change-password', authenticateToken, requireUser, UserController.changePassword);

// Admin only routes
router.get('/', UserController.getAll);
router.get('/:id', authenticateToken, requireAdmin, UserController.getOne);
router.put('/:id', UserController.update);
router.delete('/:id', authenticateToken, requireAdmin, UserController.remove);
router.get('/dashboard/stats', authenticateToken, requireAdmin, UserController.getDashboardStats);
router.post('/', authenticateToken, requireAdmin, UserController.createUser);
router.patch('/:id/toggle-status', UserController.toggleUserStatus);

export default router; 