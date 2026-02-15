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
exports.CabService = void 0;
const cab_repository_1 = require("../repositories/cab.repository");
const client_1 = require("@prisma/client");
class CabService {
    constructor() {
        this.cabRepository = new cab_repository_1.CabRepository();
    }
    createCab(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, input), { availableSeats: input.totalSeats, availableLuggageCapacity: input.luggageCapacity, status: client_1.CabStatus.AVAILABLE, version: 1 });
            return this.cabRepository.createCab(data);
        });
    }
}
exports.CabService = CabService;
