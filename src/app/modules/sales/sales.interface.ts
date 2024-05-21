import { Model, Types } from 'mongoose';

export type TSales = {
  product: Types.ObjectId;
  buyer: Types.ObjectId;
  order: Types.ObjectId;
  balance: number;
  transactionInfo: string;
};

export interface SalesModel extends Model<TSales> {
  isSalesExists(id: string): Promise<TSales | null>;
}
