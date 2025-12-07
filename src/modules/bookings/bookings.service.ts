import pool from '../../db/pool';
import { daysBetween } from '../../utils/dateUtils';

type CreatePayload = {
  customer_id: string; 
  vehicle_id: string;
  rent_start_date: string; 
  rent_end_date: string;
};

export const create = async (payload: CreatePayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw { status: 400, message: 'Missing fields' };
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    throw { status: 400, message: 'Invalid rent dates' };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');


    const vRes = await client.query('SELECT id,daily_rent_price,availability_status FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
    if (vRes.rowCount === 0) throw { status: 404, message: 'Vehicle not found' };
    const vehicle = vRes.rows[0];
    if (vehicle.availability_status !== 'available') throw { status: 400, message: 'Vehicle not available' };


    const days = daysBetween(rent_start_date, rent_end_date);
    const total = Number(vehicle.daily_rent_price) * days;
    if (total <= 0) throw { status: 400, message: 'Total price must be positive' };


    const bk = await client.query(
      `INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
       [customer_id, vehicle_id, rent_start_date, rent_end_date, total.toFixed(2), 'active']
    );


    await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['booked', vehicle_id]);

    await client.query('COMMIT');
    return bk.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getAll = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return res.rows;
  } finally {
    client.release();
  }
};

export const getByCustomer = async (customerId: string) => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC', [customerId]);
    return res.rows;
  } finally {
    client.release();
  }
};

export const cancelByCustomer = async (customerId: string, bookingId: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');


    const res = await client.query('SELECT * FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
    if (res.rowCount === 0) throw { status: 404, message: 'Booking not found' };
    const booking = res.rows[0];
    if (booking.customer_id !== customerId) throw { status: 403, message: 'Not your booking' };
    const today = new Date();
    const start = new Date(booking.rent_start_date);
    if (today >= start) throw { status: 400, message: 'Cannot cancel after start date' };


    await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', bookingId]);


    await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['available', booking.vehicle_id]);

    await client.query('COMMIT');
    return { id: bookingId, status: 'cancelled' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const markReturned = async (bookingId: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query('SELECT * FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
    if (res.rowCount === 0) throw { status: 404, message: 'Booking not found' };
    const booking = res.rows[0];

    await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['returned', bookingId]);
    await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['available', booking.vehicle_id]);

    await client.query('COMMIT');
    return { id: bookingId, status: 'returned' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
