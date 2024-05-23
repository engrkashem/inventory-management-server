import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { Sales } from '../sales/sales.model';
import { User } from '../user/user.model';
import { getUniqueId, initializeSSLCommerzPayment } from './payment.utils';

const makePaymentIntoDB = async (userId: string, orders: string[]) => {
  // check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // check if user profile(name, address) is updated
  if (
    !user?.name ||
    !user?.name?.firstName ||
    !user?.address ||
    !user?.address?.street ||
    !user?.address?.district ||
    !user?.address?.country ||
    !user?.contactNo
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please update your profile (name, address, contact number)',
    );
  }

  // check all orders exists and calculate payable amount
  const ordersWithTotalAmountAndProducts = await Order.aggregate([
    { $match: { _id: { $in: orders.map((id) => new Types.ObjectId(id)) } } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$netAmount' },
        ordersDetails: { $push: '$$ROOT' },
      },
    },
  ]);

  const { ordersDetails, totalAmount } = ordersWithTotalAmountAndProducts[0];

  const orderInfo = ordersDetails.map((item) => ({
    order: item._id,
    product: item.product,
    qty: item.orderQty,
    price: item.netAmount,
  }));

  // check if some orders missing
  if (ordersDetails.length !== orders.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Some order are invalid');
  }

  // SSLCommerz payment process
  const nonce = String(totalAmount);
  const message = orders.join('-');
  const uid = await getUniqueId(nonce + message);
  const _id = new Types.ObjectId(uid);

  // check if already payment completed
  const sales = await Sales.isSalesExists(uid);

  if (sales?.transactionInfo?.isConfirmed) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment already made');
  }

  // request to sslcommerz for payment processing
  const { transaction_response, tran_id } = await initializeSSLCommerzPayment(
    orders,
    totalAmount,
    user,
    uid,
  );

  const { status, sessionkey, GatewayPageURL } = transaction_response;

  if (status === 'SUCCESS') {
    await Sales.findByIdAndUpdate(
      _id,
      {
        _id,
        buyer: user?._id,
        orderInfo,
        amount: totalAmount,
        transactionInfo: {
          sessionkey,
          transactionId: tran_id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }

  return {
    sessionkey,
    transactionId: tran_id,
    GatewayPageURL,
  };
};

export const PaymentServices = {
  makePaymentIntoDB,
};

/**



 */
