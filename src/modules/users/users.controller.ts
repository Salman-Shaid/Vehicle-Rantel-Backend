import { Request, Response } from 'express';
import * as UsersService from './users.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UsersService.getAll();
  res.json({ data: users });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const payload = req.body;
  // allow admin or owner
  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = await UsersService.update(userId, payload);
  res.json({ data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  await UsersService.deleteUser(userId);
  res.status(204).send();
};
