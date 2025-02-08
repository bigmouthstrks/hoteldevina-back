import { Router } from "express"
import { PassengerController } from "../controllers/passenger.controller"

const router = Router();

router.get("/passengers", PassengerController.createPassenger);

export default router;
