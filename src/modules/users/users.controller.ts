import { Request, Response } from 'express';
import * as UsersService from './users.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

/**
 * Get all users
 * Access: Admin only
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const users = await UsersService.getAll();
    res.status(200).json({ success: true, message: 'Users retrieved successfully', data: users });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

/**
 * Update user
 * Access: Admin or own profile
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    const payload = req.body;

    // Allow only admin or owner
    if (!req.user || (req.user.role !== 'admin' && req.user.id !== userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // If password is provided, hash it
    if (payload.password) {
      if (payload.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
    }

    const user = await UsersService.update(userId, payload);
    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

/**
 * Delete user
 * Access: Admin only
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await UsersService.deleteUser(userId);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};
