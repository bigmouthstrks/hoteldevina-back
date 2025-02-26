import { Reservation, ReservationRoom } from '@prisma/client';
import { APIError } from '../api-error';
import {
    CommitSimulationParameters,
    CreateReservationParameters,
} from '../models/Reservation/reservation';
import prisma from '../utils/prisma-client-wrapper';
import { ReservationMessages } from '../constants/reservation-messages';
import reservationsUtils from '../utils/reservations-utils';

class ReservationRepository {
    async getSimulation(passengerNumber: number, checkInDate: Date, checkOutDate: Date) {
        // Obtener todas las habitaciones disponibles en el rango de fechas
        const availableRooms = await prisma.room.findMany({
            where: {
                isAvailable: true,
                reservations: {
                    none: {
                        reservation: {
                            // Acceder a Reservation a través de ReservationRoom
                            OR: [{ checkIn: { lte: checkOutDate }, checkOut: { gt: checkInDate } }],
                        },
                    },
                },
            },
            include: {
                roomType: true, // Incluir el tipo de habitación para obtener la capacidad
            },
        });

        // Filtrar combinaciones de habitaciones que cumplan con la capacidad requerida
        const combinations = this.findRoomCombinations(availableRooms, passengerNumber);

        return combinations;
    }

    // Función para encontrar combinaciones de habitaciones
    private findRoomCombinations(rooms: any[], passengerNumber: number) {
        const combinations: any[] = [];

        // Función recursiva para generar combinaciones
        const backtrack = (start: number, currentCombination: any[], currentCapacity: number) => {
            if (currentCapacity >= passengerNumber) {
                combinations.push([...currentCombination]);
                return;
            }

            for (let i = start; i < rooms.length; i++) {
                const room = rooms[i];
                currentCombination.push(room);
                backtrack(i + 1, currentCombination, currentCapacity + room.roomType.capacity);
                currentCombination.pop();
            }
        };

        backtrack(0, [], 0);
        return combinations;
    }

    async createReservation(reservationParameters: CreateReservationParameters) {
        try {
            const { checkIn, checkOut, userId, nightsCount, roomIds, passengerCount } =
                reservationParameters;

            console.log(reservationParameters);
            const rooms = await prisma.room.findMany({
                where: { roomId: { in: roomIds } },
                include: { roomType: true },
            });

            if (rooms.length === 0) {
                throw new Error('No se encontraron habitaciones válidas');
            }

            const totalPrice =
                rooms.reduce((sum, room) => sum + room.roomType.price, 0) * nightsCount;

            // Crear la reserva
            const reservation = await prisma.reservation.create({
                data: {
                    checkIn: new Date(checkIn),
                    checkOut: new Date(checkOut),
                    userId,
                    passengerCount,
                    nightsCount,
                    totalPrice,
                    rooms: {
                        create: reservationParameters.roomIds.map((roomId) => ({
                            room: { connect: { roomId } },
                        })),
                    },
                },
                include: { rooms: true, user: true },
            });

            return reservation;
        } catch (error) {
            console.log(error);
            throw new Error('No se pudo crear la reserva');
        }
    }

    async getReservationById(reservationId: number): Promise<Reservation | null> {
        const reservation = await prisma.reservation.findUnique({
            where: { reservationId: reservationId },
        });

        if (!reservation) {
            throw new APIError(ReservationMessages.RESERVATION_FETCH_ERROR, 500);
        }

        return reservation;
    }

    async getReservationsByStatusId(reservationStatusId: number): Promise<Reservation[] | null> {
        const status = await prisma.reservationStatus.findUnique({
            where: { reservationStatusId: reservationStatusId },
        });

        const reservations = await prisma.reservation.findMany({
            where: { reservationStatusId: reservationStatusId },
        });

        if (!reservations || reservations.length === 0) {
            if (status) {
                throw new APIError(`No se encontraron reservas en estado '${status.name}'`, 404);
            }
            throw new APIError('No se encontraron reservas para el estado solicitado', 500);
        }

        return reservations;
    }

    async updateReservationStatus(
        reservationId: number,
        reservationData: CreateReservationParameters
    ): Promise<Reservation | null> {
        const reservation = await prisma.reservation.update({
            where: { reservationId: reservationId },
            data: reservationData,
        });

        return reservation;
    }
}

export default new ReservationRepository();
