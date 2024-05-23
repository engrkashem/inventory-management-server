import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

const makePayment = catchAsyncRequest(async (req, res) => {
  const { _id: userId } = req.user;
  const { orders } = req.body;
  const result = await PaymentServices.makePaymentIntoDB(userId, orders);

  const links = {
    self: `GET: ${config.BASE_URL}/payments`,
    paymentGatewayUrl: `POST: ${result?.GatewayPageURL}`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'gateway link is sent successfully',
    data: result,
    pagination: {},
    links,
  });
});

export const PaymentControllers = {
  makePayment,
};
