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
exports.RideRequestRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
class RideRequestRepository {
    createRideRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.rideRequest.create({
                data: Object.assign(Object.assign({}, data), { status: client_1.RideStatus.PENDING }),
                include: {
                    passenger: true,
                },
            });
        });
    }
    findPassengerById(passengerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.passenger.findUnique({
                where: {
                    id: passengerId,
                },
            });
        });
    }
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, tx = prisma_1.default) {
            return tx.rideRequest.findUnique({
                where: { id },
            });
        });
    }
    updateStatus(id_1, status_1) {
        return __awaiter(this, arguments, void 0, function* (id, status, tx = prisma_1.default) {
            return tx.rideRequest.update({
                where: { id },
                data: { status },
            });
        });
    }
}
exports.RideRequestRepository = RideRequestRepository;
