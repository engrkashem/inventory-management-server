import { TReview } from './review.interface';
import { Review } from './review.model';

const addReviewIntoDB = async (review: TReview, userId: string) => {
  review.user = userId;
  const result = await Review.create(review);

  return result;
};

export const ReviewServices = {
  addReviewIntoDB,
};
