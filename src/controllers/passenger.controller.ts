import { PassengerData } from '../models/passenger';
import { Request, Response } from 'express';
import { PassengerMessages } from '../constants/passenger-messages';
import { BaseResponse } from '../base-response';
import { APIError } from '../api-error';
import passengerRepository from '../repository/passenger.repository';

class PassengerController {
    async getPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId: Number = Number(req.params.id);
            const passenger = await passengerRepository.getPassenger(passengerId);

            res.status(200).send(
                new BaseResponse(PassengerMessages.GET_PASSENGER_SUCCESS, passenger)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(
                    PassengerMessages.GET_PASSENGER_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async createPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerData = req.body;
            const newPassenger = await passengerRepository.createPassenger(passengerData);

            res.status(200).send(
                new BaseResponse(PassengerMessages.CREATE_PASSENGER_SUCCESS, newPassenger)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(
                    PassengerMessages.CREATE_PASSENGER_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async updatePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId: Number = Number(req.params.id);
            const passengerData: PassengerData = req.body;
            const updatedPassenger = await passengerRepository.updatePassenger(
                passengerId,
                passengerData
            );

            res.status(200).send(
                new BaseResponse(PassengerMessages.UPDATE_PASSENGER_SUCCESS, updatedPassenger)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(
                    PassengerMessages.UPDATE_PASSENGER_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async deletePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId: Number = Number(req.params.id);
            const deletedPassenger = await passengerRepository.deletePassenger(passengerId);

            res.status(200).send(
                new BaseResponse(PassengerMessages.DELETE_PASSENGER_SUCCESS, deletedPassenger)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(
                    PassengerMessages.DELETE_PASSENGER_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }
}

export default new PassengerController();
