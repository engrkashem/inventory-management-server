import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { SalesServices } from './sales.service';

const salesRootUrl = `${config.BASE_URL}/sales`;

const confirmOrder = catchAsyncRequest(async (req, res) => {
  const { salesId } = req.params;
  const result = await SalesServices.confirmOrderIntoDB(salesId);

  const links = {
    self: `POST: ${salesRootUrl}/${salesId}`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Payment is successful and Order is confirmed',
    data: result,
    links,
  });
});

export const SalesControllers = {
  confirmOrder,
};
