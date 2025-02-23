import { RoomTypeData } from '../models/room-type';
import { Request, Response } from 'express';
import { RoomTypeMessages } from '../constants/room-type-messages';
import { BaseResponse } from '../base-response';
import roomTypeRepository from '../repository/room-type.repository';
import { APIError } from '../api-error';

class RoomTypeController {
    async getRoomType(req: Request, res: Response): Promise<void> {
        try {
            const roomTypeId = req.params.roomTypeId;
            const roomType = await roomTypeRepository.getRoomType(Number(roomTypeId));

            res.status(200).send(
                new BaseResponse(RoomTypeMessages.GET_ROOM_TYPE_SUCCESS, roomType)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(RoomTypeMessages.GET_ROOM_TYPE_ERROR, undefined, error as APIError)
            );
        }
    }

    async createRoomType(req: Request, res: Response): Promise<void> {
        try {
            const roomTypeData = req.body;
            const newRoomType = await roomTypeRepository.createRoomType(roomTypeData);

            res.status(200).send(
                new BaseResponse(RoomTypeMessages.CREATE_ROOM_TYPE_SUCCESS, newRoomType)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(
                    RoomTypeMessages.CREATE_ROOM_TYPE_ERROR,
                    undefined,
                    error as APIError
                )
            );
        }
    }

    async updateRoomType(req: Request, res: Response): Promise<void> {
        try {
            const roomTypeData: RoomTypeData = req.body;
            const updatedRoomType = await roomTypeRepository.updateRoomType(roomTypeData);

            res.status(200).send(
                new BaseResponse(RoomTypeMessages.UPDATE_ROOM_TYPE_SUCCESS, updatedRoomType)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(RoomTypeMessages.UPDATE_ROOM_TYPE_ERROR, error as APIError)
            );
        }
    }

    async deleteRoomType(req: Request, res: Response): Promise<void> {
        try {
            const roomTypeId = req.params.roomTypeId;
            const deletedRoomType = await roomTypeRepository.deleteRoomType(Number(roomTypeId));

            res.status(200).send(
                new BaseResponse(RoomTypeMessages.DELETE_ROOM_TYPE_SUCCESS, deletedRoomType)
            );
        } catch (error) {
            res.status(500).send(
                new BaseResponse(RoomTypeMessages.DELETE_ROOM_TYPE_ERROR, error as APIError)
            );
        }
    }
}

export default new RoomTypeController();
