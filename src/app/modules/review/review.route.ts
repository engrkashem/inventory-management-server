import { Router } from 'express';
import { ReviewControllers } from './review.controller';

const router = Router();

router.post('/add-review/:id', ReviewControllers.addReview);

export const ReviewRoutes = router;
