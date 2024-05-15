import { Router } from 'express';
import { ProductControllers } from './product.controller';

const router = Router();

router.post('/', ProductControllers.addProduct);

export const ProductRoutes = router;
