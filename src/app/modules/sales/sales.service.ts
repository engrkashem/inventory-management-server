/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import { createTransactionId } from '../payment/payment.utils';
import { Product } from '../product/product.model';
import { Balance, Sales } from './sales.model';

const confirmOrderIntoDB = async (salesId: string) => {
  // check if sales created
  const sales = await Sales.isSalesExists(salesId);

  if (!sales) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Something went wrong in payment and confirming order',
    );
  }

  // check if transactionId and sales transactionId match
  const transactionId = createTransactionId(salesId);
  if (transactionId !== sales?.transactionInfo?.transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction id mismatch');
  }

  // check if order confirmation done previously
  if (sales.transactionInfo.isConfirmed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This order is already confirmed and payment received',
    );
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // Make isPaymentOk:true in order
    for (const orderInfo of sales.orderInfo) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderInfo.order,
        {
          isPaymentOk: true,
        },
        { new: true, runValidators: true, session },
      );

      if (!updatedOrder) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Order');
      }
    }

    // Make isConfirmed:true in sales collection into transactionInfo
    const updatedSales = await Sales.findByIdAndUpdate(
      sales?._id,
      {
        'transactionInfo.isConfirmed': true,
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedSales) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update transactionInfo.',
      );
    }

    // deduct product stock by order qty
    for (const orderInfo of sales.orderInfo) {
      const product = await Product.findById(orderInfo.product)
        .session(session)
        .exec();

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `product with ${orderInfo.product} id is not found`,
        );
      }

      // Deduct the quantity from the product
      product.qty -= orderInfo.qty;

      // Save the changes to the product document
      await product.save({ session });
    }
    // add balance by sales amount
    const isBalanceExists = await Balance.find();

    let balance = 0;
    if (isBalanceExists.length === 0) {
      balance = await Balance.create({ balance: sales.amount });
    } else {
      const balanceId = isBalanceExists[0]._id;
      const prevBalance = isBalanceExists[0].balance;
      balance = await Balance.findByIdAndUpdate(
        balanceId,
        {
          balance: prevBalance + sales.amount,
        },
        { new: true, runValidators: true, session },
      );
    }
    return balance.balance;

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

export const SalesServices = {
  confirmOrderIntoDB,
};

/**
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete Admin');
    }

    const userId = deletedAdmin.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
 */
