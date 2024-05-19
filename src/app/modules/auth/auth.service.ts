import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TChangePassword, TJwtPayload, TLogin } from './auth.interface';
import { createToken, verifyToken, verifyUser } from './auth.utils';

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

const createTokenFromRefreshToken = async (token: string) => {
  const decodedUser = verifyToken(token, config.REFRESH_TOKEN_SECRET as string);

  const { _id } = decodedUser;

  // check if user exists
  const user = await User.isUserExists(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found.');
  }

  // check if user deleted already or blocked
  verifyUser(user);

  // Now generate new access Token
  const jwtPayload: TJwtPayload = {
    email: user?.email,
    _id: user?._id,
    role: user?.role,
  };

  const accessSecret = config.ACCESS_TOKEN_SECRET as string;
  const accessTokenExpiry = config.JWT_ACCESS_EXPIRES_IN as string;

  const accessToken = createToken(jwtPayload, accessSecret, accessTokenExpiry);

  return {
    accessToken,
  };
};

const changePasswordIntoDB = async (
  decodedUser: JwtPayload,
  payload: TChangePassword,
) => {
  const { _id } = decodedUser;
  // check if user exists and retrieve hashed password
  const user = await User.isUserExists(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if user is already deleted or blocked
  verifyUser(user);

  // check if old password and hashed password matched
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }

  // first hash new password before changing password
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  // send request to change password to db
  await User.findByIdAndUpdate(
    _id,
    {
      password: hashedNewPassword,
    },
    { new: true, runValidators: true },
  );

  return {
    deletedCount: 0,
    modifiedCount: 1,
  };
};

export const AuthServices = {
  loginIntoDB,
  createTokenFromRefreshToken,
  changePasswordIntoDB,
};
