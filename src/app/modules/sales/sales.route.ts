import { Router } from 'express';
import { SalesControllers } from './sales.controller';

const router = Router();

router.post('/:salesId', SalesControllers.confirmOrder);

export const SalesRoutes = router;
