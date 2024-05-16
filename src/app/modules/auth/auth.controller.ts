import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const login = catchAsyncRequest(async (req, res) => {
  const result = await AuthServices.loginIntoDB(req.body);

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'User login is successful.',
    data: result,
  });
});

export const AuthControllers = {
  login,
};
