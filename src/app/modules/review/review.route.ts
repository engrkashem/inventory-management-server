import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { ReviewControllers } from './review.controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.user),
  ReviewControllers.addReview,
);

router.get('/:productId', ReviewControllers.getSingleProductReviews);

export const ReviewRoutes = router;
