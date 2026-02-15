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
exports.RideRequestService = void 0;
const rideRequest_repository_1 = require("../repositories/rideRequest.repository");
const error_middleware_1 = require("../middleware/error.middleware");
class RideRequestService {
    constructor() {
        this.rideRequestRepository = new rideRequest_repository_1.RideRequestRepository();
    }
    createRideRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passenger = yield this.rideRequestRepository.findPassengerById(data.passengerId);
            if (!passenger) {
                throw new error_middleware_1.AppError('Passenger not found. Cannot create ride request.', 404);
            }
            return this.rideRequestRepository.createRideRequest(data);
        });
    }
}
exports.RideRequestService = RideRequestService;
