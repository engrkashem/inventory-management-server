import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const addToCartIntoDB = async (payload: TOrder) => {
  // check if user exists
  const user = await User.isUserExists(payload.buyer);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user/buyer is not found');
  }

  // check if product exists
  const product = await Product.isProductExists(payload.product);

  if (!product || product.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This product is not found');
  }

  // check if order exists
  const order = await Order.findOne({
    product: payload.product,
    isPaymentOk: false,
  });

  if (order) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This product is already added to cart',
    );
  }

  // calculate orderAmount and netAmount

  const orderAmount = Number(payload.orderQty) * Number(product.price);
  const netAmount = orderAmount - Number(payload.discount || 0);

  // set orderAmount and netAmount
  payload.orderAmount = orderAmount;
  payload.netAmount = netAmount;

  const result = await Order.create(payload);

  return result;
};

export const OrderServices = {
  addToCartIntoDB,
};
