import { RideRequestRepository, CreateRideRequestDto } from '../repositories/rideRequest.repository';
import { AppError } from '../middleware/error.middleware';
import { RideRequest } from '@prisma/client';

export class RideRequestService {
    private rideRequestRepository: RideRequestRepository;

    constructor() {
        this.rideRequestRepository = new RideRequestRepository();
    }

    async createRideRequest(data: CreateRideRequestDto): Promise<RideRequest> {
        const passenger = await this.rideRequestRepository.findPassengerById(data.passengerId);

        if (!passenger) {
            throw new AppError('Passenger not found. Cannot create ride request.', 404);
        }

        return this.rideRequestRepository.createRideRequest(data);
    }
}
