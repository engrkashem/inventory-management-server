import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  // check if user already exists
  const user = await User.findOne({ email: userData?.email });

  if (user) {
    throw new AppError(400, 'This Email already exists. Please Login');
  }

  // create user
  const result = await User.create(userData);

  return result;
};

export const UserServices = {
  createUserIntoDB,
};
