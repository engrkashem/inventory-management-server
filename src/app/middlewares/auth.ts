import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { verifyToken } from '../modules/auth/auth.utils';
import { TRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsyncRequest from '../utils/catchAsyncRequest';

const auth = (...requiredRoles: TRole[]) => {
  return catchAsyncRequest(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];

      // checking if the client has token
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Access denied. Please Login',
        );
      }

      // check if the token is valid
      const decodedUser = verifyToken(
        token,
        config.ACCESS_TOKEN_SECRET as string,
      );

      const { email, role } = decodedUser;

      // check if user exists in db
      const user = await User.isUserExistsByEmail(email);

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found.');
      }

      // check if user deleted already
      if (user?.isDeleted) {
        throw new AppError(httpStatus.GONE, 'This User is deleted');
      }

      // check if user is blocked
      if (user?.isBlocked) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'This User is blocked');
      }

      // check if the user is authorized for this task/operation
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Authorization error.');
      }

      // noe add this decoded user to global req
      req.user = decodedUser as JwtPayload;

      // pass to next middleware
      next();
    },
  );
};

export default auth;
