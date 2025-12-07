import { Request, Response } from 'express';
import * as VehiclesService from './vehicles.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const vehicle = await VehiclesService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server error',
    });
  }
};

export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await VehiclesService.getAll();
    if (vehicles.length === 0) {
      return res.json({
        success: true,
        message: 'No vehicles found',
        data: [],
      });
    }
    res.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles,
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server error',
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      return res.status(400).json({ success: false, error: 'Vehicle ID is required' });
    }

    const vehicle = await VehiclesService.getById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    res.json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server error',
    });
  }
};


export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      return res.status(400).json({ success: false, error: 'Vehicle ID is required' });
    }

    const updated = await VehiclesService.update(vehicleId, req.body);
    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server error',
    });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) {
      return res.status(400).json({ success: false, error: 'Vehicle ID is required' });
    }

    await VehiclesService.deleteVehicle(vehicleId);
    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Server error',
    });
  }
};
