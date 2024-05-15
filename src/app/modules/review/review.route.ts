import { Router } from 'express';
import { ReviewControllers } from './review.controller';

const router = Router();

router.post('/:userId', ReviewControllers.addReview);

export const ReviewRoutes = router;
