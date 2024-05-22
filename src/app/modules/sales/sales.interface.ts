import { Model, Types } from 'mongoose';

export type TTransactionInfo = {
  sessionkey?: string;
  transactionId?: string;
  isConfirmed: boolean;
};

export type TSales = {
  product: Types.ObjectId;
  buyer: Types.ObjectId;
  order: Types.ObjectId;
  amount: number;
  transactionInfo: TTransactionInfo;
};

export interface SalesModel extends Model<TSales> {
  isSalesExists(id: string): Promise<TSales | null>;
}
