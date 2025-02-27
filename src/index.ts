import express, { Request, Response } from 'express';
import useRoutes from './routes/app.routes';
import cors from 'cors';

const app = express();
// allowedOrigins cuenta con las URL's separadas por "," que permite acceder el backend
// vienen en formato string en .env ALLOWED_ORIGINS="www.url.com,www.test.com" 
const allowedOrigins = process.env?.ALLOWED_ORIGINS;
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins?.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Origen no permitido por CORS'));
            }
        },
    })
);
const PORT = process.env.PORT || 5000;

app.use(express.json());
useRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
