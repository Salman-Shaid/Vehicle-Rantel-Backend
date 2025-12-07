import { AuthRequest } from '../../middlewares/auth.middleware';
import { Request, Response } from 'express';
import * as BookingsService from './bookings.service';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const payload = req.body;
    const creatorId =
      req.user.role === 'customer' ? req.user.id : payload.customer_id;

    if (!creatorId) {
      return res.status(400).json({ success: false, message: 'Customer ID is required' });
    }

    const booking = await BookingsService.create({
      ...payload,
      customer_id: creatorId,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    if (req.user.role === 'admin') {
      const all = await BookingsService.getAll();
      return res.json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: all
      });
    } else {
      const own = await BookingsService.getByCustomer(req.user.id);
      return res.json({
        success: true,
        message: 'Your bookings retrieved successfully',
        data: own
      });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: 'Booking ID and status are required' });
    }

    if (req.user.role === 'customer' && status === 'cancelled') {
      const updated = await BookingsService.cancelByCustomer(req.user.id, bookingId);
      return res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: updated
      });
    }


    if (req.user.role === 'admin' && status === 'returned') {
      const updated = await BookingsService.markReturned(bookingId);
      return res.json({
        success: true,
        message: 'Booking marked as returned. Vehicle is now available',
        data: updated
      });
    }

    return res.status(403).json({ success: false, message: 'Forbidden or invalid action' });
  } catch (err: any) {
    console.error(err);
    return res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};
