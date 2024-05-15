import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const reviewRootUrl = `${config.BASE_URL}/reviews`;

const addReview = catchAsyncRequest(async (req, res) => {
  const userId = req.params.userId;
  const result = await ReviewServices.addReviewIntoDB(req.body, userId);

  const links = {
    self: `POST: ${reviewRootUrl}`,
    productReview: `GET: ${reviewRootUrl}/${result?.product}`,
    userReviews: `GET: ${reviewRootUrl}`,
  };

  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Thank you for giving review. Your Review accepted',
    data: result,
    links,
  });
});

export const ReviewControllers = {
  addReview,
};
