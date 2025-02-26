class ReservationUtils {
    getNightsCount(checkIn: string | Date, checkOut: string | Date): number {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Calculate difference in milliseconds
        const diffInMs = checkOutDate.getTime() - checkInDate.getTime();

        // Convert milliseconds to full days
        const nightsCount = diffInMs / (1000 * 60 * 60 * 24);

        return Math.max(0, Math.floor(nightsCount)); // Ensure non-negative value
    }
}

export default new ReservationUtils();
