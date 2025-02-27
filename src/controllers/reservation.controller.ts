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
import reservationsUtils from '../utils/reservations-utils';
import { CheckInParameters } from '../models/check-in-parameters';

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

            console.log(checkInDate);
            console.log(checkOutDate);

            if (
                isNaN(checkInDate.getTime()) ||
                isNaN(checkOutDate.getTime()) ||
                checkInDate >= checkOutDate
            ) {
                res.status(400).send(
                    new BaseResponse(
                        'Fecha de check-in o check-out no es válida. La fecha de check-out debe ser posterior a la de check-in.',
                        undefined,
                        new APIError('La fecha de llegada o salida no es válida', 400)
                    )
                );
                return;
            }

            if (typeof passengerNumber !== 'number' || passengerNumber <= 0) {
                res.status(400).send(
                    new BaseResponse(
                        'El número de pasajeros debe ser un número válido',
                        undefined,
                        new APIError('El número de pasajeros debe ser un número mayor a 0', 400)
                    )
                );
                return;
            }

            // Fetch room combinations
            const roomCombinations = await reservationRepository.getSimulation(
                passengerNumber,
                checkInDate,
                checkOutDate
            );

            if (!Array.isArray(roomCombinations)) {
                res.status(500).send(
                    new BaseResponse(
                        'Sin opciones disponibles',
                        undefined,
                        new APIError('Error interno, se esperaba un array.', 500)
                    )
                );
                return;
            }

            // Calculate total capacity for each combination
            const combinationsWithCapacity = roomCombinations.map((combination) => {
                const totalCapacity = combination.reduce((sum: number, room: any) => {
                    if (!room || !room.roomType) {
                        res.status(500).send(
                            new BaseResponse(
                                'Habitación o tipo de habitación no está definido',
                                undefined,
                                new APIError('Cada habitación debe tener un tipo válido', 500)
                            )
                        );
                        return;
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
                            price: reservationsUtils.formatMoneyAmount(room.roomType.price),
                            promotionPrice: reservationsUtils.formatMoneyAmount(
                                room.roomType.promotionPrice
                            ),
                        },
                    };
                });

                return {
                    nightsCount: reservationsUtils.getNightsCount(
                        simulationData.checkIn,
                        simulationData.checkOut
                    ),
                    passengerNumber,
                    checkIn: reservationsUtils.formatDate(checkInDate),
                    checkOut: reservationsUtils.formatDate(checkOutDate),
                    totalCapacity,
                    totalPrice: reservationsUtils.formatMoneyAmount(totalPrice),
                    rooms,
                };
            });

            res.status(200).json(
                new BaseResponse(ReservationMessages.SIMULATION_SUCCESS, formattedCombinations)
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse(ReservationMessages.SIMULATION_ERROR, undefined, e)
            );
        }
    }

    async createReservation(req: Request, res: Response): Promise<void> {
        try {
            const reservationData: CreateReservationParameters = req.body;

            // Ensure valid data is provided
            if (!reservationData) {
                res.status(400).send(
                    new BaseResponse(
                        'Invalid reservation data.',
                        undefined,
                        new APIError('Invalid reservation data.', 400)
                    )
                );
                return;
            }

            // Call repository to create reservation
            const newReservation = await reservationRepository.createReservation(reservationData);

            res.status(201).send(
                new BaseResponse(ReservationMessages.RESERVATION_CREATED, newReservation)
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse(ReservationMessages.RESERVATION_CREATION_ERROR, undefined, e)
            );
        }
    }

    async commitSimulation(req: Request, res: Response): Promise<void> {
        try {
            const simulationData: CommitSimulationParameters = req.body;

            console.log(simulationData);

            // Ensure valid data is provided
            if (!simulationData) {
                res.status(400).send({ error: 'Invalid reservation data.' });
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

            var newReservation = await reservationRepository.createReservation(reservationData);

            res.status(201).send(
                new BaseResponse(ReservationMessages.RESERVATION_CREATED, {
                    ...newReservation,
                    totalPrice: reservationsUtils.formatMoneyAmount(newReservation.totalPrice),
                    checkIn: reservationsUtils.formatDate(newReservation.checkIn),
                    checkOut: reservationsUtils.formatDate(newReservation.checkOut),
                })
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse(ReservationMessages.RESERVATION_CREATION_ERROR, undefined, e)
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
                new BaseResponse(ReservationMessages.RESERVATION_FOUND, {
                    ...reservation,
                    totalPrice: reservationsUtils.formatMoneyAmount(reservation.totalPrice),
                    checkIn: reservationsUtils.formatDate(reservation.checkIn),
                    checkOut: reservationsUtils.formatDate(reservation.checkOut),
                })
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).json(
                new BaseResponse(ReservationMessages.RESERVATION_FETCH_ERROR, undefined, e)
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
            if (reservations && reservations.length > 0) {
                const updatedReservations = reservations.map((reservation) => {
                    return {
                        ...reservation,
                        totalPrice: reservationsUtils.formatMoneyAmount(reservation.totalPrice),
                        checkIn: reservationsUtils.formatDate(reservation.checkIn),
                        checkOut: reservationsUtils.formatDate(reservation.checkOut),
                    };
                });

                res.status(200).send(
                    new BaseResponse(ReservationMessages.RESERVATIONS_FOUND, updatedReservations)
                );
            } else {
                res.status(404).send(
                    new BaseResponse(
                        ReservationMessages.RESERVATIONS_NOT_FOUND,
                        undefined,
                        new APIError('No se encontraron reservas para este tipo')
                    )
                );
            }
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse(ReservationMessages.RESERVATIONS_FETCH_ERROR, undefined, e)
            );
        }
    }

    async updateReservationById(req: Request, res: Response): Promise<void> {
        try {
            const reservationId = Number(req.params.id);
            const reservationParameters: CreateReservationParameters = req.body;

            if (!reservationId || !reservationParameters.reservationStatusId) {
                res.status(400).send(
                    new BaseResponse(
                        'Invalid reservation ID or status ID.',
                        undefined,
                        new APIError('Id de reserva o de estado de reserva nulo o inexistente', 404)
                    )
                );
                return;
            }

            const updatedReservation = await reservationRepository.updateReservationById(
                reservationId,
                reservationParameters
            );

            if (!updatedReservation) {
                res.status(404).send(
                    new BaseResponse(
                        'Reservation not found.',
                        undefined,
                        new APIError('La reserva no se pudo actualizar', 404)
                    )
                );
                return;
            }

            res.status(200).send(
                new BaseResponse(ReservationMessages.RESERVATION_UPDATED, updatedReservation)
            );
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse(ReservationMessages.RESERVATION_UPDATE_ERROR, undefined, e)
            );
        }
    }

    async checkIn(req: Request, res: Response): Promise<void> {
        const reservationId = req.params.id;
        var checkInData: CheckInParameters = req.body;

        if (!reservationId || !checkInData.checkInWorker) {
            res.status(400).send(
                new BaseResponse(
                    'Faltan datos requeridos: reservationId y checkInWorker',
                    undefined,
                    new APIError('Error al validar parámetros de entrada', 400)
                )
            );
            return;
        }

        const parsedReservationId = Number(reservationId);

        if (isNaN(parsedReservationId)) {
            res.status(400).send(
                new BaseResponse(
                    'reservationId debe ser un número válido',
                    undefined,
                    new APIError('Error al validar parámetros de entrada', 400)
                )
            );
            return;
        }

        const arrivalTime = reservationsUtils.getTimeOnly(checkInData.arrivalTime);

        try {
            const reservation = await reservationRepository.registerCheckIn(
                parsedReservationId,
                checkInData,
                arrivalTime
            );
            res.status(200).send({
                message: ReservationMessages.CHECK_IN_SUCCESS,
                reservation,
            });
            return;
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse('Error al realizar check-in', undefined, e)
            );
            return;
        }
    }

    async checkOut(req: Request, res: Response): Promise<void> {
        const reservationId = req.params.id;
        const { checkOutWorker, leaveTime } = req.body;

        if (!reservationId || !checkOutWorker) {
            res.status(400).send(
                new BaseResponse(
                    'Faltan datos requeridos: reservationId y checkInWorker',
                    undefined,
                    new APIError('Error al validar parámetros de entrada', 400)
                )
            );
            return;
        }

        const parsedReservationId = Number(reservationId);

        if (isNaN(parsedReservationId)) {
            res.status(400).send(
                new BaseResponse(
                    'reservationId debe ser un número válido',
                    undefined,
                    new APIError('Error al validar parámetros de entrada', 500)
                )
            );
            return;
        }

        try {
            const reservation = await reservationRepository.registerCheckOut(
                parsedReservationId,
                checkOutWorker,
                leaveTime
            );
            res.status(200).json({
                message: ReservationMessages.CHECK_OUT_SUCCESS,
                reservation,
            });
            return;
        } catch (error) {
            const e = error as APIError;
            res.status(Number(e.code)).send(
                new BaseResponse('Error al realizar check-out', undefined, e)
            );
            return;
        }
    }
}

export default new ReservationController();
