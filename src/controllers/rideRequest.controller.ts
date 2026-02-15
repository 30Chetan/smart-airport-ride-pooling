import { Request, Response, NextFunction } from 'express';
import { RideRequestService } from '../services/rideRequest.service';
import { CabAssignmentService } from '../services/cabAssignment.service';
import { z } from 'zod';

const createRideRequestSchema = z.object({
    passengerId: z.string().uuid('Invalid passenger ID'),
    pickupLat: z.number().min(-90).max(90),
    pickupLng: z.number().min(-180).max(180),
    dropLat: z.number().min(-90).max(90),
    dropLng: z.number().min(-180).max(180),
    luggageCount: z.number().int().min(0),
    detourTolerance: z.number().min(0).max(100),
});

export class RideRequestController {
    private rideRequestService: RideRequestService;
    private cabAssignmentService: CabAssignmentService;

    constructor() {
        this.rideRequestService = new RideRequestService();
        this.cabAssignmentService = new CabAssignmentService();
    }

    createRideRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResult = createRideRequestSchema.safeParse(req.body);

            if (!validationResult.success) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation Error',
                    errors: validationResult.error.errors,
                });
            }

            const rideRequest = await this.rideRequestService.createRideRequest(validationResult.data);

            res.status(201).json({
                id: rideRequest.id,
                passengerId: rideRequest.passengerId,
                pickupLat: rideRequest.pickupLat,
                pickupLng: rideRequest.pickupLng,
                dropLat: rideRequest.dropLat,
                dropLng: rideRequest.dropLng,
                luggageCount: rideRequest.luggageCount,
                detourTolerance: rideRequest.detourTolerance,
                status: rideRequest.status,
                createdAt: rideRequest.createdAt,
            });
        } catch (error) {
            next(error);
        }
    };

    assignCab = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const uuidSchema = z.string().uuid();

            const validationResult = uuidSchema.safeParse(id);
            if (!validationResult.success) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid ride request ID format',
                });
            }

            const assignment = await this.cabAssignmentService.assignCabToRideRequest(id);

            res.status(200).json({
                rideRequestId: assignment.rideRequestId,
                cabId: assignment.cabId,
                assignedAt: assignment.assignedAt,
            });
        } catch (error) {
            next(error);
        }
    };
}
