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
exports.CabRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
class CabRepository {
    createCab(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.cab.create({
                data,
            });
        });
    }
    findFirstAvailable() {
        return __awaiter(this, arguments, void 0, function* (tx = prisma_1.default) {
            return tx.cab.findFirst({
                where: {
                    status: client_1.CabStatus.AVAILABLE,
                    availableSeats: {
                        gt: 0,
                    },
                },
                orderBy: {
                    createdAt: 'asc', // FIFO assignment
                },
            });
        });
    }
    findFirstAvailableWithLock() {
        return __awaiter(this, arguments, void 0, function* (tx = prisma_1.default) {
            const result = yield tx.$queryRaw `
            SELECT * FROM "Cab"
            WHERE status = 'AVAILABLE'
            AND "availableSeats" > 0
            ORDER BY "createdAt" ASC
            LIMIT 1
            FOR UPDATE
        `;
            return result.length > 0 ? result[0] : null;
        });
    }
    updateCab(id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, tx = prisma_1.default) {
            return tx.cab.update({
                where: { id },
                data,
            });
        });
    }
}
exports.CabRepository = CabRepository;
