import express from "express";
import { cancelRequestController, createRequestController, getRequestByIdController, getTravelIdByRequestIdController, getRequestsByUserController, acceptRequestController, getRequestsController, refuseRequestController } from "../controllers/requestController.js";

import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import { authAttendantMiddleware } from "../middlewares/authAttendantMiddleware.js";

const router = express.Router();

router.get('/:ate_codigo', authAttendantMiddleware, getRequestsController);
router.patch('/accept/:sol_codigo', authAttendantMiddleware, acceptRequestController);
router.patch('/refuse/:sol_codigo', authAttendantMiddleware, refuseRequestController);

router.get("/:usu_codigo", authUserMiddleware, getRequestsByUserController);
router.get("/request/:sol_codigo", authUserMiddleware, getRequestByIdController);
router.get("/travel-id/:sol_codigo", authUserMiddleware, getTravelIdByRequestIdController);
router.post("/", authUserMiddleware, createRequestController);
router.patch("/cancel/:sol_codigo", authUserMiddleware, cancelRequestController);


export default router;