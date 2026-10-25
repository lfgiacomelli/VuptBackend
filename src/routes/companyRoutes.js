import express from 'express';

import {getAvailableCompaniesController, getCompanyByIdController, getPopularCompaniesController, addFirstAttendantToCompanyController, createCompanyController, deleteCompanyController, getCompaniesController, updateCompanyController} from "../controllers/companyController.js";

import { authUserMiddleware } from '../middlewares/authUserMiddleware.js';
import { authManagerMiddleware } from '../middlewares/authManagerMiddleware.js';

const router = express.Router();


router.get('/', authManagerMiddleware, getCompaniesController);

router.post(
    '/',
    authManagerMiddleware,
    createCompanyController
);

router.put(
    '/:emp_codigo',
    authManagerMiddleware,
    updateCompanyController
);

router.delete(
    '/:emp_codigo',
    authManagerMiddleware,
    deleteCompanyController
);

router.post(
    'first-attendant/:emp_codigo/',
    authManagerMiddleware,
    addFirstAttendantToCompanyController
);

router.get('/:city', authUserMiddleware, getAvailableCompaniesController);
router.get("/popular/:city", authUserMiddleware, getPopularCompaniesController);
router.get("/:emp_codigo", authUserMiddleware, getCompanyByIdController);

export default router;