export interface RoomTypeParameters {
    roomTypeId: number;
    name: string;
    description?: string;
    singleBedCount: number;
    queenBedCount: number;
    features: string[];
    price: number;
    promotionPrice: number;
    capacity: number;
}
