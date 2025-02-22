import { Router } from 'express';
import workerController from '../controllers/worker.controller';

const router = Router();

router.get('/worker/:workerId', workerController.getWorker);
router.post('/worker', workerController.createWorker);
router.put('/worker', workerController.updateWorker);
router.delete('/worker/:workerId', workerController.deleteWorker);

export default router;
