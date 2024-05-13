import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

/*** User routes ***/
router.post('/create-user', UserControllers.createUser);

export const UserRoutes = router;
