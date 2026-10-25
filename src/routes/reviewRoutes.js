import express from "express";

import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";
import {getAvailablesByUserController, createAvailableController, getAvailablesToExplainController } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/to-explain", getAvailablesToExplainController);

router.get("/:usu_codigo", authUserMiddleware, getAvailablesByUserController);
router.post("/", authUserMiddleware, createAvailableController);

export default router;