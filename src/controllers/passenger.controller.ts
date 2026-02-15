import { Request, Response, NextFunction } from 'express';
import { PassengerService } from '../services/passenger.service';
import { z } from 'zod';

const createPassengerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export class PassengerController {
    private passengerService: PassengerService;

    constructor() {
        this.passengerService = new PassengerService();
    }

    createPassenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = createPassengerSchema.safeParse(req.body);

            if (!validationResult.success) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation Error',
                    errors: validationResult.error.errors,
                });
            }

            const passenger = await this.passengerService.createPassenger(validationResult.data);

            res.status(201).json({
                id: passenger.id,
                name: passenger.name,
                phone: passenger.phone,
                createdAt: passenger.createdAt,
            });
        } catch (error) {
            next(error);
        }
    };
}
