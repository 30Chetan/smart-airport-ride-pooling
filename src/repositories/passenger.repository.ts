import prisma from '../config/prisma';
import { Passenger } from '@prisma/client';

export interface CreatePassengerDto {
    name: string;
    phone: string;
}

export class PassengerRepository {
    async createPassenger(data: CreatePassengerDto): Promise<Passenger> {
        return prisma.passenger.create({
            data,
        });
    }

    async findByPhone(phone: string): Promise<Passenger | null> {
        return prisma.passenger.findUnique({
            where: {
                phone,
            },
        });
    }
}
