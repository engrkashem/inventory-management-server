import httpStatus from 'http-status';
import { Types } from 'mongoose';
import SSLCommerz from 'sslcommerz-nodejs';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { Sales } from '../sales/sales.model';
import { sslConfig } from './payment.constant';
import { getTransactionId } from './payment.utils';

const makePaymentIntoDB = async (userId: string, orderId: string) => {
  // check if order exists
  const order = await Order.isOrderExists(orderId);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order is not found');
  }

  // check if authorized user and order creation user is same
  if (userId !== String(order?._id)) {
    if (!order) {
      throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized access');
    }
  }

  // SSLCommerz settings

  const nonce = String(order?.netAmount);
  const message = String(order?._id);
  const id = await getTransactionId(nonce + message);
  const _id = new Types.ObjectId(id);
  const tran_id = id.slice(0, 11);

  const sslcommerz = new SSLCommerz(sslConfig);
  const post_body = {};
  post_body['total_amount'] = 150.25;
  post_body['currency'] = 'BDT';
  post_body['tran_id'] = tran_id;
  post_body['success_url'] = `${config.BASE_URL}/sales/${tran_id}`;
  post_body['fail_url'] = `${config.BASE_URL}/sales/${tran_id}`;
  post_body['cancel_url'] = `${config.BASE_URL}/sales/${tran_id}`;
  post_body['emi_option'] = 0;
  post_body['cus_name'] = 'cus_name';
  post_body['cus_email'] = 'cus_email';
  post_body['cus_phone'] = 'cus_phone';
  post_body['cus_add1'] = 'Dhaka';
  post_body['cus_city'] = 'Dhaka';
  post_body['cus_country'] = 'Bangladesh';
  post_body['shipping_method'] = 'NO';
  post_body['multi_card_name'] = '';
  post_body['num_of_item'] = 1;
  post_body['product_name'] = 'none';
  post_body['product_category'] = 'none';
  post_body['product_profile'] = 'general';

  const transaction_response = await sslcommerz.init_transaction(post_body);

  const { status, sessionkey, GatewayPageURL } = transaction_response;

  if (status === 'SUCCESS') {
    await Sales.findByIdAndUpdate(
      _id,
      {
        _id,
        product: order?.product,
        buyer: order?.buyer,
        order: order?._id,
        amount: order?.netAmount,
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
