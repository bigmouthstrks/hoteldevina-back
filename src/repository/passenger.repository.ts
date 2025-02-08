import { Passenger, PrismaClient } from "@prisma/client";
import { PassengerData } from "../models/passenger";
import { PassengerRepositoryMessages } from "../constants/passenger-messages";

const prisma = new PrismaClient();

export class PassengerRepository {
    static async getPassenger(passengerId: Number): Promise<Passenger | null> {
        try {
            const passenger = await prisma.passenger.findUnique({ where: { id: Number(passengerId) } });
            if (!passenger) {
                throw new Error(PassengerRepositoryMessages.GET_PASSENGER_ERROR);
            }
            return passenger;
        } catch (error) {
            throw new Error(PassengerRepositoryMessages.GET_PASSENGER_ERROR);
        }
    }

    static async createPassenger(passengerData: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.create({ data: passengerData });
        } catch (error) {
            throw new Error(PassengerRepositoryMessages.CREATE_PASSENGER_ERORR);
        }
    }

    static async deletePassenger(passengerId: Number): Promise<Passenger> {
        try {
            return await prisma.passenger.delete({ where: { id: Number(passengerId) } });
        } catch (error) {
            throw new Error(PassengerRepositoryMessages.DELETE_PASSENGER_ERROR);
        }
    }

    static async updatePassenger(passenger: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.update({ where: { id: Number(passenger.id) }, data: passenger });
        } catch (error) {
            throw new Error(PassengerRepositoryMessages.UPDATE_PASSENGER_ERROR);
        }
    }
}