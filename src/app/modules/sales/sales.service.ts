import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import { TSales } from './sales.interface';

const makePaymentToConfirmOrderIntoDB = async (
  userId: string,
  payload: Partial<TSales>,
) => {
  // check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // check if order exists
  const order = await Order.isOrderExists(payload?.order);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order is not found');
  }

  // check if authorized user and order by user is same
  if (userId != order?.buyer) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized access');
  }

  const amountToBeDeducted = Number(order?.netAmount);

  return amountToBeDeducted;
};

export const SalesServices = {
  makePaymentToConfirmOrderIntoDB,
};
