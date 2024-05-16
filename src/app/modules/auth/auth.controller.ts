import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const login = catchAsyncRequest(async (req, res) => {
  const result = await AuthServices.loginIntoDB(req.body);

  const { accessToken, refreshToken } = result;

  // set refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  const links = {
    self: `POST: ${config.BASE_URL}/auth/login`,
    allProducts: `GET: ${config.BASE_URL}/products`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'User login is successful.',
    data: {
      accessToken,
    },
    links,
  });
});

export const AuthControllers = {
  login,
};
