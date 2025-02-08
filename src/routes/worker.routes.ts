import { Router } from 'express';
import WorkerController from '../controllers/worker.controller';

const router = Router();

router.get('/worker/:workerId', WorkerController.getWorker);
router.post('/worker', WorkerController.createWorker);
router.put('/worker', WorkerController.updateWorker);
router.delete('/worker/:workerId', WorkerController.deleteWorker);

export default router;