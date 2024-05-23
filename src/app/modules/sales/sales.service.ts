/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { createTransactionId } from '../payment/payment.utils';
import { Sales } from './sales.model';

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

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    console.log(sales);

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
