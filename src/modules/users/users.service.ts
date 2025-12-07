import pool from '../../db/pool';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  password?: string;
  email?: string;
  role?: 'admin' | 'customer';
}

export const getAll = async (): Promise<User[]> => {
  const client = await pool.connect();
  try {
    const res = await client.query<User>(
      'SELECT id,name,email,phone,role,created_at FROM users ORDER BY created_at DESC'
    );
    return res.rows;
  } finally {
    client.release();
  }
};

export const update = async (userId: string, payload: UpdateUserPayload): Promise<User> => {
  const client = await pool.connect();
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (payload.name) { fields.push('name'); values.push(payload.name); }
    if (payload.phone) { fields.push('phone'); values.push(payload.phone); }
    if (payload.password) { 
      if (payload.password.length < 6) throw { status: 400, message: 'Password too short' };
      const hashed = await bcrypt.hash(payload.password, SALT_ROUNDS);
      fields.push('password');
      values.push(hashed);
    }
    if (payload.email) { fields.push('email'); values.push(payload.email.toLowerCase()); }
    if (payload.role) { fields.push('role'); values.push(payload.role); }

    if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id,name,email,phone,role,created_at`;

    const result = await client.query<User>(query, [...values, userId]);
    const user = result.rows[0];
    if (!user) throw { status: 404, message: 'User not found' };

    return user;
  } finally {
    client.release();
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const client = await pool.connect();
  try {
    const chk = await client.query(
      `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    const activeBookings = chk.rowCount ?? 0;
    if (activeBookings > 0) throw { status: 400, message: 'Cannot delete user with active bookings' };

    await client.query('DELETE FROM users WHERE id = $1', [userId]);
  } finally {
    client.release();
  }
};
