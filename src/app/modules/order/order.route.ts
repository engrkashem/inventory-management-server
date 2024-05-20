import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constants';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';

const router = Router();

router.post(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  validateRequest(OrderValidations.addOrderValidationSchema),
  OrderControllers.addToCart,
);

router.patch(
  '/:orderId/update-qty',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  validateRequest(OrderValidations.updateOrderQtyValidationSchema),
  OrderControllers.updateProductQty,
);

export const OrderRoutes = router;
