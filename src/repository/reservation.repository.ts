import prisma from '../utils/prisma-client-wrapper';

class ReservationRepository {
    async getSimulation(passengerNumber: number, checkInDate: Date, checkOutDate: Date) {
        const availableRoomTypes = await prisma.roomType.findMany({
            where: {
                capacity: { gte: passengerNumber },
                reservations: {
                    none: {
                        OR: [{ checkIn: { lte: checkOutDate }, checkOut: { gt: checkInDate } }],
                    },
                },
            },
            include: {
                rooms: {
                    where: { isAvailable: true },
                    take: 3,
                },
            },
        });

        return availableRoomTypes;
    }
}

export default new ReservationRepository();
