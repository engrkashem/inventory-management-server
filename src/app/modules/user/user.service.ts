import httpStatus from 'http-status';
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

const updateUserIntoDB = async (userId: string, payload: Partial<TUser>) => {
  //check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found.');
  }

  // prevent user from changing email and password
  payload.email = user.email;
  payload.password = user.password;

  // Dynamically format name & address to update db
  const { name, address, ...remainingUserData } = payload;

  const modifiedUserData: Record<string, unknown> = {
    ...remainingUserData,
  };

  // process name
  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedUserData[`name.${key}`] = val;
    }
  }

  // process address
  if (address && Object.keys(address).length) {
    for (const [key, val] of Object.entries(address)) {
      modifiedUserData[`address.${key}`] = val;
    }
  }

  // update user info
  const result = await User.findByIdAndUpdate(user._id, modifiedUserData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
};
