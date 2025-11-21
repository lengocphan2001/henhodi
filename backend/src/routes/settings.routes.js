import express from 'express';
import * as SettingsController from '../controllers/settings.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - get settings (no auth required)
router.get('/', SettingsController.getSettings);

// Protected routes - update settings (admin only)
router.use(authenticateToken);
router.use(requireAdmin);

router.put('/', SettingsController.updateSettings);

export default router;

