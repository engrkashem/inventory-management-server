import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

const makePayment = catchAsyncRequest(async (req, res) => {
  const { orderId } = req.params;
  const { _id: userId } = req.user;
  const result = await PaymentServices.makePaymentIntoDB(userId, orderId);

  const links = {
    self: `GET: ${config.BASE_URL}/payments/${orderId}`,
    paymentGatewayUrl: `POST: ${result?.GatewayPageURL}`,
  };
  //4102C4422FF47C2654EC337EEB4A6187
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
