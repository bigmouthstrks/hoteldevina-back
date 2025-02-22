import { Worker, PrismaClient } from '@prisma/client';
import { WorkerData } from '../models/worker';
import { WorkerMessages } from '../constants/worker-messages';

const prisma = new PrismaClient();

class WorkerRepository {
    async getWorker(workerId: number): Promise<Worker | null> {
        try {
            const worker = await prisma.worker.findUnique({ where: { workerId: workerId } });
            if (!worker) {
                throw new Error(WorkerMessages.GET_WORKER_ERROR);
            }
            return worker;
        } catch (error) {
            throw new Error(WorkerMessages.GET_WORKER_ERROR);
        }
    }

    async createWorker(workerData: WorkerData): Promise<Worker> {
        try {
            return await prisma.worker.create({ data: workerData });
        } catch (error) {
            throw new Error(WorkerMessages.CREATE_WORKER_ERROR);
        }
    }

    async updateWorker(workerData: WorkerData): Promise<Worker> {
        try {
            return await prisma.worker.update({
                where: { workerId: workerData.workerId },
                data: workerData,
            });
        } catch (error) {
            throw new Error(WorkerMessages.UPDATE_WORKER_ERROR);
        }
    }

    async deleteWorker(workerId: number): Promise<Worker> {
        try {
            return await prisma.worker.delete({ where: { workerId: workerId } });
        } catch (error) {
            throw new Error(WorkerMessages.DELETE_WORKER_ERROR);
        }
    }
}

export default new WorkerRepository();
