import { Router } from "express"
import { PassengerController } from "../controllers/passenger.controller"

const router = Router();

router.get("/passengers/:passengerId", PassengerController.getPassenger)
router.post("/passengers", PassengerController.createPassenger);
router.put("/passengers", PassengerController.updatePassenger);
router.delete("/passengers/:passengerId", PassengerController.deletePassenger);

export default router;