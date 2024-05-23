import sha256 from 'crypto-js/sha256';

import SSLCommerz from 'sslcommerz-nodejs';
import config from '../../config';
import { TUser } from '../user/user.interface';
import { sslConfig } from './payment.constant';

export async function getUniqueId(str) {
  const hashedStr = sha256(str).toString();

  return hashedStr.slice(0, 24);
}

export function createTransactionId(str) {
  return str.slice(0, 11);
}

export async function initializeSSLCommerzPayment(
  orders: string[],
  amount: number,
  user: TUser,
  uid: string,
) {
  // SSLCommerz settings

  const tran_id = createTransactionId(uid);

  const sslcommerz = new SSLCommerz(sslConfig);
  const post_body = {};
  post_body['total_amount'] = amount;
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

  return { transaction_response, tran_id };
}
