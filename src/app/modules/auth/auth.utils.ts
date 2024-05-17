import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { TJwtPayload } from './auth.interface';

export const createToken = (
  jwtPayload: TJwtPayload,
  jwtSecret: string,
  expiresIn: string,
) =>
  jwt.sign(jwtPayload, jwtSecret, {
    expiresIn,
  });

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
};

export const verifyUser = (user: TUser) => {
  // check if user deleted already
  if (user?.isDeleted) {
    throw new AppError(httpStatus.GONE, 'This User is deleted');
  }

  // check if user is blocked
  if (user?.isBlocked) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This User is blocked');
  }
};
