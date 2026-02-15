import prisma from '../config/prisma';
import { Cab, CabStatus, Prisma } from '@prisma/client';

export interface CreateCabDto {
    driverName: string;
    totalSeats: number;
    availableSeats: number;
    luggageCapacity: number;
    availableLuggageCapacity: number;
    status: CabStatus;
    version: number;
}

export class CabRepository {
    async createCab(data: CreateCabDto): Promise<Cab> {
        return prisma.cab.create({
            data,
        });
    }

    async findFirstAvailable(tx: Prisma.TransactionClient = prisma): Promise<Cab | null> {
        return tx.cab.findFirst({
            where: {
                status: CabStatus.AVAILABLE,
                availableSeats: {
                    gt: 0,
                },
            },
            orderBy: {
                createdAt: 'asc', // FIFO assignment
            },
        });
    }

    async findFirstAvailableWithLock(
        luggageCount: number,
        tx: Prisma.TransactionClient
    ): Promise<Cab | null> {
        const result = await tx.$queryRaw<Cab[]>`
            SELECT * FROM "Cab"
            WHERE status = 'AVAILABLE'
            AND "availableSeats" > 0
            AND "availableLuggageCapacity" >= ${luggageCount}
            ORDER BY "createdAt" ASC
            LIMIT 1
            FOR UPDATE
        `;

        return result.length > 0 ? result[0] : null;
    }

    async updateCab(
        id: string,
        data: Prisma.CabUpdateInput,
        tx: Prisma.TransactionClient = prisma
    ): Promise<Cab> {
        return tx.cab.update({
            where: { id },
            data,
        });
    }

    async findById(
        id: string,
        tx: Prisma.TransactionClient = prisma
    ): Promise<Cab | null> {
        return tx.cab.findUnique({
            where: { id },
        });
    }
}
