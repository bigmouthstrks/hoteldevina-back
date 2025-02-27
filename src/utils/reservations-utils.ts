import { APIError } from '../api-error';

class ReservationUtils {
    getNightsCount(checkIn: string | Date, checkOut: string | Date): number {
        try {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            // Calculate difference in milliseconds
            const diffInMs = checkOutDate.getTime() - checkInDate.getTime();

            // Convert milliseconds to full days
            const nightsCount = diffInMs / (1000 * 60 * 60 * 24);

            return Math.max(0, Math.floor(nightsCount)); // Ensure non-negative value
        } catch (error) {
            throw new APIError('Error calculating nights count', 500);
        }
    }

    getTimeOnly(date?: Date): string {
        try {
            if (!date) {
                return '';
            }
            const hours = date.getHours();
            const minutes = `${date.getMinutes()}`.padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch (error) {
            throw new APIError('Error getting time only', 500);
        }
    }

    formatMoneyAmount(amount: number): string {
        try {
            return `$${amount.toLocaleString('es-CL')}`;
        } catch (error) {
            throw new APIError('Error formatting money amount', 500);
        }
    }

    formatDate(date: Date): string {
        try {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        } catch (error) {
            console.log(error);
            throw new APIError('Error formatting date', 500);
        }
    }
}

export default new ReservationUtils();
