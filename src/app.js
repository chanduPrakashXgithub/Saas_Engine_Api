import express from 'express';
import { env } from './config/env.js';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import routes from './routes/index.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", routes); 
app.use(errorMiddleware);
export default app;