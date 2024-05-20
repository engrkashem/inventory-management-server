import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const orderRootUrl = `${config.BASE_URL}/orders`;

const addToCart = catchAsyncRequest(async (req, res) => {
  const result = await OrderServices.addToCartIntoDB(req.body);

  const links = {
    self: `POST: ${orderRootUrl}`,
    order: `GET: ${orderRootUrl}/${result?._id}`,
    product: `GET: ${config.BASE_URL}/products/${result?.product}`,
    reviews: `GET: ${config.BASE_URL}/reviews/${result?.product}`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'This product is added to your cart',
    data: result,
    pagination: {},
    links,
  });
});

export const OrderControllers = {
  addToCart,
};
