import { Router } from 'express';
import { SalesControllers } from './sales.controller';

const router = Router();

router.post('/:transactionId', SalesControllers.confirmOrder);

export const SalesRoutes = router;
