import { Passenger, PrismaClient } from '@prisma/client';
import { PassengerData } from '../models/passenger';
import { PassengerMessages } from '../constants/passenger-messages';
import { APIError } from '../api-error';
import prisma from '../utils/prisma-client-wrapper';

class PassengerRepository {
    async getPassenger(passengerId: Number): Promise<Passenger> {
        const passenger = await prisma.passenger
            .findUnique({
                where: { passengerId: Number(passengerId) },
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(PassengerMessages.PASSENGER_NOT_FOUND, 500);
            });
        if (!passenger) {
            throw new APIError(PassengerMessages.PASSENGER_NOT_FOUND, 500);
        }
        return passenger;
    }

    async createPassenger(passengerData: PassengerData): Promise<Passenger> {
        const passenger = await prisma.passenger
            .create({
                data: passengerData,
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(PassengerMessages.CREATE_PASSENGER_ERROR, 500);
            });
        return passenger;
    }

    async deletePassenger(passengerId: Number): Promise<Passenger> {
        const passenger = await prisma.passenger
            .delete({ where: { passengerId: Number(passengerId) } })
            .catch((error) => {
                console.error(error);
                throw new APIError(PassengerMessages.DELETE_PASSENGER_ERROR, 500);
            });
        return passenger;
    }

    async updatePassenger(passengerId: Number, passenger: PassengerData): Promise<Passenger> {
        const updatedPassenger = await prisma.passenger
            .update({
                where: { passengerId: Number(passengerId) },
                data: passenger,
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(PassengerMessages.UPDATE_PASSENGER_ERROR, 500);
            });
        return updatedPassenger;
    }
}
export default new PassengerRepository();
