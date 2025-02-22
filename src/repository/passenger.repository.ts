import { Passenger, PrismaClient } from '@prisma/client';
import { PassengerData } from '../models/passenger';
import { PassengerMessages } from '../constants/passenger-messages';
import { APIError } from '../api-error';

const prisma = new PrismaClient();

class PassengerRepository {
    async getPassenger(passengerId: Number): Promise<Passenger | null> {
        try {
            const passenger = await prisma.passenger.findUnique({
                where: { passengerId: Number(passengerId) },
            });
            if (!passenger) {
                throw new APIError(PassengerMessages.GET_PASSENGER_ERROR);
            }
            return passenger;
        } catch (error) {
            throw new APIError(PassengerMessages.GET_PASSENGER_ERROR);
        }
    }

    async createPassenger(passengerData: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.create({ data: passengerData });
        } catch (error) {
            throw new APIError(PassengerMessages.CREATE_PASSENGER_ERORR);
        }
    }

    async deletePassenger(passengerId: Number): Promise<Passenger> {
        try {
            return await prisma.passenger.delete({ where: { passengerId: Number(passengerId) } });
        } catch (error) {
            throw new APIError(PassengerMessages.DELETE_PASSENGER_ERROR);
        }
    }

    async updatePassenger(passengerId: Number, passenger: PassengerData): Promise<Passenger> {
        try {
            return await prisma.passenger.update({
                where: { passengerId: Number(passengerId) },
                data: passenger,
            });
        } catch (error) {
            throw new APIError(PassengerMessages.UPDATE_PASSENGER_ERROR);
        }
    }
}
export default new PassengerRepository();
