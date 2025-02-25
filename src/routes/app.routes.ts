import { Express } from 'express';
import passengerRouter from './passenger.routes';
import roomRouter from './room.routes';
import roomTypeRouter from './room-type.routes';
import authRouter from './auth.routes';
import reservationRoutes from './reservation.routes';

const useRoutes = (app: Express): void => {
    app.use(authRouter);
    app.use(passengerRouter);
    app.use(roomRouter);
    app.use(roomTypeRouter);
    app.use(reservationRoutes);
};

export default useRoutes;
