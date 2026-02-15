"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passenger_controller_1 = require("../controllers/passenger.controller");
const router = (0, express_1.Router)();
const passengerController = new passenger_controller_1.PassengerController();
/**
 * @swagger
 * /passengers:
 *   post:
 *     summary: Create a new passenger
 *     tags: [Passengers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: The passenger was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       409:
 *         description: Passenger already exists
 */
router.post('/', passengerController.createPassenger);
exports.default = router;
