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

const updateProductQty = catchAsyncRequest(async (req, res) => {
  const { _id: userId } = req.user;
  const { orderId } = req.params;
  const result = await OrderServices.updateProductQtyIntoDB(
    orderId,
    userId,
    req.body,
  );

  const links = {
    self: `PATCH: ${orderRootUrl}/${result?._id}/update-qty`,
    order: `GET: ${orderRootUrl}/${result?._id}`,
    product: `GET: ${config.BASE_URL}/products/${result?.product}`,
    reviews: `GET: ${config.BASE_URL}/reviews/${result?.product}`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Order quantity is updated successfully',
    data: result,
    pagination: {},
    links,
  });
});

const getMyOrderCart = catchAsyncRequest(async (req, res) => {
  const { _id: userId } = req.user;

  const { result, pagination } = await OrderServices.getMyOrderCartFromDB(
    userId,
    req.query,
  );

  const links = {
    self: `GET: ${orderRootUrl}/my-cart`,
    prevPage:
      pagination?.page <= 1
        ? null
        : `GET: ${orderRootUrl}/my-cart?page=${pagination?.page - 1}&limit=${pagination?.limit}`,
    nextPage:
      pagination?.page >= pagination?.totalPage
        ? null
        : `GET: ${orderRootUrl}/my-cart??page=${pagination?.page + 1}&limit=${pagination?.limit}`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User's cart retrieved successfully",
    data: result,
    pagination,
    links,
  });
});

export const OrderControllers = {
  addToCart,
  updateProductQty,
  getMyOrderCart,
};
