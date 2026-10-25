import express from 'express';
import { createAttributeController, deleteAttributeController, getAttributeByIdController, updateAttributeController } from '../controllers/attributeController.js';

import { authAttendantMiddleware } from '../middlewares/authAttendantMiddleware.js';

const router = express.Router();

router.get('/:atr_codigo', authAttendantMiddleware, getAttributeByIdController);
router.post('/', authAttendantMiddleware, createAttributeController);
router.put('/:atr_codigo', authAttendantMiddleware, updateAttributeController);
router.delete('/:atr_codigo', authAttendantMiddleware, deleteAttributeController);

export default router;