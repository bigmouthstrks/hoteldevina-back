import { Router } from "express"
import passengerController from "../controllers/passenger.controller"

const router = Router();

router.get("/passengers/:id", passengerController.getPassenger)
router.post("/passengers", passengerController.createPassenger);
router.put("/passengers/:id", passengerController.updatePassenger);
router.delete("/passengers/:id", passengerController.deletePassenger);

export default router;