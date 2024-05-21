import { Schema, model } from 'mongoose';
import { OrderModel, TOrder } from './order.interface';

/*** Order Schema ***/
const orderSchema = new Schema<TOrder, OrderModel>(
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
    orderQty: {
      type: Number,
      required: [true, 'Order Quantity is required.'],
    },
    orderAmount: {
      type: Number,
      required: [true, 'Order value/price is required.'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: [true, 'Order net amount/Net price is required.'],
    },
    isPaymentOk: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

/*** Custom static methods ***/
orderSchema.statics.isOrderExists = async function (id: string) {
  return await Order.findById(id);
};

/*** Order Model ***/
export const Order = model<TOrder, OrderModel>('Order', orderSchema);
