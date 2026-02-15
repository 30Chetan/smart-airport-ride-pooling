import prisma from '../config/prisma';
import { CabAssignment, Prisma } from '@prisma/client';

export interface CreateAssignmentDto {
    cabId: string;
    rideRequestId: string;
}

export class CabAssignmentRepository {
    async createAssignment(
        data: CreateAssignmentDto,
        tx: Prisma.TransactionClient = prisma
    ): Promise<CabAssignment> {
        return tx.cabAssignment.create({
            data,
        });
    }

    async findByRideRequestId(
        rideRequestId: string,
        tx: Prisma.TransactionClient = prisma
    ): Promise<CabAssignment | null> {
        return tx.cabAssignment.findUnique({
            where: { rideRequestId },
        });
    }

    async deleteByRideRequestId(
        rideRequestId: string,
        tx: Prisma.TransactionClient = prisma
    ): Promise<void> {
        await tx.cabAssignment.delete({
            where: { rideRequestId },
        });
    }
}
