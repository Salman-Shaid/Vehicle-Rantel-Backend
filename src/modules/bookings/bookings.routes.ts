import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import * as BookingsController from './bookings.controller';

const router = Router();

router.post('/', authenticate, BookingsController.createBooking); // customer or admin allowed inside controller checks
router.get('/', authenticate, BookingsController.getBookings); // role-based: admin -> all, customer -> own
router.put('/:bookingId', authenticate, BookingsController.updateBooking); // role-based logic inside

export default router;
