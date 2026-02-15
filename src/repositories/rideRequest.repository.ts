import prisma from '../config/prisma';
import { Passenger, RideRequest, RideStatus, Prisma } from '@prisma/client';

export interface CreateRideRequestDto {
    passengerId: string;
    pickupLat: number;
    pickupLng: number;
    dropLat: number;
    dropLng: number;
    luggageCount: number;
    detourTolerance: number;
}

export class RideRequestRepository {
    async createRideRequest(data: CreateRideRequestDto): Promise<RideRequest> {
        return prisma.rideRequest.create({
            data: {
                ...data,
                status: RideStatus.PENDING,
            },
            include: {
                passenger: true,
            },
        });
    }

    async findPassengerById(passengerId: string): Promise<Passenger | null> {
        return prisma.passenger.findUnique({
            where: {
                id: passengerId,
            },
        });
    }

    async findById(id: string, tx: Prisma.TransactionClient = prisma): Promise<RideRequest | null> {
        return tx.rideRequest.findUnique({
            where: { id },
        });
    }

    async updateStatus(
        id: string,
        status: RideStatus,
        tx: Prisma.TransactionClient = prisma
    ): Promise<RideRequest> {
        return tx.rideRequest.update({
            where: { id },
            data: { status },
        });
    }
}
