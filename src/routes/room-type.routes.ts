import { Router } from 'express';
import roomTypeController from '../controllers/room-type.controller';

const router = Router();

router.get('/room-types', roomTypeController.getRoomTypes);
router.get('/room-types/:roomTypeId', roomTypeController.getRoomType);
router.post('/room-types', roomTypeController.createRoomType);
router.put('/room-types', roomTypeController.updateRoomType);
router.delete('/room-types/:roomTypeId', roomTypeController.deleteRoomType);

export default router;
