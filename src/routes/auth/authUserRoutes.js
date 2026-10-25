import express from 'express';

import { authUserController } from '../../controllers/auth/authUserController.js';

const router = express.Router();

router.post('/login', authUserController);

export default router;