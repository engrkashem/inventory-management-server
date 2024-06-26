import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { TAddToCartIntoDBPayload, TOrder } from './order.interface';
import { Order } from './order.model';

const addToCartIntoDB = async (
  userId: string,
  payload: TAddToCartIntoDBPayload,
) => {
  // check if user exists
  const user = await User.isUserExists(userId);

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

  const orderAmount = Math.ceil(
    Number(payload.orderQty) * Number(product.price),
  );
  const netAmount = Math.ceil(orderAmount - Number(payload.discount || 0));

  // set orderAmount and netAmount
  const addToCartData: Partial<TOrder> = {
    product: new Types.ObjectId(payload.product),
    orderQty: payload.orderQty,
    discount: payload.discount ? payload.discount : 0,
    orderAmount,
    netAmount,
  };

  // update buyer
  addToCartData.buyer = new Types.ObjectId(user._id);

  const result = await Order.create(addToCartData);

  return result;
};

const updateProductQtyIntoDB = async (
  orderId: string,
  userId: string,
  payload: { orderQty: number },
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

  // check if product exists
  const product = await Product.findById(order.product);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found in store');
  }

  if (product.qty < payload.orderQty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You ordered quantity is unavailable. Only ${product.qty} available in store`,
    );
  }
  const updatedData: {
    orderQty: number;
    orderAmount: number;
    netAmount?: number;
  } = {
    ...payload,
    orderAmount: Math.ceil(payload.orderQty * Number(product.price)),
  };

  updatedData.netAmount = Math.ceil(
    updatedData.orderAmount - Number(order?.discount || 0),
  );

  const result = await Order.findByIdAndUpdate(orderId, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const updateDeliveryStatusIntoDB = async (orderId: string) => {
  // check if order exists
  const order = await Order.findOne({
    _id: orderId,
    isPaymentOk: true,
    isDelivered: false,
    isCancelled: false,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order is not found');
  }

  // change delivery status
  const result = await Order.findByIdAndUpdate(
    order?._id,
    {
      isDelivered: true,
    },
    { new: true, runValidators: true },
  );

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
    Order.find({
      buyer: user?._id,
      isPaymentOk: false,
      isCancelled: false,
    }).populate('product'),
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
  const userOrdersQuery = new QueryBuilder<TOrder>(
    Order.find({
      buyer: user?._id,
      isPaymentOk: true,
      isDelivered: false,
      isCancelled: false,
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userOrdersQuery.modelQuery;
  const pagination = await userOrdersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getMyCompletedOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // Get all orders from user cart
  const userCompletedOrdersQuery = new QueryBuilder<TOrder>(
    Order.find({
      buyer: user?._id,
      isPaymentOk: true,
      isDelivered: true,
      isCancelled: false,
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userCompletedOrdersQuery.modelQuery;
  const pagination = await userCompletedOrdersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(Order.find(), query)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getAllPlacedOrdersFromDB = async (query: Record<string, unknown>) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({ isPaymentOk: false, isCancelled: false }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getAllPendingDeliveryOrdersFromDB = async (
  query: Record<string, unknown>,
) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({ isPaymentOk: true, isDelivered: false, isCancelled: false }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getAllCompletedOrdersFromDB = async (query: Record<string, unknown>) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({ isPaymentOk: true, isDelivered: true, isCancelled: false }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getAllCancelledOrdersFromDB = async (query: Record<string, unknown>) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({ isCancelled: true }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getUsersPlacedOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({ buyer: userId, isPaymentOk: false, isCancelled: false }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getUsersRunningOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Get all orders from user cart
  const ordersQuery = new QueryBuilder<TOrder>(
    Order.find({
      buyer: userId,
      isPaymentOk: true,
      isDelivered: false,
      isCancelled: false,
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await ordersQuery.modelQuery;
  const pagination = await ordersQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

export const OrderServices = {
  addToCartIntoDB,
  updateProductQtyIntoDB,
  updateDeliveryStatusIntoDB,
  getMyOrderCartFromDB,
  getMyCurrentOrdersFromDB,
  getMyCompletedOrdersFromDB,
  getAllOrdersFromDB,
  getAllPlacedOrdersFromDB,
  getAllPendingDeliveryOrdersFromDB,
  getAllCompletedOrdersFromDB,
  getAllCancelledOrdersFromDB,
  getUsersPlacedOrdersFromDB,
  getUsersRunningOrdersFromDB,
};
