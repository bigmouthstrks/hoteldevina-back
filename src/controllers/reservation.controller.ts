import {
    CommitSimulationParameters,
    CreateReservationParameters,
} from '../models/Reservation/reservation';
import { Request, Response } from 'express';
import { ReservationMessages } from '../constants/reservation-messages';
import { BaseResponse } from '../base-response';
import { APIError } from '../api-error';
import reservationRepository from '../repository/reservation.repository';
import { SimulationParameters } from '../models/Reservation/simulation-parameters';
import { Reservation, Room } from '@prisma/client';
import reservationsUtils from '../utils/reservations-utils';

class ReservationController {
    async getSimulation(req: Request, res: Response): Promise<void> {
        try {
            const simulationData: SimulationParameters = req.body;

            // Validate input
            if (
                !simulationData ||
                !simulationData.checkIn ||
                !simulationData.checkOut ||
                !simulationData.passengerNumber
            ) {
                res.status(400).json({
                    error: 'Invalid data. Provide checkIn, checkOut, and passengerNumber.',
                });
                return;
            }

            // Convert and validate dates
            const checkInDate = new Date(simulationData.checkIn);
            const checkOutDate = new Date(simulationData.checkOut);
            const passengerNumber = simulationData.passengerNumber;

            if (
                isNaN(checkInDate.getTime()) ||
                isNaN(checkOutDate.getTime()) ||
                checkInDate >= checkOutDate
            ) {
                res.status(400).json({
                    error: 'Invalid check-in/check-out dates. Check-in must be before check-out.',
                });
                return;
            }

            if (typeof passengerNumber !== 'number' || passengerNumber <= 0) {
                res.status(400).json({
                    error: 'Passenger number must be a positive number.',
                });
                return;
            }

            // Fetch room combinations
            const roomCombinations = await reservationRepository.getSimulation(
                passengerNumber,
                checkInDate,
                checkOutDate
            );

            if (!Array.isArray(roomCombinations)) {
                throw new Error('Invalid repository response: expected an array.');
            }

            // Calculate total capacity for each combination
            const combinationsWithCapacity = roomCombinations.map((combination) => {
                const totalCapacity = combination.reduce((sum: number, room: any) => {
                    if (!room || !room.roomType) {
                        throw new Error('Each room must have a valid room type.');
                    }
                    return sum + room.roomType.capacity;
                }, 0);

                return { combination, totalCapacity };
            });

            // Filter and sort room combinations
            const exactCombinations = combinationsWithCapacity.filter(
                (combo) => combo.totalCapacity === passengerNumber
            );

            const filteredCombinations =
                exactCombinations.length > 0 ? exactCombinations : combinationsWithCapacity;

            const sortedCombinations = filteredCombinations.sort((a, b) => {
                return (
                    Math.abs(a.totalCapacity - passengerNumber) -
                    Math.abs(b.totalCapacity - passengerNumber)
                );
            });

            // Format response (limit to 4 combinations)
            const formattedCombinations = sortedCombinations.slice(0, 4).map((combo) => {
                const { combination, totalCapacity } = combo;

                const totalPrice = combination.reduce((sum: number, room: any) => {
                    if (!room || !room.roomType) {
                        throw new Error('Each room must have a valid room type.');
                    }
                    return sum + room.roomType.price;
                }, 0);

                const rooms = combination.map((room: any) => {
                    if (!room || !room.roomType) {
                        throw new Error('Each room must have a valid room type.');
                    }

                    return {
                        roomId: room.roomId,
                        roomNumber: room.number,
                        roomType: {
                            roomTypeId: room.roomType.roomTypeId,
                            name: room.roomType.name,
                            description: room.roomType.description,
                            capacity: room.roomType.capacity,
                            features: room.roomType.features, // Fixed incorrect property access
                            price: room.roomType.price,
                            promotionPrice: room.roomType.promotionPrice,
                        },
                    };
                });

                return {
                    passengerNumber,
                    checkIn: simulationData.checkIn,
                    checkOut: simulationData.checkOut,
                    totalCapacity,
                    totalPrice,
                    rooms,
                };
            });

            res.status(200).json(
                new BaseResponse(ReservationMessages.SIMULATION_SUCCESS, formattedCombinations)
            );
        } catch (error) {
            console.error('Error in getSimulation:', error);
            res.status(500).json(
                new BaseResponse(ReservationMessages.SIMULATION_ERROR, undefined, error as APIError)
            );
        }
    }

    async createReservation(req: Request, res: Response): Promise<void> {
        try {
            const reservationData: CreateReservationParameters = req.body;

            // Ensure valid data is provided
            if (!reservationData) {
                res.status(400).json({ error: 'Invalid reservation data.' });
                return;
            }

            // Call repository to create reservation
            const newReservation = await reservationRepository.createReservation(reservationData);

            res.status(201).json(
                new BaseResponse(ReservationMessages.RESERVATION_CREATED, newReservation)
            );
        } catch (error) {
            console.error('Error in createReservation:', error);
            res.status(500).json(
                new BaseResponse(
                    ReservationMessages.RESERVATION_CREATION_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async commitSimulation(req: Request, res: Response): Promise<void> {
        try {
            const simulationData: CommitSimulationParameters = req.body;

            console.log(simulationData);

            // Ensure valid data is provided
            if (!simulationData) {
                res.status(400).json({ error: 'Invalid reservation data.' });
                return;
            }

            const reservationData: CreateReservationParameters = {
                userId: simulationData.userId,
                checkIn: simulationData.checkIn,
                checkOut: simulationData.checkOut,
                passengerCount: simulationData.passengerNumber,
                nightsCount: reservationsUtils.getNightsCount(
                    simulationData.checkIn,
                    simulationData.checkOut
                ),
                totalPrice: simulationData.totalPrice,
                roomIds: simulationData.roomIds,
            };

            const newReservation = await reservationRepository.createReservation(reservationData);

            res.status(201).json(
                new BaseResponse(ReservationMessages.RESERVATION_CREATED, newReservation)
            );
        } catch (error) {
            console.error('Error in createReservation:', error);
            res.status(500).json(
                new BaseResponse(
                    ReservationMessages.RESERVATION_CREATION_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async getReservationById(req: Request, res: Response): Promise<void> {
        try {
            const reservationId = parseInt(req.params.id, 10);
            if (isNaN(reservationId)) {
                res.status(400).json({ error: 'Invalid reservation ID.' });
                return;
            }

            const reservation = await reservationRepository.getReservationById(reservationId);
            if (!reservation) {
                res.status(404).json({ error: 'Reservation not found.' });
                return;
            }

            res.status(200).json(
                new BaseResponse(ReservationMessages.RESERVATION_FOUND, reservation)
            );
        } catch (error) {
            console.error('Error in getReservationById:', error);
            res.status(500).json(
                new BaseResponse(
                    ReservationMessages.RESERVATION_FETCH_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async getReservationsByStatusId(req: Request, res: Response): Promise<void> {
        try {
            const statusId = Number(req.params.id);
            if (!statusId) {
                res.status(400).send(
                    new BaseResponse(ReservationMessages.RESERVATIONS_FETCH_ERROR, 500)
                );
                return;
            }

            const reservations = await reservationRepository.getReservationsByStatusId(statusId);
            res.status(200).json(
                new BaseResponse(ReservationMessages.RESERVATIONS_FOUND, reservations)
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).json(
                new BaseResponse(
                    ReservationMessages.RESERVATIONS_FETCH_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async updateReservationStatus(req: Request, res: Response): Promise<void> {
        try {
            const reservationId = parseInt(req.params.id, 10);
            const { statusId } = req.body;

            if (isNaN(reservationId) || isNaN(statusId)) {
                res.status(400).send(new BaseResponse('Invalid reservation ID or status ID.', 400));
                return;
            }

            const updatedReservation = await reservationRepository.updateReservationStatus(
                reservationId,
                statusId
            );

            if (!updatedReservation) {
                res.status(404).send(new BaseResponse('Reservation not found.', 404));
                return;
            }

            res.status(200).json(
                new BaseResponse(ReservationMessages.RESERVATION_UPDATED, updatedReservation)
            );
        } catch (error) {
            console.error('Error in updateReservationStatus:', error);
            res.status(500).json(
                new BaseResponse(
                    ReservationMessages.RESERVATION_UPDATE_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }
}

export default new ReservationController();
