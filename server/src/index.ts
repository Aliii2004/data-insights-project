import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat';
import statsRouter from './routes/stats';
import supportRouter from './routes/support';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { body: req.body });
  next();
});

app.use('/api/chat', chatRouter);
app.use('/api/stats', statsRouter);
app.use('/api/support', supportRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});