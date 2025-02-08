import { Passenger, PrismaClient } from "@prisma/client";
import { PassengerData } from "../models/passenger";

const prisma = new PrismaClient();

export class PassengerRepository {
    static async getPassenger(passengerId: Number): Promise<Passenger | null> {
        try {
            const passenger = await prisma.passenger.findUnique({ where: { id: Number(passengerId) } });
            if (!passenger) {
                throw new Error("No se pudo encontrar el pasajero");
            }
            return passenger;
        } catch (error) {
            throw new Error("No se pudo encontrar el pasajero");
        }
    }

    static async createPassenger(passengerData: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.create({ data: passengerData });
        } catch (error) {
            throw new Error("No se pudo crear el pasajero");
        }
    }

    static async deletePassenger(passengerId: Number): Promise<Passenger> {
        try {
            return await prisma.passenger.delete({ where: { id: Number(passengerId) } });
        } catch (error) {
            throw new Error("No se pudo eliminar el pasajero");
        }
    }

    static async updatePassenger(passenger: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.update({ where: { id: Number(passenger.id) }, data: passenger });
        } catch (error) {
            throw new Error("No se pudo actualizar el pasajero");
        }
    }
}