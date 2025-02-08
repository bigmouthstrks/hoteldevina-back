import { Express } from "express";
import passengerRouter from "./passenger.routes"

const useRoutes = (app: Express): void => {
    app.use(passengerRouter);
};

export default useRoutes;