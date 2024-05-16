import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = Router();

/*** User routes ***/
router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
