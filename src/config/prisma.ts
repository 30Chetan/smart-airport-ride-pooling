import { PrismaClient } from '@prisma/client';
import Logger from './logger';

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
});

prisma.$on('query', (e) => {
    Logger.debug(`Query: ${e.query}`);
    Logger.debug(`Params: ${e.params}`);
    Logger.debug(`Duration: ${e.duration}ms`);
});

export default prisma;
