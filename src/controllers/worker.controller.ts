import { WorkerData } from '../models/worker';
import { Request, Response } from 'express';
import { WorkerMessages } from '../constants/worker-messages';
import { BaseResponse } from '../base-response';
import workerRepository from '../repository/worker.repository';

class WorkerController {
    async getWorker(req: Request, res: Response): Promise<void> {
        try {
            const workerId = req.params.workerId;
            const worker = await workerRepository.getWorker(Number(workerId));

            res.status(200).send(new BaseResponse(WorkerMessages.GET_WORKER_SUCCESS, worker));
        } catch (error) {
            res.status(500).send(new BaseResponse(WorkerMessages.GET_WORKER_ERROR, error));
        }
    }

    async createWorker(req: Request, res: Response): Promise<void> {
        try {
            const workerData = req.body;
            const newWorker = await workerRepository.createWorker(workerData);

            res.status(200).send(new BaseResponse(WorkerMessages.CREATE_WORKER_SUCCESS, newWorker));
        } catch (error) {
            res.status(500).send(new BaseResponse(WorkerMessages.CREATE_WORKER_ERROR, error));
        }
    }

    async updateWorker(req: Request, res: Response): Promise<void> {
        try {
            const workerData: WorkerData = req.body;
            const updatedWorker = await workerRepository.updateWorker(workerData);

            res.status(200).send(
                new BaseResponse(WorkerMessages.UPDATE_WORKER_SUCCESS, updatedWorker)
            );
        } catch (error) {
            res.status(500).send(new BaseResponse(WorkerMessages.UPDATE_WORKER_ERROR, error));
        }
    }

    async deleteWorker(req: Request, res: Response): Promise<void> {
        try {
            const workerId = req.params.workerId;
            const deletedWorker = await workerRepository.deleteWorker(Number(workerId));

            res.status(200).send(
                new BaseResponse(WorkerMessages.DELETE_WORKER_SUCCESS, deletedWorker)
            );
        } catch (error) {
            res.status(500).send(new BaseResponse(WorkerMessages.DELETE_WORKER_ERROR, error));
        }
    }
}

export default new WorkerController();
