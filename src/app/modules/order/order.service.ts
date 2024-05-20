import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
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

const updateProductQtyIntoDB = async (
  orderId: string,
  userId: string,
  payload: { quantity: number },
) => {
  // check if order exists into cart
  const order = await Order.findOne({
    _id: orderId,
    buyer: userId,
    isPaymentOk: false,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order is not found in your cart');
  }

  const result = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getMyOrderCartFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // Get all orders from user cart
  const userCartQuery = new QueryBuilder<TOrder>(
    Order.find({ buyer: user?._id, isPaymentOk: false }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userCartQuery.modelQuery;
  const pagination = await userCartQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getMyCurrentOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // Get all orders from user cart
  const userCartQuery = new QueryBuilder<TOrder>(
    Order.find({
      buyer: user?._id,
      isPaymentOk: true,
      isDelivered: false,
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userCartQuery.modelQuery;
  const pagination = await userCartQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

export const OrderServices = {
  addToCartIntoDB,
  updateProductQtyIntoDB,
  getMyOrderCartFromDB,
  getMyCurrentOrdersFromDB,
};
