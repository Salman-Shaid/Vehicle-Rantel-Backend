import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import * as BookingsController from './bookings.controller';

const router = Router();

authorizeRoles(['admin', 'customer'])

router.post('/', authenticate, authorizeRoles(['admin', 'customer']), BookingsController.createBooking);
router.get('/', authenticate, authorizeRoles(['admin', 'customer']), BookingsController.getBookings); 
router.put('/:bookingId', authenticate, authorizeRoles(['admin', 'customer']), BookingsController.updateBooking);


export default router;
