import { createClient } from 'redis';
import Logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => Logger.error('Redis Client Error', err));
redisClient.on('connect', () => Logger.info('Redis Client Connected'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        Logger.error('Could not connect to Redis', error);
        process.exit(1);
    }
};

export default redisClient;
