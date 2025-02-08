import { Express } from "express";
import passengerRouter from "./passenger.routes"
import roomRouter from "./room.routes"
import roomTypeRouter from "./room-type.routes"

const useRoutes = (app: Express): void => {
    app.use(passengerRouter);
    app.use(roomRouter);
    app.use(roomTypeRouter);
};

export default useRoutes;

