import express from 'express';
import { createEmployeeController, deleteEmployeeController, getAllEmployeesController, getEmployeeByIdController, updateEmployeeController, getAvailableEmployeesController, getEmployeesWithoutMotorcycleController  } from '../controllers/employeeController.js';

import { authAttendantMiddleware } from '../middlewares/authAttendantMiddleware.js';

const router = express.Router();

router.get('/all/:ate_codigo', authAttendantMiddleware, getAllEmployeesController);
router.get('/:mot_codigo', authAttendantMiddleware, getEmployeeByIdController);
router.get('/available/:ate_codigo', authAttendantMiddleware, getAvailableEmployeesController);
router.get('/without-motorcycle/:emp_codigo', authAttendantMiddleware, getEmployeesWithoutMotorcycleController);
router.post('/', createEmployeeController);
router.put('/:mot_codigo', authAttendantMiddleware, updateEmployeeController);
router.delete('/:mot_codigo', authAttendantMiddleware, deleteEmployeeController);
export default router;