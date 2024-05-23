import { Schema, model } from 'mongoose';
import {
  SalesModel,
  TOrderInfo,
  TSales,
  TTransactionInfo,
} from './sales.interface';

/*** Sales Schemas ***/
const orderInfoSchema = new Schema<TOrderInfo>(
  {
    order: {
      type: Schema.Types.ObjectId,
      required: [true, 'Order id is required.'],
      ref: 'Order',
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product id is required.'],
      ref: 'Product',
    },
    qty: {
      type: Number,
      required: [true, 'Quantity of product in order is required.'],
    },
    price: {
      type: Number,
      required: [true, 'Order price is required.'],
    },
  },
  {
    _id: false,
  },
);

const transactionInfoSchema = new Schema<TTransactionInfo>(
  {
    sessionkey: {
      type: String,
      default: '',
    },
    transactionId: {
      type: String,
      default: '',
    },
    isConfirmed: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
);

const salesSchema = new Schema<TSales, SalesModel>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      required: [true, 'Buyer/User id is required.'],
      ref: 'User',
    },
    orderInfo: [orderInfoSchema],
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    transactionInfo: transactionInfoSchema,
  },
  {
    timestamps: true,
  },
);

/*** Custom static methods ***/
salesSchema.statics.isSalesExists = async function (id: string) {
  return await Sales.findById(id);
};

/*** Sales Model ***/
export const Sales = model<TSales, SalesModel>('Sales', salesSchema);
