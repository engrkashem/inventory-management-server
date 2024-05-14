import catchAsyncRequest from '../../utils/catchAsyncRequest';
import { ReviewServices } from './review.service';

const addReview = catchAsyncRequest(async (req, res) => {
  const userId = req.params.id;
  const result = await ReviewServices.addReviewIntoDB(req.body, userId);

  res.json({ success: true, data: result });
});

export const ReviewControllers = {
  addReview,
};
