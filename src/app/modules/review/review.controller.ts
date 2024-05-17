import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const reviewRootUrl = `${config.BASE_URL}/reviews`;

const addReview = catchAsyncRequest(async (req, res) => {
  const { _id } = req.user;

  const result = await ReviewServices.addReviewIntoDB(req.body, _id);

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

const getSingleProductReviews = catchAsyncRequest(async (req, res) => {
  const { productId } = req.params;
  const { data, pagination } =
    await ReviewServices.getSingleProductReviewsFromDB(productId, req.query);

  const links = {
    self: `GET: ${config.BASE_URL}/reviews/${data?.product?._id}/page=${pagination?.page}&limit=${pagination?.limit}`,

    prevPage:
      pagination?.page <= 1
        ? null
        : `GET: ${config.BASE_URL}/reviews/${data?.product?._id}/page=${pagination?.page - 1}&limit=${pagination?.limit}`,
    nextPage:
      pagination?.page >= pagination?.totalPage
        ? null
        : `GET: ${config.BASE_URL}/reviews/${data?.product?._id}/page=${pagination?.page + 1}&limit=${pagination?.limit}`,
    product: `GET: ${config.BASE_URL}/products/${data?.product?._id}`,
    allProducts: `GET: ${config.BASE_URL}/products`,
  };

  // send response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Product reviews are retrieved successfully.',
    data,
    pagination,
    links,
  });
});

export const ReviewControllers = {
  addReview,
  getSingleProductReviews,
};
