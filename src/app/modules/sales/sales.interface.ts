import { Model, Types } from 'mongoose';

export type TTransactionInfo = {
  sessionkey?: string;
  transactionId?: string;
  isConfirmed: boolean;
};

export type TOrderInfo = {
  order: Types.ObjectId;
  product: Types.ObjectId;
  qty: number;
  price: number;
};

export type TSales = {
  buyer: Types.ObjectId;
  orderInfo: TOrderInfo[];
  amount: number;
  transactionInfo: TTransactionInfo;
};

export interface SalesModel extends Model<TSales> {
  isSalesExists(id: string): Promise<TSales | null>;
}
