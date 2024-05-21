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

// endpoints to get orders of different state by related user
router.get(
  '/my-cart',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  OrderControllers.getMyOrderCart,
);

router.get(
  '/my-current-orders',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  OrderControllers.getMyCurrentOrders,
);

router.get(
  '/my-completed-orders',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  OrderControllers.getMyCurrentOrders,
);

// endpoints to get orders of diff state bt admin/officials
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getAllOrders,
);

router.get(
  '/placed-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getAllPlacedOrders,
);

router.get(
  '/running-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getAllRunningOrders,
);

router.get(
  '/completed-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getAllCompletedOrders,
);

router.get(
  '/cancelled-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getAllCancelledOrders,
);

router.get(
  '/:userId/placed-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getUsersPlacedOrders,
);

router.get(
  '/:userId/running-orders',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.getUsersRunningOrders,
);

export const OrderRoutes = router;
