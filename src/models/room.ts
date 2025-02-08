import { RoomTypeData } from "./room_type"

// Room
export interface RoomData {
    id: number;
    number: number;
    isAvailable: boolean;
    price: number;
    promotionPrice: number;
    bedNumber: number;
    roomTypeId: number;
    roomType: RoomTypeData;
}