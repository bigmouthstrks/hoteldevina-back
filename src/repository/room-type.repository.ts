import { RoomType, PrismaClient } from "@prisma/client";
import { RoomTypeData } from "../models/room-type";
import { RoomTypeRepositoryMessages } from "../constants/room-type-messages";

const prisma = new PrismaClient();

class RoomTypeRepository {
    async getRoomType(roomTypeId: Number): Promise<RoomType | null> {
        try {
            const roomType = await prisma.roomType.findUnique({ where: { id: Number(roomTypeId) } });
            if (!roomType) {
                throw new Error(RoomTypeRepositoryMessages.GET_ROOM_TYPE_ERROR);
            }
            return roomType;
        } catch (error) {
            throw new Error(RoomTypeRepositoryMessages.GET_ROOM_TYPE_ERROR);
        }
    }

    async createRoomType(roomTypeData: RoomTypeData): Promise<RoomType> {
        try {
            return await prisma.roomType.create({ data: roomTypeData });
        } catch (error) {
            throw new Error(RoomTypeRepositoryMessages.CREATE_ROOM_TYPE_ERROR);
        }
    }

    async deleteRoomType(roomTypeId: Number): Promise<RoomType> {
        try {
            return await prisma.roomType.delete({ where: { id: Number(roomTypeId) } });
        } catch (error) {
            throw new Error(RoomTypeRepositoryMessages.DELETE_ROOM_TYPE_ERROR);
        }
    }

    async updateRoomType(roomType: RoomTypeData): Promise<RoomType> {
        try {
            return await prisma.roomType.update({ where: { id: Number(roomType.id) }, data: roomType });
        } catch (error) {
            throw new Error(RoomTypeRepositoryMessages.UPDATE_ROOM_TYPE_ERROR);
        }
    }
}

export default new RoomTypeRepository();