import { Router } from 'express';
import roomController from '../controllers/room.controller';

const router = Router();

router.get('/rooms/:roomId', roomController.getRoom);
router.post('/rooms', roomController.createRoom);
router.put('/rooms', roomController.updateRoom);
router.delete('/rooms/:roomId', roomController.deleteRoom);

export default router;
