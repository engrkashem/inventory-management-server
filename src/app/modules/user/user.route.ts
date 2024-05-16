import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

/*** User routes ***/
router.post('/signup', UserControllers.createUser);

export const UserRoutes = router;
