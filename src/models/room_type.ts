import { RoomData } from './room'

// RoomTypeData
export interface RoomTypeData {
    id: number;
    name: string;
    description?: string;
    rooms: RoomData[];
}