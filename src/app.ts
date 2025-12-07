// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import vehicleRoutes from './modules/vehicles/vehicles.routes';
import bookingRoutes from './modules/bookings/bookings.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
app.use(express.json());

// API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// error handler
app.use(errorHandler);

export default app;
