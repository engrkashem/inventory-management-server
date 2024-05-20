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

const refreshToken = catchAsyncRequest(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.createTokenFromRefreshToken(refreshToken);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Access Token retrieved successfully.',
    data: result,
    pagination: {},
    links: {
      self: `POST: ${config.BASE_URL}/auth/refresh-token`,
    },
  });
});

const changePassword = catchAsyncRequest(async (req, res) => {
  const result = await AuthServices.changePasswordIntoDB(req.user, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Password Changed successfully.',
    data: result,
    pagination: {},
    links: {
      self: `POST: ${config.BASE_URL}/auth/change-password`,
    },
  });
});

const forgotPassword = catchAsyncRequest(async (req, res) => {
  const { email } = req.body;

  const result = await AuthServices.forgotPasswordDB(email);

  const links = {
    self: `POST: ${config.BASE_URL}/auth/forgot-password`,
  };

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Password reset link is generated successfully',
    data: result,
    pagination: {},
    links,
  });
});

const resetPassword = catchAsyncRequest(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const result = await AuthServices.resetPasswordDB(req.body, token as string);

  const links = {
    self: `POST: ${config.BASE_URL}/auth/reset-password`,
  };

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'Password reset is successful',
    data: result,
    pagination: {},
    links,
  });
});

export const AuthControllers = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
