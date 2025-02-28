export interface CreateReservationParameters {
    checkIn: Date;
    checkOut: Date;
    userId: number;
    reservationStatusId?: number;
    checkInWorker?: string;
    checkOutWorker?: string;
    paymentMethodId?: number;
    passengerNames?: string[];
    passengerCount: number;
    nightsCount: number;
    totalPrice: number;
    roomIds: number[];
}

export interface CommitSimulationParameters {
    userId: number;
    passengerCount: number;
    checkIn: Date;
    checkOut: Date;
    totalCapacity: number;
    totalPrice: number;
    roomIds: number[];
}

interface RoomType {
    roomTypeId: number;
    name: string;
    description: string;
    capacity: number;
    features: string[];
    price: number;
    promotionPrice: number;
}

interface Room {
    roomId: number;
    roomNumber: number;
    roomType: RoomType;
}
