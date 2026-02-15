"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideRequest_controller_1 = require("../controllers/rideRequest.controller");
const router = (0, express_1.Router)();
const rideRequestController = new rideRequest_controller_1.RideRequestController();
/**
 * @swagger
 * /ride-requests:
 *   post:
 *     summary: Create a new ride request
 *     tags: [RideRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passengerId
 *               - pickupLat
 *               - pickupLng
 *               - dropLat
 *               - dropLng
 *               - luggageCount
 *               - detourTolerance
 *             properties:
 *               passengerId:
 *                 type: string
 *                 format: uuid
 *               pickupLat:
 *                 type: number
 *               pickupLng:
 *                 type: number
 *               dropLat:
 *                 type: number
 *               dropLng:
 *                 type: number
 *               luggageCount:
 *                 type: integer
 *               detourTolerance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ride request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [PENDING, ASSIGNED, CANCELLED]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: Passenger not found
 */
router.post('/', rideRequestController.createRideRequest);
/**
 * @swagger
 * /ride-requests/{id}/assign:
 *   post:
 *     summary: Assign a cab to a ride request
 *     tags: [RideRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Ride Request ID
 *     responses:
 *       200:
 *         description: Cab assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rideRequestId:
 *                   type: string
 *                 cabId:
 *                   type: string
 *                 assignedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid ID or Ride Request not PENDING
 *       404:
 *         description: Ride Request not found
 *       409:
 *         description: No cabs available
 */
router.post('/:id/assign', rideRequestController.assignCab);
exports.default = router;
