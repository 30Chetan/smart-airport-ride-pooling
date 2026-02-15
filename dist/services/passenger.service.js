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
exports.PassengerService = void 0;
const passenger_repository_1 = require("../repositories/passenger.repository");
const error_middleware_1 = require("../middleware/error.middleware");
class PassengerService {
    constructor() {
        this.passengerRepository = new passenger_repository_1.PassengerRepository();
    }
    createPassenger(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPassenger = yield this.passengerRepository.findByPhone(data.phone);
            if (existingPassenger) {
                throw new error_middleware_1.AppError('Passenger with this phone number already exists', 409);
            }
            return this.passengerRepository.createPassenger(data);
        });
    }
}
exports.PassengerService = PassengerService;
