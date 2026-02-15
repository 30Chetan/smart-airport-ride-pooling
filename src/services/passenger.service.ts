import { PassengerRepository, CreatePassengerDto } from '../repositories/passenger.repository';
import { AppError } from '../middleware/error.middleware';
import { Passenger } from '@prisma/client';

export class PassengerService {
    private passengerRepository: PassengerRepository;

    constructor() {
        this.passengerRepository = new PassengerRepository();
    }

    async createPassenger(data: CreatePassengerDto): Promise<Passenger> {
        const existingPassenger = await this.passengerRepository.findByPhone(data.phone);

        if (existingPassenger) {
            throw new AppError('Passenger with this phone number already exists', 409);
        }

        return this.passengerRepository.createPassenger(data);
    }
}
