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
exports.PassengerController = void 0;
const passenger_service_1 = require("../services/passenger.service");
const zod_1 = require("zod");
const createPassengerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    phone: zod_1.z.string().min(10, 'Phone number must be at least 10 digits'),
});
class PassengerController {
    constructor() {
        this.createPassenger = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = createPassengerSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Validation Error',
                        errors: validationResult.error.errors,
                    });
                }
                const passenger = yield this.passengerService.createPassenger(validationResult.data);
                res.status(201).json({
                    id: passenger.id,
                    name: passenger.name,
                    phone: passenger.phone,
                    createdAt: passenger.createdAt,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.passengerService = new passenger_service_1.PassengerService();
    }
}
exports.PassengerController = PassengerController;
