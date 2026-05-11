
import './config/env.js';
import express from 'express';
import cors from 'cors';
const app = express();
import algoRoutes from './routes/analyze.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const allowlist = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowlist.length > 0 ? allowlist : (process.env.NODE_ENV === 'production' ? false : '*'),
}
));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/analyze', algoRoutes);

// Global error handler 
app.use(errorHandler);

export default app;