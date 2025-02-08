import { PassengerData } from "../models/passenger";
import { Request, Response } from 'express';
import { PassengerControllerMessages } from "../constants/passenger-messages";
import { BaseResponse } from "../base-response";
import passengerRepository from "../repository/passenger.repository";


class PassengerController {
    async getPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passengerId;
            const passenger = await passengerRepository.getPassenger(Number(passengerId));

            res.status(200).send(new BaseResponse(PassengerControllerMessages.GET_PASSENGER_SUCCESS, passenger));
        } catch (error) {
            res.status(500).send(new BaseResponse(PassengerControllerMessages.GET_PASSENGER_ERROR, error));
        }
    }

    async createPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerData = req.body;
            const newPassenger = await passengerRepository.createPassenger(passengerData);

            res.status(200).send(new BaseResponse(PassengerControllerMessages.CREATE_PASSENGER_SUCCESS, newPassenger));
        } catch (error) {
            res.status(500).send(new BaseResponse(PassengerControllerMessages.CREATE_PASSENGER_ERROR, error));
        }
    }

    async updatePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerData: PassengerData = req.body;
            const updatedPassenger = await passengerRepository.updatePassenger(passengerData);

            res.status(200).send(new BaseResponse(PassengerControllerMessages.UPDATE_PASSENGER_SUCCESS, updatedPassenger));
        } catch (error) {
            res.status(500).send(new BaseResponse(PassengerControllerMessages.UPDATE_PASSENGER_ERROR, error));
        }
    }

    async deletePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passengerId;
            const deletedPassenger = await passengerRepository.deletePassenger(Number(passengerId));

            res.status(200).send(new BaseResponse(PassengerControllerMessages.DELETE_PASSENGER_SUCCESS, deletedPassenger));
        } catch (error) {
            res.status(500).send(new BaseResponse(PassengerControllerMessages.DELETE_PASSENGER_ERROR, error));
        }
    }
}

export default new PassengerController();