import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.get(
  '/:orderId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  PaymentControllers.makePayment,
);

export const PaymentRoutes = router;
