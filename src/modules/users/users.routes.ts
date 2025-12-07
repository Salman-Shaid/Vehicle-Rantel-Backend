import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import * as UsersController from './users.controller';

const router = Router();

router.get('/', authenticate, authorizeRoles(['admin']), UsersController.getAllUsers);
router.put('/:userId', authenticate, UsersController.updateUser); 
router.delete('/:userId', authenticate, authorizeRoles(['admin']), UsersController.deleteUser);

export default router;
