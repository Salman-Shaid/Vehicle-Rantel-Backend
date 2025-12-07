import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: 'admin' | 'customer' };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload & {
      id: string;
      email: string;
      role: 'admin' | 'customer';
    };

    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
