import { Schema, model } from 'mongoose';
import { SalesModel, TSales, TTransactionInfo } from './sales.interface';

/*** Sales Schema ***/
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
    products: [
      {
        type: Schema.Types.ObjectId,
        required: [true, 'Product id is required.'],
        ref: 'Product',
      },
    ],
    buyer: {
      type: Schema.Types.ObjectId,
      required: [true, 'Buyer/User id is required.'],
      ref: 'User',
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        required: [true, 'Order id is required.'],
        ref: 'Order',
      },
    ],
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
