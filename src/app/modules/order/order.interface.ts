import { Model, Types } from 'mongoose';

export type TOrder = {
  _id: string;
  product: Types.ObjectId;
  buyer: Types.ObjectId;
  orderQty: number;
  orderAmount: number;
  discount: number;
  netAmount: number;
  isPaymentOk: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
};

export interface OrderModel extends Model<TOrder> {
  isOrderExists(id: string): Promise<TOrder | null>;
}

export type TAddToCartIntoDBPayload = {
  product: string;
  orderQty: number;
  discount?: number;
};
