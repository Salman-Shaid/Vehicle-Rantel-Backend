import pool from '../../db/pool';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export const getAll = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id,name,email,phone,role,created_at FROM users ORDER BY created_at DESC');
    return res.rows;
  } finally {
    client.release();
  }
};

export const update = async (userId: string, payload: any) => {
  const client = await pool.connect();
  try {
    // allow updating name, phone, password; admin can update role/email too
    const fields: string[] = [];
    const values: any[] = [];
    if (payload.name) { values.push(payload.name); fields.push('name'); }
    if (payload.phone) { values.push(payload.phone); fields.push('phone'); }
    if (payload.password) { 
      if (payload.password.length < 6) throw { status: 400, message: 'Password too short' };
      const hashed = await bcrypt.hash(payload.password, SALT_ROUNDS);
      values.push(hashed); fields.push('password');
    }
    if (payload.email) { values.push(payload.email.toLowerCase()); fields.push('email'); }
    if (payload.role) { values.push(payload.role); fields.push('role'); }

    if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const result = await client.query(
      `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id,name,email,phone,role,created_at`,
      [...values, userId]
    );
    if (result.rowCount === 0) throw { status: 404, message: 'User not found' };
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const deleteUser = async (userId: string) => {
  const client = await pool.connect();
  try {
    // check no active bookings
    const chk = await client.query(
      `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    if (chk.rowCount > 0) throw { status: 400, message: 'Cannot delete user with active bookings' };
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
  } finally {
    client.release();
  }
};
