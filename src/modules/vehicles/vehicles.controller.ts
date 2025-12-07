import { Request, Response } from 'express';
import * as VehiclesService from './vehicles.service';

// Helper to validate vehicleId
const getVehicleId = (id: string | undefined): string => {
  if (!id) throw { status: 400, message: 'Vehicle ID is required' };
  return id;
};

// Create vehicle
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehiclesService.create(req.body);
    res.status(201).json({ data: vehicle });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

// Get all vehicles
export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await VehiclesService.getAll();
    res.json({ data: vehicles });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = getVehicleId(req.params.vehicleId);
    const vehicle = await VehiclesService.getById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ data: vehicle });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

// Update vehicle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = getVehicleId(req.params.vehicleId);
    const updated = await VehiclesService.update(vehicleId, req.body);
    res.json({ data: updated });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

// Delete vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = getVehicleId(req.params.vehicleId);
    await VehiclesService.deleteVehicle(vehicleId);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};
