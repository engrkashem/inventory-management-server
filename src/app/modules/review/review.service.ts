import { TReview } from './review.interface';
import { Review } from './review.model';

const addReviewIntoDB = async (payload: TReview, userId: string) => {
  payload.user = userId;
  const result = await Review.create(payload);

  return result;
};

export const ReviewServices = {
  addReviewIntoDB,
};
