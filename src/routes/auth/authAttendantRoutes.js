import express from 'express';

import { authAttendantController} from '../../controllers/auth/authAttendantController.js';

const router = express.Router();

router.post('/login', authAttendantController);

export default router;