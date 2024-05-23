import { Model, Types } from 'mongoose';

export type TTransactionInfo = {
  sessionkey?: string;
  transactionId?: string;
  isConfirmed: boolean;
};

export type TSales = {
  products: [Types.ObjectId];
  buyer: Types.ObjectId;
  orders: [Types.ObjectId];
  amount: number;
  transactionInfo: TTransactionInfo;
};

export interface SalesModel extends Model<TSales> {
  isSalesExists(id: string): Promise<TSales | null>;
}
