import express from "express";
import {
    createSupportController,
    getSupportByIdController,
    getSupportsByUserController,
    getOpenSupportByUserAndCompanyController,
    updateSupportDetailsController,
    cancelSupportByUserController,
    getSupportsByCompanyController,
    getOpenSupportsByCompanyController,
    getSupportsInAttendanceByAttendantController,
    acceptSupportController,
    finishSupportController,
    cancelSupportByAttendantController,
    getSupportsByStatusAndCompanyController,
    getSupportsCountByCompanyController,
    deleteSupportController,
    getAvailablesTravelsToSupportController
} from "../controllers/supportController.js";

import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { authAttendantMiddleware } from "../middlewares/authAttendantMiddleware.js";

const router = express.Router();

router.post("/", authUserMiddleware, createSupportController);
router.get("/user/:usu_codigo", authUserMiddleware, getSupportsByUserController);
router.get("/user/:usu_codigo/company/:emp_codigo/open", authUserMiddleware, getOpenSupportByUserAndCompanyController);
router.get("/:sup_codigo", authUserMiddleware, getSupportByIdController);
router.put("/:sup_codigo", authUserMiddleware, updateSupportDetailsController);
router.patch("/:sup_codigo/user/:usu_codigo/cancel", authUserMiddleware, cancelSupportByUserController);

router.get("/company/:emp_codigo", authAttendantMiddleware, getSupportsByCompanyController);
router.get("/company/:emp_codigo/open", authAttendantMiddleware, getOpenSupportsByCompanyController);
router.get("/attendant/:ate_codigo/in-attendance", authAttendantMiddleware, getSupportsInAttendanceByAttendantController);
router.get("/company/:emp_codigo/status/:sup_status", authAttendantMiddleware, getSupportsByStatusAndCompanyController);
router.get("/company/:emp_codigo/counts", authAttendantMiddleware, getSupportsCountByCompanyController);
router.get("/travels/:usu_codigo", authUserMiddleware, getAvailablesTravelsToSupportController);

router.patch("/:sup_codigo/accept", authAttendantMiddleware, acceptSupportController);
router.patch("/:sup_codigo/finish", authAttendantMiddleware, finishSupportController);
router.patch("/:sup_codigo/attendant/:ate_codigo/cancel", authAttendantMiddleware, cancelSupportByAttendantController);

router.delete("/:sup_codigo", authAttendantMiddleware, deleteSupportController);

export default router;