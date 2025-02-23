import { Worker, PrismaClient } from '@prisma/client';
import { WorkerData } from '../models/worker';
import { WorkerMessages } from '../constants/worker-messages';
import { APIError } from '../api-error';
import prisma from '../utils/prisma-client-wrapper';

class WorkerRepository {
    async getWorker(workerId: number): Promise<Worker | null> {
        const worker = await prisma.worker
            .findUnique({ where: { workerId: workerId } })
            .catch((error) => {
                console.error(error);
                throw new APIError(WorkerMessages.GET_WORKER_ERROR, 500);
            });
        return worker;
    }

    async createWorker(workerData: WorkerData): Promise<Worker> {
        try {
            return await prisma.worker.create({ data: workerData });
        } catch (error) {
            console.error(error);
            throw new APIError(WorkerMessages.CREATE_WORKER_ERROR, 500);
        }
    }

    async updateWorker(workerData: WorkerData): Promise<Worker> {
        try {
            return await prisma.worker.update({
                where: { workerId: workerData.workerId },
                data: workerData,
            });
        } catch (error) {
            console.error(error);
            throw new APIError(WorkerMessages.UPDATE_WORKER_ERROR, 500);
        }
    }

    async deleteWorker(workerId: number): Promise<Worker> {
        try {
            return await prisma.worker.delete({ where: { workerId: workerId } });
        } catch (error) {
            console.error(error);
            throw new APIError(WorkerMessages.DELETE_WORKER_ERROR, 500);
        }
    }
}

export default new WorkerRepository();
