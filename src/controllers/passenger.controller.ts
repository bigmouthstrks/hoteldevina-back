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

    static async updatePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerData: PassengerData = req.body;
            const updatedPassenger = await PassengerRepository.updatePassenger(passengerData)
            res.status(200).send({
                "data": updatedPassenger,
                "message": "Pasajero actualizado con éxito"
            })
        } catch (error) {
            res.status(500).send({
                "error": error,
                "message": "No se pudo actualizar el pasajero"
            })
        }
    }

    static async getPassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passengerId;
            const passenger = await PassengerRepository.getPassenger(Number(passengerId))
            res.status(200).send({
                "data": passenger,
                "message": "Pasajero encontrado con éxito"
            })
        } catch (error) {
            res.status(500).send({
                "error": error,
                "message": "No se pudo encontrar el pasajero"
            })
        }
    }

    static async deletePassenger(req: Request, res: Response): Promise<void> {
        try {
            const passengerId = req.params.passengerId;
            await PassengerRepository.deletePassenger(Number(passengerId));
            res.status(200).send({
                "message": "Pasajero eliminado con éxito"
            })
        } catch (error) {
            res.status(500).send({
                "error": error,
                "message": "No se pudo eliminar el pasajero"
            })
        }
    }
}