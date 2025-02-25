import { ReservationData } from '../models/reservation';
import { Request, Response } from 'express';
import { ReservationMessages } from '../constants/reservation-messages';
import { BaseResponse } from '../base-response';
import { APIError } from '../api-error';
import reservationRepository from '../repository/reservation.repository';
import { SimulationData } from '../models/simulation-data';
import prisma from '../utils/prisma-client-wrapper';

class ReservationController {
    async getSimulation(req: Request, res: Response): Promise<void> {
        try {
            const simulationData: SimulationData = req.body;

            if (!simulationData) {
                res.status(400).json({
                    error: 'Datos inválidos. Asegúrate de proporcionar checkIn, checkOut y passengerNumber.',
                });
                return;
            }

            const checkInDate = new Date(simulationData.checkIn);
            const checkOutDate = new Date(simulationData.checkOut);
            const passengerNumber = simulationData.passengerNumber;

            if (
                isNaN(checkInDate.getTime()) ||
                isNaN(checkOutDate.getTime()) ||
                checkInDate >= checkOutDate
            ) {
                res.status(400).json({
                    error: 'Las fechas de checkIn y checkOut deben ser válidas y checkIn debe ser anterior a checkOut.',
                });
                return;
            }

            const availableRoomTypes = await reservationRepository.getSimulation(
                passengerNumber,
                checkInDate,
                checkOutDate
            );

            const roomOptions = availableRoomTypes.map((roomType) => ({
                roomTypeId: roomType.roomTypeId,
                name: roomType.name,
                description: roomType.description,
                price: roomType.price,
                promotionPrice: roomType.promotionPrice,
                capacity: roomType.capacity,
                availableRooms: roomType.rooms.map((room) => ({
                    roomId: room.roomId,
                    number: room.number,
                })),
            }));

            res.status(200).json(
                new BaseResponse(ReservationMessages.SIMULATION_SUCCESS, roomOptions)
            );
        } catch (error) {
            res.status(500).json(
                new BaseResponse(ReservationMessages.SIMULATION_ERROR, undefined, error as APIError)
            );
        }
    }

    async createReservation(req: Request, res: Response): Promise<void> {
        try {
            const reservationData: ReservationData = req.body;
        } catch (error) {}
    }

    async getReservationById(req: Request, res: Response): Promise<void> {}

    async getReservationsByStatusId(req: Request, res: Response): Promise<void> {}

    async updateReservationStatus(req: Request, res: Response): Promise<void> {}
}

export default new ReservationController();
