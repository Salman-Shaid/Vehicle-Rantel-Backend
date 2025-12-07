import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import * as BookingsController from './bookings.controller';

const router = Router();

router.post('/', authenticate, BookingsController.createBooking);

router.get('/', authenticate, BookingsController.getBookings); 

router.put('/:bookingId', authenticate, BookingsController.updateBooking); 

export default router;
