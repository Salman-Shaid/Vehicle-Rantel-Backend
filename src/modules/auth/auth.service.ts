import pool from '../../db/pool';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXP = process.env.JWT_EXPIRATION || '7d';

type SignupInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'customer';
};

export const signup = async (input: SignupInput) => {
  const { name, email, password, phone, role } = input;
  if (!name || !email || !password || !phone || !role)
    throw { status: 400, message: 'Missing fields' };

  if (password.length < 6)
    throw { status: 400, message: 'Password must be at least 6 characters' };

  const client = await pool.connect();
  try {
    const check = await client.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (check.rows.length > 0)
      throw { status: 400, message: 'Email already in use' };

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await client.query(
      `INSERT INTO users (name,email,password,phone,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,name,email,phone,role,created_at`,
      [name, email.toLowerCase(), hashed, phone, role]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
};

export const signin = async (email: string, password: string) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT id,email,password,role FROM users WHERE LOWER(email)=LOWER($1)',
      [email]
    );

    if (res.rowCount === 0)
      throw { status: 401, message: 'Invalid credentials' };

    const user = res.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw { status: 401, message: 'Invalid credentials' };

    const payload = { id: user.id, email: user.email, role: user.role };

    // ✅ v8 usage: works perfectly
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP,
      algorithm: 'HS256',
    });

    return token;
  } finally {
    client.release();
  }
};
