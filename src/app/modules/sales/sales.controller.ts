import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { SalesServices } from './sales.service';

const salesRootUrl = `${config.BASE_URL}/sales`;

const makePaymentToConfirmOrder = catchAsyncRequest(async (req, res) => {
  const { _id: userId } = req.user;
  const result = await SalesServices.makePaymentToConfirmOrderIntoDB(
    userId,
    req.body,
  );

  const links = {
    self: `POST: ${salesRootUrl}/make-payment`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Payment is successful and Order is confirmed',
    data: result,
    pagination: {},
    links,
  });
});

export const SalesControllers = {
  makePaymentToConfirmOrder,
};
