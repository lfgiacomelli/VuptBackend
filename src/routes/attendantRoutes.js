import express from 'express';
import {
    createAttendantController,
    updateAttendantController,
    deleteAttendantController,
    getAttendantByIdController,
    getAttendantsByCompanyController
} from '../controllers/attendantController.js';

import { authAttendantMiddleware } from '../middlewares/authAttendantMiddleware.js';

const router = express.Router();

//CRUD de atendentes

router.post('/', createAttendantController);
router.get('/:ate_codigo', authAttendantMiddleware, getAttendantByIdController);
router.get('/company/:emp_codigo', authAttendantMiddleware, getAttendantsByCompanyController);
router.put('/:ate_codigo', authAttendantMiddleware, updateAttendantController);
router.delete('/:ate_codigo', authAttendantMiddleware, deleteAttendantController);


//SOLICITACOES E VIAGENS



export default router;
