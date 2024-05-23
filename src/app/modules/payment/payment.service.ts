import httpStatus from 'http-status';
import { Types } from 'mongoose';
import SSLCommerz from 'sslcommerz-nodejs';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { Sales } from '../sales/sales.model';
import { User } from '../user/user.model';
import { sslConfig } from './payment.constant';
import { createTransactionId, getUniqueId } from './payment.utils';

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
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$netAmount' },
        ordersDetails: { $push: '$$ROOT' },
        products: { $push: '$product' },
      },
    },
  ]);

  const { ordersDetails, totalAmount, products } =
    ordersWithTotalAmountAndProducts[0];

  // check if some orders missing
  if (ordersDetails.length !== orders.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Some order are invalid');
  }

  // SSLCommerz settings
  const nonce = String(totalAmount);
  const message = orders.join('-');
  const uid = await getUniqueId(nonce + message);
  const _id = new Types.ObjectId(uid);
  const tran_id = createTransactionId(uid);

  // check if already payment completed
  const sales = await Sales.isSalesExists(uid);

  if (sales?.transactionInfo?.isConfirmed) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment already made');
  }

  const sslcommerz = new SSLCommerz(sslConfig);
  const post_body = {};
  post_body['total_amount'] = totalAmount;
  post_body['currency'] = 'BDT';
  post_body['tran_id'] = tran_id;
  post_body['success_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['fail_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['cancel_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['emi_option'] = 0;
  post_body['cus_name'] =
    `${user?.name?.firstName} ${user?.name?.middleName} ${user?.name?.lastName}`;
  post_body['cus_email'] = user?.email;
  post_body['cus_phone'] = user?.contactNo;
  post_body['cus_add1'] = user?.address?.street;
  post_body['cus_city'] = user?.address?.district;
  post_body['cus_country'] = user?.address?.country;
  post_body['shipping_method'] = 'NO';
  post_body['multi_card_name'] = '';
  post_body['num_of_item'] = 1;
  post_body['product_name'] = 'sample';
  post_body['product_category'] = 'none';
  post_body['product_profile'] = 'general';

  const transaction_response = await sslcommerz.init_transaction(post_body);

  const { status, sessionkey, GatewayPageURL } = transaction_response;

  if (status === 'SUCCESS') {
    await Sales.findByIdAndUpdate(
      _id,
      {
        _id,
        products,
        buyer: user?._id,
        orders,
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
