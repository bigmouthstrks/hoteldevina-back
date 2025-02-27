import { Room, PrismaClient } from '@prisma/client';
import { RoomData } from '../models/Room/room';
import { RoomMessages } from '../constants/room-messages';
import { APIError } from '../api-error';
import prisma from '../utils/prisma-client-wrapper';

class RoomRepository {
    async getRoom(roomId: Number): Promise<Room | null> {
        try {
            const room = await prisma.room.findUnique({ where: { roomId: Number(roomId) } });
            if (!room) {
                throw new APIError(RoomMessages.GET_ROOM_ERROR, 500);
            }
            return room;
        } catch (error) {
            console.error(error);
            throw new APIError(RoomMessages.GET_ROOM_ERROR, 500);
        }
    }

    async createRoom(roomData: RoomData): Promise<Room> {
        try {
            return await prisma.room.create({ data: roomData });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomMessages.CREATE_ROOM_ERROR, 500);
        }
    }

    async deleteRoom(roomId: Number): Promise<Room> {
        try {
            return await prisma.room.delete({ where: { roomId: Number(roomId) } });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomMessages.DELETE_ROOM_ERROR, 500);
        }
    }

    async updateRoom(room: RoomData): Promise<Room> {
        try {
            return await prisma.room.update({ where: { roomId: Number(room.roomId) }, data: room });
        } catch (error) {
            console.error(error);
            throw new APIError(RoomMessages.UPDATE_ROOM_ERROR, 500);
        }
    }
}
export default new RoomRepository();
