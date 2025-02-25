import { Express } from 'express';
import roomRouter from './room.routes';
import roomTypeRouter from './room-type.routes';
import authRouter from './auth.routes';
import reservationRoutes from './reservation.routes';

const useRoutes = (app: Express): void => {
    app.use(authRouter);
    app.use(roomRouter);
    app.use(roomTypeRouter);
    app.use(reservationRoutes);
};

export default useRoutes;
