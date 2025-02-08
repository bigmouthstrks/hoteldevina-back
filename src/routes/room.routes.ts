import { Router } from "express"
import roomController from "../controllers/room.controller"

const router = Router();

router.get("/passengers/:passengerId", roomController.getRoom)
router.post("/passengers", roomController.createRoom);
router.put("/passengers", roomController.updateRoom);
router.delete("/passengers/:passengerId", roomController.deleteRoom);

export default router;