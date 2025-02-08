import express, { Request, Response } from 'express';
import useRoutes from "./routes/app.routes";

const app = express();
const PORT = process.env.PORT || 5000;

useRoutes(app);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});