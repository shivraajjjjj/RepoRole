
import './config/env.js';
import express from 'express';
import cors from 'cors';
const app = express();
import algoRoutes from './routes/analyze.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

app.use(cors(
    '*'
));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/analyze', algoRoutes);

// Global error handler 
app.use(errorHandler);

export default app;