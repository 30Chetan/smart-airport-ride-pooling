"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cab_controller_1 = require("../controllers/cab.controller");
const router = (0, express_1.Router)();
const cabController = new cab_controller_1.CabController();
/**
 * @swagger
 * /cabs:
 *   post:
 *     summary: Create a new cab
 *     tags: [Cabs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverName
 *               - totalSeats
 *               - luggageCapacity
 *             properties:
 *               driverName:
 *                 type: string
 *               totalSeats:
 *                 type: integer
 *                 minimum: 1
 *               luggageCapacity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Cab created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 driverName:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [AVAILABLE, FULL, OFFLINE]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 */
router.post('/', cabController.createCab);
exports.default = router;
