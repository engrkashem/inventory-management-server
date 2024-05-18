import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constants';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.addProduct,
);

router.get('/', ProductControllers.getAllProducts);

router.get('/:productId', ProductControllers.getProduct);

router.patch(
  '/:productId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  ProductControllers.updateProduct,
);

router.delete(
  '/:productId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
