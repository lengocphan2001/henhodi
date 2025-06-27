import express from 'express';
import * as GirlController from '../controllers/girl.controller.js';

const router = express.Router();

router.get('/', GirlController.getAll);
router.get('/:id', GirlController.getOne);
router.post('/', GirlController.create);
router.put('/:id', GirlController.update);
router.delete('/:id', GirlController.remove);

export default router; 