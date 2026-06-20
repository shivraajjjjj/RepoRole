
import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import algoRoutes from './routes/analyze.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

app.set('trust proxy', 1);
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/analyze', algoRoutes);
app.use('/auth', authRoutes);

// Global error handler 
app.use(errorHandler);

export default app;
