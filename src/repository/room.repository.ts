import { Room, PrismaClient } from '@prisma/client';
import { RoomData } from '../models/room';
import { RoomRepositoryMessages } from '../constants/room-messages';

const prisma = new PrismaClient();

class RoomRepository {
    async getRoom(roomId: Number): Promise<Room | null> {
        try {
            const room = await prisma.room.findUnique({ where: { roomId: Number(roomId) } });
            if (!room) {
                throw new Error(RoomRepositoryMessages.GET_ROOM_ERROR);
            }
            return room;
        } catch (error) {
            throw new Error(RoomRepositoryMessages.GET_ROOM_ERROR);
        }
    }

    async createRoom(roomData: RoomData): Promise<Room> {
        try {
            return await prisma.room.create({ data: roomData });
        } catch (error) {
            throw new Error(RoomRepositoryMessages.CREATE_ROOM_ERORR);
        }
    }

    async deleteRoom(roomId: Number): Promise<Room> {
        try {
            return await prisma.room.delete({ where: { roomId: Number(roomId) } });
        } catch (error) {
            throw new Error(RoomRepositoryMessages.DELETE_ROOM_ERROR);
        }
    }

    async updateRoom(room: RoomData): Promise<Room> {
        try {
            return await prisma.room.update({ where: { roomId: Number(room.roomId) }, data: room });
        } catch (error) {
            throw new Error(RoomRepositoryMessages.UPDATE_ROOM_ERROR);
        }
    }
}
export default new RoomRepository();
