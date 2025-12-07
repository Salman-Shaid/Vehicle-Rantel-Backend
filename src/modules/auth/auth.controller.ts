import { Request, Response } from 'express';
import * as AuthService from './auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await AuthService.signup({ name, email, password, phone, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await AuthService.signin(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user },
    });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' });
  }
};
