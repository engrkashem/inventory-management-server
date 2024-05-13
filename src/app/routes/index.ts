import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
