import app from './app';
import http from 'http';
import Logger from './config/logger';
import { connectRedis } from './config/redis';
import prisma from './config/prisma';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        // Connect to services
        await connectRedis();
        await prisma.$connect();
        Logger.info('Prisma Client Connected');

        server.listen(PORT, () => {
            Logger.info(`Server running on port ${PORT}`);
            Logger.info(`Documentation available at http://localhost:${PORT}/docs`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    Logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    Logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
