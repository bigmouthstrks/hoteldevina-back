import { Passenger, PrismaClient } from "@prisma/client";
import { PassengerData } from "../models/passenger";

const prisma = new PrismaClient();

export class PassengerRepository {
    static async createPassenger(passengerData: PassengerData): Promise<Passenger> {
        return await prisma.passenger.create({ data: passengerData })
    }

    static async deletePassenger(passengerId: Number): Promise<Passenger> {
        return await prisma.passenger.delete({ where: { id: Number(passengerId) } })
    }
}