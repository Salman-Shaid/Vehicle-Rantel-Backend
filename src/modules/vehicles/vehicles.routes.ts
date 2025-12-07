import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import * as VehiclesController from './vehicles.controller';

const router = Router();

router.post('/', authenticate, authorizeRoles(['admin']), VehiclesController.createVehicle);
router.get('/', VehiclesController.getAllVehicles);
router.get('/:vehicleId', VehiclesController.getVehicleById);
router.put('/:vehicleId', authenticate, authorizeRoles(['admin']), VehiclesController.updateVehicle);
router.delete('/:vehicleId', authenticate, authorizeRoles(['admin']), VehiclesController.deleteVehicle);

export default router;
