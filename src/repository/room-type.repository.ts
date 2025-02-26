import { RoomType, PrismaClient } from '@prisma/client';
import { RoomTypeParameters } from '../models/Room/room-type';
import { RoomTypeMessages } from '../constants/room-type-messages';
import { APIError } from '../api-error';
import prisma from '../utils/prisma-client-wrapper';

class RoomTypeRepository {
    async getRoomTypes(): Promise<RoomType[]> {
        try {
            return await prisma.roomType.findMany();
        } catch (error) {
            console.error(error);
            throw new APIError(RoomTypeMessages.GET_ROOM_TYPES_ERROR, 500);
        }
    }

    async getRoomType(roomTypeId: Number): Promise<RoomType | null> {
        try {
            const roomType = await prisma.roomType.findUnique({
                where: { roomTypeId: Number(roomTypeId) },
            });
            if (!roomType) {
                throw new APIError(RoomTypeMessages.GET_ROOM_TYPE_ERROR, 404);
            }
            return roomType;
        } catch (error) {
            console.error(error);
            throw new APIError(RoomTypeMessages.GET_ROOM_TYPE_ERROR, 500);
        }
    }

    async createRoomType(roomTypeData: RoomTypeParameters): Promise<RoomType> {
        try {
            return await prisma.roomType.create({ data: roomTypeData });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomTypeMessages.CREATE_ROOM_TYPE_ERROR, 500);
        }
    }

    async deleteRoomType(roomTypeId: Number): Promise<RoomType> {
        try {
            return await prisma.roomType.delete({ where: { roomTypeId: Number(roomTypeId) } });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomTypeMessages.DELETE_ROOM_TYPE_ERROR, 500);
        }
    }

    async updateRoomType(roomType: RoomTypeParameters): Promise<RoomType> {
        try {
            return await prisma.roomType.update({
                where: { roomTypeId: Number(roomType.roomTypeId) },
                data: roomType,
            });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomTypeMessages.UPDATE_ROOM_TYPE_ERROR, 500);
        }
    }
}

export default new RoomTypeRepository();
