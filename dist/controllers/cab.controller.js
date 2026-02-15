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
exports.CabController = void 0;
const cab_service_1 = require("../services/cab.service");
const zod_1 = require("zod");
const createCabSchema = zod_1.z.object({
    driverName: zod_1.z.string().min(1, 'Driver name is required'),
    totalSeats: zod_1.z.number().int().positive('Total seats must be a positive integer'),
    luggageCapacity: zod_1.z.number().int().min(0, 'Luggage capacity must be non-negative'),
});
class CabController {
    constructor() {
        this.createCab = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = createCabSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Validation Error',
                        errors: validationResult.error.errors,
                    });
                }
                const cab = yield this.cabService.createCab(validationResult.data);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.cabService = new cab_service_1.CabService();
    }
}
exports.CabController = CabController;
