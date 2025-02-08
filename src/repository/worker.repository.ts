import { Worker, PrismaClient } from "@prisma/client";
import { WorkerData } from "../models/worker";

const prisma = new PrismaClient();

class WorkerRepository {
    async getWorker(workerId: number): Promise<Worker | null> {
        return await prisma.worker.findUnique({ where: { id: workerId } });
    }

    async createWorker(workerData: WorkerData): Promise<Worker> {
        return await prisma.worker.create({ data: workerData });
    }

    async updateWorker(workerData: WorkerData): Promise<Worker> {
        return await prisma.worker.update({ where: { id: workerData.id }, data: workerData });
    }

    async deleteWorker(workerId: number): Promise<Worker> {
        return await prisma.worker.delete({ where: { id: workerId } });
    }
}

export default new WorkerRepository();