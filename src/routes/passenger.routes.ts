import { Router } from "express"
import passengerController from "../controllers/passenger.controller"

const router = Router();

router.get("/passengers/:passengerId", passengerController.getPassenger)
router.post("/passengers", passengerController.createPassenger);
router.put("/passengers", passengerController.updatePassenger);
router.delete("/passengers/:passengerId", passengerController.deletePassenger);

export default router;