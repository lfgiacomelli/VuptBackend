import express from "express";

import {
    createSupportMessageController,
    getSupportMessagesBySupportController,
    getSupportMessageByIdController,
    markSupportMessagesAsReadController
} from "../controllers/supportMessageController.js";

import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";

const router = express.Router();

router.get("/support/:sup_codigo", authUserMiddleware, getSupportMessagesBySupportController);

router.get("/by-id/:msg_codigo", authUserMiddleware, getSupportMessageByIdController);

router.post("/", authUserMiddleware, createSupportMessageController);

router.patch("/read/:sup_codigo", authUserMiddleware, markSupportMessagesAsReadController);

export default router;