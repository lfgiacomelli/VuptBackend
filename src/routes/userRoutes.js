import express from 'express';
import { createUserController, updateUserController, deleteUserController, getUserByIdController, getAllUsersController } from '../controllers/userController.js';

import { authUserMiddleware } from '../middlewares/authUserMiddleware.js';
import { authManagerMiddleware } from '../middlewares/authManagerMiddleware.js';

const router = express.Router();

router.get(
    '/users',
    authManagerMiddleware,
    getAllUsersController
);
router.get('/:usu_codigo', authUserMiddleware, getUserByIdController);
router.post('/', createUserController);
router.put('/:usu_codigo', authUserMiddleware, updateUserController);
router.delete('/:usu_codigo', authUserMiddleware, deleteUserController);

export default router;