import { CabRepository, CreateCabDto } from '../repositories/cab.repository';
import { Cab, CabStatus } from '@prisma/client';

export interface CreateCabInput {
    driverName: string;
    totalSeats: number;
    luggageCapacity: number;
}

export class CabService {
    private cabRepository: CabRepository;

    constructor() {
        this.cabRepository = new CabRepository();
    }

    async createCab(input: CreateCabInput): Promise<Cab> {
        const data: CreateCabDto = {
            ...input,
            availableSeats: input.totalSeats,
            availableLuggageCapacity: input.luggageCapacity,
            status: CabStatus.AVAILABLE,
            version: 1,
        };

        return this.cabRepository.createCab(data);
    }
}
