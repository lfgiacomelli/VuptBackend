import express from 'express';

import { getTravelsByUserController, getTravelByIdController, getMotorcycleController, getActiveTravelController, getOriginAndDestinationController, finishTravelController, getTravelsController} from '../controllers/travelController.js';

import { authUserMiddleware } from '../middlewares/authUserMiddleware.js';
import { authAttendantMiddleware } from '../middlewares/authAttendantMiddleware.js';

const router = express.Router();


router.get('/travels/:emp_codigo', authAttendantMiddleware, getTravelsController);
router.get('/travel/:via_codigo', authAttendantMiddleware, getTravelByIdController);
//rotas para os usuários
router.get("/:usu_codigo", authUserMiddleware, getTravelsByUserController);
router.get('/pending-travel/:usu_codigo', authUserMiddleware, getActiveTravelController);
router.get("/motorcycle/:via_codigo", authUserMiddleware, getMotorcycleController);
router.get("/byId/:via_codigo", authUserMiddleware, getTravelByIdController);
router.get("/addresses/:via_codigo", authUserMiddleware, getOriginAndDestinationController);

router.patch('/travels/finish/:via_codigo', authAttendantMiddleware, finishTravelController);

export default router;