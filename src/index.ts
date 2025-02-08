import express, { Request, Response } from 'express';
import useRoutes from "./routes/app.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
useRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});