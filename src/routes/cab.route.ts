import { Router } from 'express';
import { CabController } from '../controllers/cab.controller';

const router = Router();
const cabController = new CabController();

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

export default router;
