import express from 'express';

import {
    createManagerController,
    deleteManagerController,
    getManagerByIdController,
    updateManagerController,
    getManagersController
} from '../controllers/managerController.js';

import { authManagerMiddleware } from '../middlewares/authManagerMiddleware.js';

const router = express.Router();

router.post('/', createManagerController);

router.get(
    '/',
    authManagerMiddleware,
    getManagersController
);


router.get(
    '/:ges_codigo',
    authManagerMiddleware,
    getManagerByIdController
);

router.put(
    '/:ges_codigo',
    authManagerMiddleware,
    updateManagerController
);

router.delete(
    '/:ges_codigo',
    authManagerMiddleware,
    deleteManagerController
);

export default router;