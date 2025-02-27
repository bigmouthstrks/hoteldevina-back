import { Reservation, ReservationRoom } from '@prisma/client';
import { APIError } from '../api-error';
import {
    CommitSimulationParameters,
    CreateReservationParameters,
} from '../models/Reservation/reservation';
import prisma from '../utils/prisma-client-wrapper';
import { ReservationMessages } from '../constants/reservation-messages';
import reservationsUtils from '../utils/reservations-utils';
import { CheckInParameters } from '../models/check-in-parameters';

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

    async updateReservationById(
        reservationId: number,
        reservationData: CreateReservationParameters
    ): Promise<Reservation | null> {
        const reservation = await prisma.reservation.update({
            where: { reservationId: reservationId },
            data: reservationData,
        });

        return reservation;
    }

    async registerCheckIn(
        reservationId: number,
        checkInData: CheckInParameters,
        arrivalTime: string
    ): Promise<Reservation> {
        const {
            reservationStatusId = 2,
            checkInWorker,
            passengerNames = [],
            passengerCount,
            nightsCount,
            totalPrice,
            carPatent,
            address,
            city,
            documentType,
            documentNumber,
            voucher,
            roomIds,
        } = checkInData;

        const reservation = await prisma.reservation.findUnique({
            where: { reservationId },
            include: { rooms: { include: { room: true } } },
        });

        if (!reservation) {
            throw new APIError(`No se encontró la reserva con ID ${reservationId}`, 404);
        }

        // Opcional: Validar que esté en un estado correcto para hacer check-in
        if (reservation.reservationStatusId !== 2) {
            // 1 = Reservada
            throw new APIError('La reserva no está en un estado válido para hacer check-in', 400);
        }

        if (documentType || documentNumber) {
            await prisma.user.update({
                where: { userId: reservation.userId },
                data: {
                    documentType: documentType,
                    documentNumber: documentNumber,
                },
            });
        }

        // Actualizar la Reservation con los datos del check-in
        const updatedReservation = await prisma.reservation.update({
            where: { reservationId: reservationId },
            data: {
                reservationStatusId,
                checkInWorker,
                passengerNames,
                passengerCount,
                nightsCount,
                totalPrice,
                carPatent,
                address,
                city,
                arrivalTime,
                rooms: {
                    set: roomIds.map((roomId) => ({
                        roomId_reservationId: { roomId, reservationId },
                    })),
                },
                voucher: {
                    create: {
                        documentType: voucher.documentType ?? documentType ?? '',
                        documentNumber: voucher.documentNumber ?? documentNumber ?? '',
                        companyName: voucher.companyName,
                        businessActivity: voucher.businessActivity,
                        address: voucher.address ?? address,
                        city: voucher.city ?? city,
                    },
                },
            },
            include: {
                rooms: true,
                voucher: true,
                user: true,
            },
        });

        await prisma.room.updateMany({
            where: { roomId: { in: roomIds } },
            data: { isAvailable: false },
        });

        return updatedReservation;
    }

    async registerCheckOut(
        reservationId: number,
        checkOutWorker: string,
        leaveTime: string
    ): Promise<Reservation> {
        const reservation = await prisma.reservation.findUnique({
            where: { reservationId },
            include: { rooms: { include: { room: true } } },
        });

        if (!reservation) {
            throw new APIError(`No se encontró la reserva con ID ${reservationId}`, 404);
        }

        // Validar que esté en un estado válido para hacer check-out
        if (reservation.reservationStatusId !== 1) {
            // 2 = En Curso
            throw new APIError('La reserva no está en un estado válido para hacer check-out', 400);
        }

        // Actualizar la reserva con el checkOutWorker y cambiar el estado a "Finalizada"
        const updatedReservation = await prisma.reservation.update({
            where: { reservationId },
            data: {
                checkOutWorker,
                reservationStatusId: 3, // 3 = Finalizada
                leaveTime: leaveTime,
            },
            include: { rooms: { include: { room: true } } },
        });

        // Marcar las habitaciones como disponibles nuevamente
        const roomIds = reservation.rooms.map((r) => r.roomId);

        await prisma.room.updateMany({
            where: { roomId: { in: roomIds } },
            data: { isAvailable: true },
        });

        return updatedReservation;
    }
}

export default new ReservationRepository();
