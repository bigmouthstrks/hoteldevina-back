import { RoomData } from '../models/room';
import { Request, Response } from 'express';
import { RoomMessages } from '../constants/room-messages';
import { BaseResponse } from '../base-response';
import roomRepository from '../repository/room.repository';

class RoomController {
    async getRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomId = req.params.roomId;
            const room = await roomRepository.getRoom(Number(roomId));

            res.status(200).send(new BaseResponse(RoomMessages.GET_ROOM_SUCCESS, room));
        } catch (error) {
            res.status(500).send(new BaseResponse(RoomMessages.GET_ROOM_ERROR, error));
        }
    }

    async createRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomData = req.body;
            const newRoom = await roomRepository.createRoom(roomData);

            res.status(200).send(new BaseResponse(RoomMessages.CREATE_ROOM_SUCCESS, newRoom));
        } catch (error) {
            res.status(500).send(new BaseResponse(RoomMessages.CREATE_ROOM_ERROR, error));
        }
    }

    async updateRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomData: RoomData = req.body;
            const updatedRoom = await roomRepository.updateRoom(roomData);

            res.status(200).send(new BaseResponse(RoomMessages.UPDATE_ROOM_SUCCESS, updatedRoom));
        } catch (error) {
            res.status(500).send(new BaseResponse(RoomMessages.UPDATE_ROOM_ERROR, error));
        }
    }

    async deleteRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomId = req.params.roomId;
            const deletedRoom = await roomRepository.deleteRoom(Number(roomId));

            res.status(200).send(new BaseResponse(RoomMessages.DELETE_ROOM_SUCCESS, deletedRoom));
        } catch (error) {
            res.status(500).send(new BaseResponse(RoomMessages.DELETE_ROOM_ERROR, error));
        }
    }
}

export default new RoomController();
