import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constants';
import { SalesControllers } from './sales.controller';
import { SalesValidations } from './sales.validation';

const router = Router();

router.post(
  '/make-payment',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  validateRequest(SalesValidations.makePaymentToConfirmOrderValidationSchema),
  SalesControllers.makePaymentToConfirmOrder,
);

export const SalesRoutes = router;
