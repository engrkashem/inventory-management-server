import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constants';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';

const router = Router();

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  validateRequest(PaymentValidations.makePaymentValidationSchema),
  PaymentControllers.makePayment,
);

export const PaymentRoutes = router;
