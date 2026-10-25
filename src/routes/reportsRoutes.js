import { Router } from "express";
import { ReportsController, getReportsController } from "../controllers/reportsController.js";

import { authAttendantMiddleware } from "../middlewares/authAttendantMiddleware.js";
import { authManagerMiddleware } from "../middlewares/authManagerMiddleware.js";

const router = Router();

router.get("/dashboard/:emp_codigo", authAttendantMiddleware, ReportsController.dashboard);
router.get("/trips/:emp_codigo", authAttendantMiddleware, ReportsController.trips);
router.get("/reports",
    authManagerMiddleware,
    getReportsController
);

export default router;