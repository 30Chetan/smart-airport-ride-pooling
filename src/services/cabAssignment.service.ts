import prisma from '../config/prisma';
import { CabAssignmentRepository } from '../repositories/cabAssignment.repository';
import { RideRequestRepository } from '../repositories/rideRequest.repository';
import { CabRepository } from '../repositories/cab.repository';
import { AppError } from '../middleware/error.middleware';
import { CabAssignment, RideStatus, CabStatus } from '@prisma/client';

export class CabAssignmentService {
    private cabAssignmentRepository: CabAssignmentRepository;
    private rideRequestRepository: RideRequestRepository;
    private cabRepository: CabRepository;

    constructor() {
        this.cabAssignmentRepository = new CabAssignmentRepository();
        this.rideRequestRepository = new RideRequestRepository();
        this.cabRepository = new CabRepository();
    }

    async assignCabToRideRequest(rideRequestId: string): Promise<CabAssignment> {
        const rideRequest = await this.rideRequestRepository.findById(rideRequestId);

        if (!rideRequest) {
            throw new AppError('Ride request not found', 404);
        }

        if (rideRequest.status !== RideStatus.PENDING) {
            throw new AppError(`Ride request is already ${rideRequest.status}`, 400);
        }

        // Start Transaction
        return prisma.$transaction(async (tx) => {
            // 1. Find first available cab WITH LOCK
            // This prevents race conditions where multiple requests might try to claim the last seat of the same cab concurrently.
            // The FOR UPDATE clause in the raw query locks the selected row until the end of this transaction.
            const availableCab = await this.cabRepository.findFirstAvailableWithLock(
                rideRequest.luggageCount,
                tx
            );

            if (!availableCab) {
                throw new AppError('No cabs available with sufficient luggage capacity', 409);
            }

            // 3. Decrement seats and luggage, update status
            const newAvailableSeats = availableCab.availableSeats - 1;
            const newAvailableLuggage = availableCab.availableLuggageCapacity - rideRequest.luggageCount;
            const newStatus = newAvailableSeats === 0 ? CabStatus.FULL : CabStatus.AVAILABLE;

            await this.cabRepository.updateCab(
                availableCab.id,
                {
                    availableSeats: newAvailableSeats,
                    availableLuggageCapacity: newAvailableLuggage,
                    status: newStatus,
                },
                tx
            );

            // 3. Create Assignment
            const assignment = await this.cabAssignmentRepository.createAssignment(
                {
                    cabId: availableCab.id,
                    rideRequestId: rideRequestId,
                },
                tx
            );

            // 4. Update Ride Request Status
            await this.rideRequestRepository.updateStatus(rideRequestId, RideStatus.ASSIGNED, tx);

            return assignment;
        });
    }
}
