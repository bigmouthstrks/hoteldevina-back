import { RoomType, PrismaClient } from '@prisma/client';
import { RoomTypeData } from '../models/room-type';
import { RoomTypeMessages } from '../constants/room-type-messages';

const prisma = new PrismaClient();

class RoomTypeRepository {
    async getRoomType(roomTypeId: Number): Promise<RoomType | null> {
        try {
            const roomType = await prisma.roomType.findUnique({
                where: { roomTypeId: Number(roomTypeId) },
            });
            if (!roomType) {
                throw new Error(RoomTypeMessages.GET_ROOM_TYPE_ERROR);
            }
            return roomType;
        } catch (error) {
            throw new Error(RoomTypeMessages.GET_ROOM_TYPE_ERROR);
        }
    }

    async createRoomType(roomTypeData: RoomTypeData): Promise<RoomType> {
        try {
            return await prisma.roomType.create({ data: roomTypeData });
        } catch (error) {
            throw new Error(RoomTypeMessages.CREATE_ROOM_TYPE_ERROR);
        }
    }

    async deleteRoomType(roomTypeId: Number): Promise<RoomType> {
        try {
            return await prisma.roomType.delete({ where: { roomTypeId: Number(roomTypeId) } });
        } catch (error) {
            throw new Error(RoomTypeMessages.DELETE_ROOM_TYPE_ERROR);
        }
    }

    async updateRoomType(roomType: RoomTypeData): Promise<RoomType> {
        try {
            return await prisma.roomType.update({
                where: { roomTypeId: Number(roomType.roomTypeId) },
                data: roomType,
            });
        } catch (error) {
            throw new Error(RoomTypeMessages.UPDATE_ROOM_TYPE_ERROR);
        }
    }
}

export default new RoomTypeRepository();
