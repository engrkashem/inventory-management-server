import { Schema, model } from 'mongoose';
import { SalesModel, TSales } from './sales.interface';

/*** Sales Schema ***/
const salesSchema = new Schema<TSales, SalesModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product id is required.'],
      ref: 'Product',
    },
    buyer: {
      type: Schema.Types.ObjectId,
      required: [true, 'Buyer/User id is required.'],
      ref: 'User',
    },
    order: {
      type: Schema.Types.ObjectId,
      required: [true, 'Order id is required.'],
      ref: 'Order',
    },
    balance: {
      type: Number,
      required: [true, 'Balance Amount is required.'],
    },
    transactionInfo: {
      type: String,
      required: [true, 'Transaction information is required.'],
    },
  },
  {
    timestamps: true,
  },
);

/*** Sales Model ***/
export const Sales = model<TSales, SalesModel>('Sales', salesSchema);
