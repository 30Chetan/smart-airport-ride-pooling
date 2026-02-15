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
}
