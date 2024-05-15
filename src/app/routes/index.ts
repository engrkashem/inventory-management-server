import { Router } from 'express';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
