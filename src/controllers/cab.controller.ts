import { Request, Response, NextFunction } from 'express';
import { CabService } from '../services/cab.service';
import { z } from 'zod';

const createCabSchema = z.object({
    driverName: z.string().min(1, 'Driver name is required'),
    totalSeats: z.number().int().positive('Total seats must be a positive integer'),
    luggageCapacity: z.number().int().min(0, 'Luggage capacity must be non-negative'),
});

export class CabController {
    private cabService: CabService;

    constructor() {
        this.cabService = new CabService();
    }

    createCab = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = createCabSchema.safeParse(req.body);

            if (!validationResult.success) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation Error',
                    errors: validationResult.error.errors,
                });
            }

            const cab = await this.cabService.createCab(validationResult.data);

            res.status(201).json({
                id: cab.id,
                driverName: cab.driverName,
                totalSeats: cab.totalSeats,
                availableSeats: cab.availableSeats,
                luggageCapacity: cab.luggageCapacity,
                status: cab.status,
                version: cab.version,
                createdAt: cab.createdAt,
            });
        } catch (error) {
            next(error);
        }
    };
}
