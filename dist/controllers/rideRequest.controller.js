"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestController = void 0;
const rideRequest_service_1 = require("../services/rideRequest.service");
const cabAssignment_service_1 = require("../services/cabAssignment.service");
const zod_1 = require("zod");
const createRideRequestSchema = zod_1.z.object({
    passengerId: zod_1.z.string().uuid('Invalid passenger ID'),
    pickupLat: zod_1.z.number().min(-90).max(90),
    pickupLng: zod_1.z.number().min(-180).max(180),
    dropLat: zod_1.z.number().min(-90).max(90),
    dropLng: zod_1.z.number().min(-180).max(180),
    luggageCount: zod_1.z.number().int().min(0),
    detourTolerance: zod_1.z.number().min(0).max(100),
});
class RideRequestController {
    constructor() {
        this.createRideRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = createRideRequestSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Validation Error',
                        errors: validationResult.error.errors,
                    });
                }
                const rideRequest = yield this.rideRequestService.createRideRequest(validationResult.data);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.assignCab = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const uuidSchema = zod_1.z.string().uuid();
                const validationResult = uuidSchema.safeParse(id);
                if (!validationResult.success) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid ride request ID format',
                    });
                }
                const assignment = yield this.cabAssignmentService.assignCabToRideRequest(id);
                res.status(200).json({
                    rideRequestId: assignment.rideRequestId,
                    cabId: assignment.cabId,
                    assignedAt: assignment.assignedAt,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.rideRequestService = new rideRequest_service_1.RideRequestService();
        this.cabAssignmentService = new cabAssignment_service_1.CabAssignmentService();
    }
}
exports.RideRequestController = RideRequestController;
