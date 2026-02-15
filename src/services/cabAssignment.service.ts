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

    async cancelRideRequest(rideRequestId: string): Promise<any> {
        return prisma.$transaction(async (tx) => {
            // 1. Fetch RideRequest and validate
            const rideRequest = await this.rideRequestRepository.findById(rideRequestId, tx);
            if (!rideRequest) {
                throw new AppError('Ride request not found', 404);
            }

            if (rideRequest.status !== RideStatus.ASSIGNED) {
                throw new AppError('Only assigned rides can be cancelled', 400);
            }

            // 2. Fetch CabAssignment
            const assignment = await this.cabAssignmentRepository.findByRideRequestId(rideRequestId, tx);
            if (!assignment) {
                throw new AppError('Cab assignment not found for this ride request', 404);
            }

            // 3. Fetch Cab
            const cab = await this.cabRepository.findById(assignment.cabId, tx);
            if (!cab) {
                throw new AppError('Cab not found', 404);
            }

            // 4. Update Cab Capacity and Status
            const newAvailableSeats = cab.availableSeats + 1;
            const newAvailableLuggage = cab.availableLuggageCapacity + rideRequest.luggageCount;
            const newStatus = cab.status === CabStatus.FULL ? CabStatus.AVAILABLE : cab.status;

            await this.cabRepository.updateCab(
                cab.id,
                {
                    availableSeats: newAvailableSeats,
                    availableLuggageCapacity: newAvailableLuggage,
                    status: newStatus,
                },
                tx
            );

            // 5. Update RideRequest Status to CANCELLED
            await this.rideRequestRepository.updateStatus(rideRequestId, RideStatus.CANCELLED, tx);

            // 6. Delete CabAssignment
            await this.cabAssignmentRepository.deleteByRideRequestId(rideRequestId, tx);

            return {
                rideRequestId,
                cabId: cab.id,
                cancelledAt: new Date(),
            };
        });
    }
}
