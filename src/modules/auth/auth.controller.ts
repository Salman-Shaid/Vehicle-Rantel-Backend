import { Request, Response } from 'express';
import * as AuthService from './auth.service';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  const user = await AuthService.signup({ name, email, password, phone, role });
  res.status(201).json({ data: user });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await AuthService.signin(email, password);
  res.json({ token });
};
