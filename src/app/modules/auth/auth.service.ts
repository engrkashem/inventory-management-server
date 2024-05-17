import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TJwtPayload, TLogin } from './auth.interface';
import { createToken, verifyUser } from './auth.utils';

const loginIntoDB = async (payload: TLogin) => {
  const { email, password } = payload;

  // check if user exists in db
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(404, 'User is not found. Register first.');
  }

  // check if user is blocked or deleted already
  verifyUser(user);

  // check if user provided password matches with saved hashed password
  if (!(await User.isPasswordMatched(password, user?.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Wrong password');
  }

  // now generate tokens for this user
  const jwtPayload: TJwtPayload = {
    email: user?.email,
    _id: user?._id,
    role: user?.role,
  };

  // generate access token
  const accessSecret = config.ACCESS_TOKEN_SECRET as string;
  const accessTokenExpiry = config.JWT_ACCESS_EXPIRES_IN as string;

  const accessToken = createToken(jwtPayload, accessSecret, accessTokenExpiry);

  // generate refresh token
  const refreshSecret = config.REFRESH_TOKEN_SECRET as string;
  const refreshTokenExpiry = config.JWT_REFRESH_EXPIRES_IN as string;

  const refreshToken = createToken(
    jwtPayload,
    refreshSecret,
    refreshTokenExpiry,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginIntoDB,
};
