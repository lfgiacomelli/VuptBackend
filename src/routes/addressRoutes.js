import express from "express";

import {
    createAddressController,
    updateAddressController,
    deleteAddressController,
    getAddressByIdController,
    getAddressesByUserController
} from "../controllers/addressController.js";

import { authUserMiddleware } from "../middlewares/authUserMiddleware.js";

const router = express.Router();

router.get("/:usu_codigo", authUserMiddleware, getAddressesByUserController);

router.get("/by-id/:end_codigo", authUserMiddleware, getAddressByIdController);

router.post("/", authUserMiddleware, createAddressController);

router.put("/:end_codigo", authUserMiddleware, updateAddressController);

router.delete("/:end_codigo", authUserMiddleware, deleteAddressController);

export default router;