import { PassengerData } from "../models/passenger";
import { Request, Response } from 'express';
import { PassengerRepository } from "../repository/passenger.repository";

export class PassengerController {
    static async createPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerData = req.body;
            const newPassenger = await PassengerRepository.createPassenger(passengerData)
            res.status(200).send({
                "data": newPassenger,
                "message": "Pasajero registrado con éxito"
            })
        } catch (error) {
            res.status(500).send({
                "error": error,
                "message": "No se pudo registrar el pasajero"
            })
        }
    }
}