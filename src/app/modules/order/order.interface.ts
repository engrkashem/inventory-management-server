import { Model, Types } from 'mongoose';

export type TOrder = {
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
