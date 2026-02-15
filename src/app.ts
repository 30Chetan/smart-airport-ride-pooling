import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import { errorHandler } from './middleware/error.middleware';
import healthRoutes from './routes/health.route';
import passengerRoutes from './routes/passenger.route';
import rideRequestRoutes from './routes/rideRequest.route';
import cabRoutes from './routes/cab.route';
import Logger from './config/logger';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
    Logger.http(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/passengers', passengerRoutes);
app.use('/ride-requests', rideRequestRoutes);
app.use('/cabs', cabRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Not Found - ${req.originalUrl}`,
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;
