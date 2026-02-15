import { Router } from 'express';
import { PassengerController } from '../controllers/passenger.controller';

const router = Router();
const passengerController = new PassengerController();

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

export default router;
