import express from 'express';
import { createMotorcycleController, deleteMotorcycleController, getAllMotorcyclesController, getMotorcycleByIdController, updateMotorcycleController } from '../controllers/motorcycleController.js';

import { authAttendantMiddleware } from '../middlewares/authAttendantMiddleware.js';

const router = express.Router();

router.get("/all/:ate_codigo", authAttendantMiddleware, getAllMotorcyclesController);
router.get('/:moto_codigo', authAttendantMiddleware, getMotorcycleByIdController);
router.post('/', createMotorcycleController);
router.put('/:moto_codigo', authAttendantMiddleware, updateMotorcycleController);
router.delete('/:moto_codigo', authAttendantMiddleware, deleteMotorcycleController);
export default router;