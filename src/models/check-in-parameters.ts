export interface CheckInParameters {
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
    carPatent?: string;
    address?: string;
    city?: string;
    arrivalTime?: Date;
    leaveTime?: Date;
    documentType?: string;
    documentNumber?: string;
    voucher: VoucherParameters;
    roomIds: number[];
}

interface VoucherParameters {
    documentType?: string;
    documentNumber?: string;
    companyName?: string;
    businessActivity?: string;
    address?: string;
    city?: string;
}
