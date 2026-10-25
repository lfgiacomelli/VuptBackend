import express from 'express';

import { authManagerController } from '../../controllers/auth/authManagerController.js';

const router = express.Router();

router.post('/login', authManagerController);

export default router;