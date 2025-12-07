import { AuthRequest } from '../../middlewares/auth.middleware';
import { Request, Response } from 'express';
import * as BookingsService from './bookings.service';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const payload = req.body;
    const creatorId =
      req.user.role === 'customer' ? req.user.id : payload.customer_id;

    if (!creatorId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const booking = await BookingsService.create({
      ...payload,
      customer_id: creatorId,
    });

    return res.status(201).json({ data: booking });
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    if (req.user.role === 'admin') {
      const all = await BookingsService.getAll();
      return res.json({ data: all });
    } else {
      const own = await BookingsService.getByCustomer(req.user.id);
      return res.json({ data: own });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { bookingId } = req.params;
    const { action } = req.body;

    if (!bookingId || !action) {
      return res.status(400).json({ error: 'Booking ID and action are required' });
    }

    // Customer can cancel before start date
    if (req.user.role === 'customer' && action === 'cancel') {
      const updated = await BookingsService.cancelByCustomer(req.user.id, bookingId);
      return res.json({ data: updated });
    }

    // Admin can mark returned
    if (req.user.role === 'admin' && action === 'return') {
      const updated = await BookingsService.markReturned(bookingId);
      return res.json({ data: updated });
    }

    return res.status(403).json({ error: 'Forbidden or invalid action' });
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
};
