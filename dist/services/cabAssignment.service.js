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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabAssignmentService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cabAssignment_repository_1 = require("../repositories/cabAssignment.repository");
const rideRequest_repository_1 = require("../repositories/rideRequest.repository");
const cab_repository_1 = require("../repositories/cab.repository");
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
class CabAssignmentService {
    constructor() {
        this.cabAssignmentRepository = new cabAssignment_repository_1.CabAssignmentRepository();
        this.rideRequestRepository = new rideRequest_repository_1.RideRequestRepository();
        this.cabRepository = new cab_repository_1.CabRepository();
    }
    assignCabToRideRequest(rideRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rideRequest = yield this.rideRequestRepository.findById(rideRequestId);
            if (!rideRequest) {
                throw new error_middleware_1.AppError('Ride request not found', 404);
            }
            if (rideRequest.status !== client_1.RideStatus.PENDING) {
                throw new error_middleware_1.AppError(`Ride request is already ${rideRequest.status}`, 400);
            }
            // Start Transaction
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Find first available cab WITH LOCK
                // This prevents race conditions where multiple requests might try to claim the last seat of the same cab concurrently.
                // The FOR UPDATE clause in the raw query locks the selected row until the end of this transaction.
                const availableCab = yield this.cabRepository.findFirstAvailableWithLock(tx);
                if (!availableCab) {
                    throw new error_middleware_1.AppError('No cabs available at the moment', 409);
                }
                // 2. Decrement seats and update status if needed
                const newAvailableSeats = availableCab.availableSeats - 1;
                const newStatus = newAvailableSeats === 0 ? client_1.CabStatus.FULL : client_1.CabStatus.AVAILABLE;
                yield this.cabRepository.updateCab(availableCab.id, {
                    availableSeats: newAvailableSeats,
                    status: newStatus,
                }, tx);
                // 3. Create Assignment
                const assignment = yield this.cabAssignmentRepository.createAssignment({
                    cabId: availableCab.id,
                    rideRequestId: rideRequestId,
                }, tx);
                // 4. Update Ride Request Status
                yield this.rideRequestRepository.updateStatus(rideRequestId, client_1.RideStatus.ASSIGNED, tx);
                return assignment;
            }));
        });
    }
}
exports.CabAssignmentService = CabAssignmentService;
