import sha256 from 'crypto-js/sha256';

import SSLCommerz from 'sslcommerz-nodejs';
import config from '../../config';
import { TUser } from '../user/user.interface';
import { sslConfig } from './payment.constant';
import { TPostBody } from './payment.interface';

export async function getUniqueId(str: string) {
  const hashedStr = sha256(str).toString();

  return hashedStr.slice(0, 24);
}

export function createTransactionId(str: string) {
  return str.slice(0, 11) as string;
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
  const post_body = {} as TPostBody;
  post_body['total_amount'] = amount;
  post_body['currency'] = 'BDT';
  post_body['tran_id'] = tran_id;
  post_body['success_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['fail_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['cancel_url'] = `${config.BASE_URL}/sales/${uid}`;
  post_body['emi_option'] = 0;
  post_body['cus_name'] =
    `${user?.name?.firstName} ${user?.name?.middleName} ${user?.name?.lastName}`;
  post_body['cus_email'] = user?.email as string;
  post_body['cus_phone'] = user?.contactNo as string;
  post_body['cus_add1'] = user?.address?.street as string;
  post_body['cus_city'] = user?.address?.district as string;
  post_body['cus_country'] = user?.address?.country as string;
  post_body['shipping_method'] = 'NO';
  post_body['multi_card_name'] = '';
  post_body['num_of_item'] = 1;
  post_body['product_name'] = 'sample';
  post_body['product_category'] = 'none';
  post_body['product_profile'] = 'general';

  const transaction_response = await sslcommerz.init_transaction(post_body);

  return { transaction_response, tran_id };
}
